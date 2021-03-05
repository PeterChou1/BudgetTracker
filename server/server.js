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
// Construct a schema, using GraphQL schema language
const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
});
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
/*
const plaid = require('plaid');
*/
var app = express();
app.use(cors({
  credentials: true,
  origin: [
    'http://localhost:4000',
    'http://localhost:3000'
  ]
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
      console.log(error);
      return ({
        message: error.message,
        locations: error.locations,
        stack: error.stack ? error.stack.split('\n') : [],
        path: error.path,
      })
    }
  })(req, res);
});


app.listen(4000, () => {
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});