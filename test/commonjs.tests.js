var expect = require('chai').expect;
var freeants = require('../dist/FreeAnts.min.js');

describe('TestClass', function () {
  it('is contained within FreeAnts as CommonJS', function () {
    expect(freeants).to.be.an('object');
    expect(freeants.TestClass).to.not.be.null;
  });

  it('can be instantiated', function () {
    var t = new freeants.TestClass('foo');
    expect(t).to.be.defined;
  });
});
