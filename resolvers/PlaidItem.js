async function accounts(parent, args, {client}) {
    const response = await client.getAccounts(parent.accesstoken);
    const accounts = response.accounts;
    return accounts;
}


module.exports = {
    accounts
};