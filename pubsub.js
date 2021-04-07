const { PubSub } = require("graphql-subscriptions");
// get singleton pubsub instance
var pubsub = new PubSub();
module.exports = {
  events: {
    transactionUpdate: "TRANS_UPDATE",
  },
  getInstance: () => pubsub,
};
