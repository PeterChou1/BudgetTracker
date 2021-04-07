const moment = require("moment");

const Groups = {
    TRANSACTION : "TRANSACTION",
    DAY : "DAY",
    WEEK : "WEEK",
    MONTH : "MONTH",
    CATEGORY_1 : "CATEGORY_1",
    CATEGORY_2 : "CATEGORY_2",
    NAME : "NAME"
};

const SortBy = {
    DATE: "DATE",
    AMOUNT: "AMOUNT",
    ALPHA: "ALPHA"
};

async function items (parent, args, {res, req, prisma }) {
    var itemsRes = await prisma.user.findUnique({ where: { id: parent.id } }).items();
    if (args.containsid) itemsRes = itemsRes.filter(value => {
        return args.containsid.includes(value.itemId);
    });
    return itemsRes;
}

async function getTransaction(parent, {items, startDate, endDate, group, sortBy, sort, skip, take, filter, min, max}, {client, prisma}) {
    var itemsRes = await prisma.user.findUnique({ where: { id: parent.id } }).items();
    // validate start and end date
    if (!moment(startDate, "YYYY-MM-DD").isValid() || !moment(startDate, "YYYY-MM-DD").isValid()) throw new Error('invalid date format');
    if (!group) group = Groups.TRANSACTION;
    if (!sortBy) sortBy = SortBy.DATE;
    if (!sort) sort = "ASC";
    if (!filter) filter = [];
    var response = [];
    for (var serverItem of itemsRes) {
        const data = items.find(i => i.itemId == serverItem.itemId);
        if (data !== undefined) {
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
    if (filter.length > 0) {
        response = response.filter(r => filter.reduce((acc, filterToken) => {
            if  (Array.isArray(r[filterToken.matchPath])) {
                return acc || r[filterToken.matchPath].reduce((acc, cat) => acc || cat.toLowerCase().includes(filterToken.match.toLowerCase()), false);
            } else {
                return acc || r[filterToken.matchPath] === filterToken.match;
            }
        }, false));  
    }
    var grouped = groupBy(response, group);
    var sorted = sortTrans(grouped, sortBy, sort, group);
    return sorted;
}


function sortTrans(transactions, sortBy, sort, groupBy) {
    const getSortfn = (dateCmpFn) => (a, b) => {
        if (sort === "DESC") [a, b] = [b, a];
        switch (sortBy) {
            case SortBy.AMOUNT:
                return a.amount - b.amount;
            case SortBy.DATE:
                return dateCmpFn(a, b);
        }
    };
    switch (groupBy) {
        case Groups.TRANSACTION:
        case Groups.DAY:
            transactions.sort(getSortfn((a, b) => new Date(a.date) - new Date(b.date)));
            break;
        case Groups.WEEK:
            transactions.sort(getSortfn((a, b) => new moment(a.groupid, "YYYY [week] ww")
                        .diff(new moment(b.groupid, "YYYY [week] ww"))));
            break;
        case Groups.MONTH:
            transactions.sort(getSortfn((a, b) => new moment(a.groupid).diff(new moment(b.groupid))));
        default:
            transactions.sort((a, b) => { 
                if (sort === "ASC") [a, b] = [b, a];
                return a.amount - b.amount;
            });
    }
    return transactions;
}


function groupBy(transactions, groupid) {
    if (groupid === "TRANSACTION")
        return transactions;
    return transactions.reduce((group, trans) => {
        var id;
        var date = moment(trans.date);
        console.log('category');
        console.log(trans.category);
        switch (groupid) {
            case Groups.DAY:
                id = date.format("YYYY-MM-DD");
                break;
            case Groups.WEEK:
                id = date.format("YYYY [week] ww");
                break;
            case Groups.MONTH:
                id = date.format("YYYY-MM");
                break;
            case Groups.CATEGORY_1:
                id = trans.category[0];
                break;
            case Groups.CATEGORY_2:
                console.log(trans.category);
                id = trans.category.join(' ');
                break;
            case Groups.NAME:
                id = trans.merchant_name ? trans.merchant_name : "misc";
                break;
            default:
                id = "";
        }
        //console.log(id);
        if (id !== "") {
            const groupfound = group.find(g =>  g.groupid === id);
            if (groupfound) {
                groupfound.amount += trans.amount;
                groupfound.transactions.push(trans);
            } else {
                group.push({
                    groupid: id,
                    amount: trans.amount,
                    transactions: [trans]
                });
            }
        }
        return group;
    }, []);
}

module.exports = {
    items,
    getTransaction
};