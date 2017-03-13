import _ from 'lodash';
import Kapow from 'kapow';

class PayloadHandler {

  constructor(formatter) {
    this.formatter = formatter;
  }

  create (config, data) {
    config.singleResult = true;
    return {
      code: '201',
      data: this.formatter.process(data, config),
      headers: {
        location: this.formatter.selfUrl(data)
      }
    };
  }

  createRelation (config, data) {
    return {
      code: '204',
      data: null
    };
  }

  read (config, data) {
    if ((!data || data.length === 0 && data.singleResult) && data.mode !== 'related') {
      return this.error(Kapow(404, 'Resource not found.'));
    }

    return {
      code: '200',
      data: this.formatter.process(data, {
        singleResult: data.singleResult,
        include: data.relations,
        mode: data.mode,
        baseType: data.baseType,
        baseId: data.baseId,
        baseRelation: data.baseRelation
      })
    };
  }

  readRelated (config, data) {
    return this.read(config, data);
  }

  readRelation (config, data) {
    return this.read(config, data);
  }

  update (config, data) {
    if (data) {
      return {
        code: '200',
        data: this.formatter.process(data, config)
      };
    }
    return {
      code: '204',
      data: null
    };
  }

  updateRelation (config, data) {
    return {
      code: '204',
      data: null
    };
  }

  destroy () {
    return {
      code: '204',
      data: null
    };
  }

  destroyRelation () {
    return {
      code: '204',
      data: null
    };
  }

  error (errs, defaultErr) {
    var resp;

    defaultErr = defaultErr || 400;
    errs = errs || [Kapow(defaultErr)];

    if (!Array.isArray(errs)) {
      errs = [errs];
    }

    resp = _.transform(errs, function(result, err) {
      if (!err.httpStatus) {
        err = Kapow.wrap(err, defaultErr);
      }

      var httpStatus = err.httpStatus;

      result.code[httpStatus] = result.code[httpStatus] ? result.code[httpStatus] + 1 : 1;

      result.data.errors.push({
        title: err.title,
        detail: err.message
      });
    }, {
      code: {},
      data: {
        errors: []
      }
    });

    resp.code = _.reduce(resp.code, function(result, n, key) {
      if (!result || n > resp.code[result]) {
        return key;
      }
      return result;
    }, '');

    return resp;
  }

}

export default PayloadHandler;
