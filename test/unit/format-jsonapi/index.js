import {expect} from 'chai';
import _ from 'lodash';

import JsonApiFormat from '../../../src/format-jsonapi';

describe('JsonApiFormat', function () {

  let formatter;

  beforeEach(() => {
    formatter = new JsonApiFormat({
      store: {
        id(model) {
          return model.id;
        },
        type(model) {
          return model.type;
        },
        isMany(model) {
          return Array.isArray(model);
        },
        related(relateTo, node) {
          return require('../../../src/store-bookshelf/lib/related')(relateTo, node);
        },
        modelsFromCollection(collection) {
          return collection;
        },
        allRelations(model) {
          if (model.type !== 'model') {
            return [];
          }
          return ['wacca'];
        },
        toOneRelations(model) {
          if (model.type !== 'model') {
            return [];
          }
          return ['wacca'];
        },
        serialize(data) {
          return JSON.parse(JSON.stringify(data));
        }
      }, });
  });

  describe('constructor', () => {

    it('should throw if no store is specified', () => {
      expect(() => {
        new JsonApiFormat();
      }).to.throw('No store specified.');
    });

  });

  describe('#format', function () {

    it('should return data in the correct format', function () {
      const input = {
        id: 1,
        type: 'model',
        foo: 'bar',
        related() {
          return [];
        }
      };
      const output = formatter.format(_.clone(input), []);
      expect(output.id).to.equal(input.id);
      expect(output.type).to.equal(input.type);
      expect(output.attributes).to.deep.equal(_.omit(input, ['id', 'type', 'related']));
    });

  });

  describe('#process', function () {

    it('should return data in the correct format', function () {
      const input = {
        id: 1,
        type: 'model',
        foo: 'bar',
        related() {
          return {
            id: 50,
            type: 'wacca',
            bar: 'foo',
            related() {
              return [];
            }
          };
        },
      };
      const output = formatter.process(input, {
        relations: ['wacca']
      });

      expect(output.data).to.be.a('object');
      expect(output.data.id).to.equal(input.id);
      expect(output.data.type).to.equal(input.type);
      expect(output.data.attributes).to.deep.equal(cleanInput(input));

      expect(output.data.relationships).to.be.a('object');
      expect(output.data.relationships.wacca.links.related).to.equal('/1/wacca');

      expect(output.included).to.be.a('array');
      expect(output.included.length).to.equal(1);
      expect(output.included[0].id).to.equal(input.related().id);
      expect(output.included[0].type).to.equal(input.related().type);
      expect(output.included[0].attributes).to.deep.equal(cleanInput(input.related()));
    });

    it('should return data in the correct format (array)', function () {
      const input = [
        {
          id: 1,
          type: 'model',
          foo: 'bar',
          related() {
            return [];
          }
        },
        {
          id: 2,
          type: 'model',
          foo: 'bar',
          related() {
            return [];
          }
        }
      ];
      const output = formatter.process(input, {});
      expect(output.data).to.be.a('array');
      expect(output.data[0].id).to.equal(input[0].id);
      expect(output.data[0].type).to.equal(input[0].type);
      expect(output.data[0].attributes).to.deep.equal(cleanInput(input[0]));
      expect(output.data[1].id).to.equal(input[1].id);
      expect(output.data[1].type).to.equal(input[1].type);
      expect(output.data[1].attributes).to.deep.equal(cleanInput(input[1]));
    });

    function cleanInput(input) {
      return _.omit(JSON.parse(JSON.stringify(input)), ['id', 'type']);
    }

  });

});

