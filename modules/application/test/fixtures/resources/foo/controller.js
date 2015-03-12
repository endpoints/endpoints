module.exports = {
  adapter: {
    relations: function () {
      return ['bar', 'baz'];
    },
    filters: function () {
      return ['id', 'qux'];
    }
  }
};
