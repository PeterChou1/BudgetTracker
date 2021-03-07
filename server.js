require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const jwt = require('express-jwt');
const fs = require('fs');
const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql')).toString('utf-8');
const resolvers = require('./resolvers');
const { makeExecutableSchema } = require('graphql-tools');
// import directives
const { authDirectiveTypeDefs, authDirectiveTransformer } = require('./directives/auth');
// Construct a schema, using GraphQL schema language
const schema = makeExecutableSchema({
    typeDefs:  [authDirectiveTypeDefs, typeDefs],
    resolvers: resolvers,
    schemaTransforms: [authDirectiveTransformer],
});
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const env = process.env.NODE_ENV || "development";
const port = Number(process.env.PORT || 4000);

/*
const plaid = require('plaid');
*/
var app = express();

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

app.use('/graphql', (req, res) => { 
  /* pass response object to graphQL enabling us to set cookies */
  return graphqlHTTP({
    schema,
    graphiql: true,
    context: {req, res, prisma},
    customFormatErrorFn: (error) => {
      return ({
        message: error.message,
        locations: error.locations,
        stack: error.stack ? error.stack.split('\n') : [],
        path: error.path,
      });
    }
  })(req, res);
});


app.listen(port, () => {
  console.log(`running in ${env} mode`);
  console.log(`server running on http://localhost:${port}/graphql`);
});