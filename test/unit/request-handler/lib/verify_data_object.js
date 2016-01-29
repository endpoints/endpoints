import {expect} from 'chai';

import verifyDataObject from '../../../../src/request-handler/lib/verify_data_object';

describe('verifyDataObject', () => {

  const createEndpoint = {
    config: {
      method: 'create',
    },
  };
  const updateEndpoint = {
    config: {
      method: 'update',
    },
  };

  it('should return an error if the data does not exist', () => {
    expect(verifyDataObject({body:{}}, createEndpoint)).to.be.instanceof(Error);
  });

  it('should return an error if the data is not an object', () => {
    expect(verifyDataObject({body:{data:''}}, createEndpoint)).to.be.instanceof(Error);
  });

  it('should return an error if the data type is not a string', () => {
    expect(verifyDataObject({params: {id: 1}, body:{data:{type:1}}}, updateEndpoint)).to.be.instanceof(Error);
  });

  it('should return an error if the data type is not a string (array)', () => {
    expect(verifyDataObject({params: {id: 1}, body:{data:[{type:1}]}}, updateEndpoint)).to.be.instanceof(Error);
  });

  it.skip('should return an error if the data type does not match the endpoint type', () => {
    expect(verifyDataObject({params: {id: 1}, body:{data:{type:'authors'}}}, {typeName:'books'})).to.be.instanceof(Error);
  });

  it.skip('should return an error if the data id does not match the endpoint id', () => {
    expect(verifyDataObject({params: {id: 1}, body:{data:{type:'books', id:2}}}, {typeName:'books'})).to.be.instanceof(Error);
  });

  it.skip('should have no return value if the data id and type matches the endpoint id and type', () => {
    expect(verifyDataObject({params: {id: 1}, body:{data:{type:'authors', id:1}}}, {typeName:'authors'})).to.be.undefined;
  });

  it.skip('should have no return value if there is no id in the body and and the type matches the endpoint type', () => {
    expect(verifyDataObject({params: {id: 1}, body:{data:{type:'authors'}}}, {typeName:'authors'})).to.be.undefined;
  });
});
