module.exports = {
  source: {
    relations: function () {
      return ['bar', 'baz'];
    },
    filters: function () {
      return {
        qux: true
      };
    }
  }
};
