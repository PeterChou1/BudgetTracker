const moment = require("moment");

async function items (parent, args, {res, req, prisma }) {
    var itemsRes = await prisma.user.findUnique({ where: { id: parent.id } }).items();
    if (args.containsid) itemsRes = itemsRes.filter(value => {
        return args.containsid.includes(value.itemId);
    });
    return itemsRes;
}


async function getTransaction(parent, {items, startDate, endDate, skip, take}, {client, prisma}) {
    var itemsRes = await prisma.user.findUnique({ where: { id: parent.id } }).items();
    // validate start and end date
    if (!moment(startDate, "YYYY-MM-DD").isValid() || !moment(startDate, "YYYY-MM-DD").isValid()) throw new Error('invalid date format');
    var response = [];
    for (var serverItem of itemsRes) {
        const data = items.find(i => i.itemId == serverItem.itemId);
        if (data !== undefined) {
            // thank professor thiery for enlightening me on the power of promises
            // no more evil async await
            response.push(client.getTransactions(serverItem.accesstoken, startDate, endDate, {
                account_ids : data.accounts,
                count: take === undefined ? take : 100,
                offset: skip === undefined ? skip : 0   
            }));
        }
    }
    response = (await Promise.all(response)).reduce((prev, cur) => {
        return prev.concat(cur.transactions);
    }, []);
    // group
    // two level sort
    // sort by date
    console.log(response);
    response.sort((a, b) => new Date(a.date) - new Date(b.date));
    return response;
}

module.exports = {
    items,
    getTransaction
};