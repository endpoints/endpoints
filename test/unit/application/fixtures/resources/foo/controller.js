import model from './model';
export default {
  model,
  url: '/foo',
  capabilities: {
    includes: ['bar', 'baz'],
    filters: ['id', 'qux']
  }
};
