function randomKey(size) {
  var key = "";
  for (let i = 0; i < size; i++) {
    key += Math.floor(Math.random() * 16).toString(16);
  }

  return key;
}

module.exports = {
  randomKey,
};
