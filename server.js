require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const jwt = require('express-jwt');
const http = require('http');
const fs = require('fs');
const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql')).toString('utf-8');
const resolvers = require('./resolvers');
const { makeExecutableSchema } = require('graphql-tools');
// import directives
const { authDirective, authDirectiveTypeDefs } = require('./directives/auth');
// Construct a schema, using GraphQL schema language
const schema = makeExecutableSchema({
    typeDefs:  [authDirectiveTypeDefs, typeDefs],
    resolvers: resolvers,
    schemaTransforms: [authDirective],
});

// init data base client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const env = process.env.NODE_ENV || "development";
const port = Number(process.env.PORT || 4000);
var app = express();

// init plaid client
const plaid = require('plaid');
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

// force heroku to use https by default
// code from https://jaketrent.com/post/https-redirect-node-heroku
if(process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`);
    else
      next()
  });
}
//app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "build")));
app.use(cors({
  credentials: true,
  origin: env === "development" ? [
    'http://localhost:4000',
    'http://localhost:3000'
  ] : true
}));
app.use(cookieParser());
app.use(jwt({
  secret: process.env.APP_SECRET,
  algorithms: [process.env.DEFAULT_ALG],
  credentialsRequired: false,
  getToken: (req) => {
    console.log('request recieved');
    if (req.cookies.id) {
      console.log(`extract token ${req.cookies.id}`);
      return req.cookies.id;
    } 
    return null;
  }
}));


// used 
app.use('/webhook/:itemid/', (req, res) => {

});

app.use('/graphql', (req, res) => {
  // get host name
  const client = new plaid.Client({
    clientID: PLAID_CLIENT_ID,
    secret: PLAID_SECRET,
    env: plaid.environments[PLAID_ENV],
    //webhook: `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}//${req.header('host')}`,
    options: {
      version: '2019-05-29',
    },
  });
  return graphqlHTTP({
    schema,
    graphiql: true,
    // req, res (express) prisma (database connector) client (plaid client)
    context: {req, res, prisma, client},
    customFormatErrorFn: (error) => {
      console.log('error occured');
      console.log(error);
      return ({
        message: error.message,
        locations: error.locations,
        stack: error.stack ? error.stack.split('\n') : [],
        path: error.path,
        statusCode: 401
      });
    }
  })(req, res);
});

app.listen(port, () => {
  console.log(`running in ${env} mode`);
  console.log(`server running on http://localhost:${port}/graphql`);
});
