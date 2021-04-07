const { withFilter } = require("graphql-subscriptions");
const pubsub = require("../pubsub");
const pubsubInstance = pubsub.getInstance();
const transactionUpdate = {
  resolve: (payload) => payload,
  subscribe: withFilter(
    () => pubsubInstance.asyncIterator([pubsub.events.transactionUpdate]),
    async (payload, { items }, { prisma, userId }) => {
      var itemIds = (
        await prisma.user.findUnique({ where: { id: userId } }).items()
      ).map((i) => i.itemId);
      const ownsItem = itemIds.includes(payload.item_id);
      if (items) {
        console.log(items.map((i) => i.itemId));
        console.log(payload.item_id);
        console.log(
          ownsItem && items.map((i) => i.itemId).includes(payload.item_id)
        );
        return ownsItem && items.map((i) => i.itemId).includes(payload.item_id);
      }
      return true;
    }
  ),
};

module.exports = {
  transactionUpdate: transactionUpdate,
};
