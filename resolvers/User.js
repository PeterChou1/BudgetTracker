
async function items (parent, args, {res, req, prisma }) {
    var itemsRes = await prisma.user.findUnique({ where: { id: parent.id } }).items();
    if (args.containsid) itemsRes = itemsRes.filter(value => {
        return args.containsid.includes(value.itemId);
    });
    console.log(args);
    console.log(itemsRes);
    return itemsRes;
}

module.exports = {
    items
};