function __resolveType(obj) {
    if (obj.account_id) {
      return 'Transaction';
    }
    if (obj.groupid) {
      return 'Group';
    }
    return null;
}

module.exports = {
    __resolveType
};
