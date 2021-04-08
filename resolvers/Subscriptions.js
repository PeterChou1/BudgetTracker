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
      if (items && items.length > 0) {
        return ownsItem && items.map((i) => i.itemId).includes(payload.item_id);
      }
      return true;
    }
  ),
};

module.exports = {
  transactionUpdate,
};
