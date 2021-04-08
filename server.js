require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cookie = require("cookie");
const path = require("path");
const { createServer } = require("http");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { graphqlHTTP } = require("express-graphql");
const pubsub = require("./pubsub");
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const typeDefs = fs
  .readFileSync(path.join(__dirname, "schema.graphql"))
  .toString("utf-8");
const resolvers = require("./resolvers");
const { makeExecutableSchema } = require("graphql-tools");
// import directives
const { authDirective, authDirectiveTypeDefs } = require("./directives/auth");
// Construct a schema, using GraphQL schema language
const schema = makeExecutableSchema({
  typeDefs: [authDirectiveTypeDefs, typeDefs],
  resolvers: resolvers,
  schemaTransforms: [authDirective],
});
// init data base client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const env = process.env.NODE_ENV || "development";
const port = Number(process.env.PORT || 4000);
const pubsubInstance = pubsub.getInstance();
var app = express();
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
// init plaid client
const plaid = require("plaid");
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";
const client = new plaid.Client({
  clientID: PLAID_CLIENT_ID,
  secret: PLAID_SECRET,
  env: plaid.environments[PLAID_ENV],
  options: {
    version: "2019-05-29",
  },
});

// force heroku to use https by default
// code from https://jaketrent.com/post/https-redirect-node-heroku
if (env === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(`https://${req.header("host")}${req.url}`);
    else next();
  });
}
app.use(express.static(path.join(__dirname, "client", "build")));
app.use(
  cors({
    credentials: true,
    origin:
      env === "development"
        ? ["http://localhost:4000", "http://localhost:3000"]
        : true,
  })
);
app.use(cookieParser());
app.use(
  jwt({
    secret: process.env.APP_SECRET,
    algorithms: [process.env.DEFAULT_ALG],
    credentialsRequired: false,
    getToken: (req) => {
      if (req.cookies.id) {
        return req.cookies.id;
      }
      return null;
    },
  })
);
// webhook test
app.use("/webhook/:itemid/", jsonParser, (req) => {
  pubsubInstance.publish(pubsub.events.transactionUpdate, req.body);
});

app.use("/graphql", (req, res) => {
  // get host name
  return graphqlHTTP({
    schema,
    graphiql: {
      subscriptionEndpoint:
        env === "production"
          ? `wss://${req.header("host")}/subscriptions`
          : `ws://localhost:${port}/subscriptions`,
    },
    // req, res (express) prisma (database connector) client (plaid client)
    context: { req, res, prisma, client },
    customFormatErrorFn: (error) => {
      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack ? error.stack.split("\n") : [],
        path: error.path,
        statusCode: 401,
      };
    },
  })(req, res);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const server = createServer(app);

server.listen(port, () => {
  console.log(`running in ${env} mode`);
  console.log(`server running on http://localhost:${port}/graphql`);
  console.log(
    `subscription services running on ws://localhost:${port}/subscriptions`
  );
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
      onConnect: async (connectionParams, webSocket) => {
        // manually parse cookie and decode algorithmn
        const parsecookie = cookie.parse(webSocket.upgradeReq.headers.cookie);
        var token;
        try {
          token = jsonwebtoken.verify(parsecookie.id, process.env.APP_SECRET, {
            algorithms: [process.env.DEFAULT_ALG],
          });
        } catch (e) {
          throw new Error("not authenticated");
        }
        // return all item Id will be used to determine which user recieve what updates
        return {
          prisma,
          userId: token.userId,
        };
      },
    },
    {
      server: server,
      path: "/subscriptions",
    }
  );
});
