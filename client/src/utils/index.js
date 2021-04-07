const transformCheck = (checked) => {
  const transform = [];
  for (var prop in checked) {
    if (Object.prototype.hasOwnProperty.call(checked, prop)) {
      transform.push({
        itemId: prop,
        accounts: checked[prop],
      });
    }
  }
  return transform;
};

module.exports = {
  transformCheck,
};
