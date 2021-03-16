


async function accounts(parent, args, {client}) {
    const response = await client.getAccounts(parent.accesstoken).catch((err) => {
        if (err !== null) throw Error(err);
    });
    const accounts = response.accounts;
    return accounts;
}


module.exports = {
    accounts
};