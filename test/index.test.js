const expect = require('chai').expect;
const Parser = require('../');

describe('Parser#evaluate', function () {
  describe('Error handling', () => {
    it('returns an object on error', () => {
      const value = Parser.evaluate('1++');

      expect(value).to.be.an('object');
    });
  });

  describe('prefix operations', () => {
    it('evaluates SUM(1,2)', function () {
      const formula = 'SUM(1,2)';
      const value = Parser.evaluate(formula);

      expect(value).to.equal(3);
    });

    it('evaluates AVERAGE(1,2,3)', function () {
      const formula = 'AVERAGE(1,2,3)';
      const value = Parser.evaluate(formula);

      expect(value).to.equal(2);
    });
  });

  describe('binary ops, two operands', function () {
    // TODO bidmas
    it('evaluates +', function () {
      const formula = '1+2';
      const value = Parser.evaluate(formula);

      expect(value).to.equal(3);
    });

    it('evaluates -', function () {
      const formula = '1-2';
      const value = Parser.evaluate(formula);

      expect(value).to.equal(-1);
    });

    it('evaluates *', function () {
      const formula = '2*2';
      const value = Parser.evaluate(formula);

      expect(value).to.equal(4);
    });

    it('evaluates /', function () {
      const formula = '4/2';
      const value = Parser.evaluate(formula);

      expect(value).to.equal(2);
    });

    it('evaluates ^', function () {
      const formula = '4^2';
      const value = Parser.evaluate(formula);

      expect(value).to.equal(16);
    });
  });

  describe('binary ops, > two operands', function () {
    it('evaluates +', function () {
      const formula = '1+2+3';
      const value = Parser.evaluate(formula);

      expect(value).to.equal(6);
    });

    it('evaluates mixed', function () {
      const formula = '1+2-3';
      const value = Parser.evaluate(formula);

      expect(value).to.equal(0);
    });
  });

  describe('operation ordering', function () {
    it('applies brackets before operations', function () {
      const f = '(4*2)^2';
      const value = Parser.evaluate(f);
      expect(value).to.equal(64);
    });

    it('applies brackets later in the formula', () => {
      expect(Parser.evaluate("4*(1+2)")).to.equal(12);
    });

    it('applies multple brackets', () => {
      expect(Parser.evaluate("(4 + 1) * (1 + 2)")).to.equal(15);
    });

    it('applies nested brackets', () => {
      expect(Parser.evaluate("((4 + 1) * (1 + 2)) + 1")).to.equal(16);
    });
    it('applies indices before multiplication', function () {
      const f = '4*2^2';
      const value = Parser.evaluate(f);

      expect(value).to.equal(16);
    });

    it('applies division before addition', function () {
      const f = '4/1+1';
      const value = Parser.evaluate(f);

      expect(value).to.equal(5);
    });

    it('applies division before subtraction', function () {
      const f = '4-1/1';
      const value = Parser.evaluate(f);

      expect(value).to.equal(3);
    });

    it('applies multiplication before addition', function () {
      const f = '4*1+1';
      const value = Parser.evaluate(f);

      expect(value).to.equal(5);
    });

    it('applies multiplication before subtraction', function () {
      const f = '4-1*2';
      const value = Parser.evaluate(f);

      expect(value).to.equal(2);
    });
  });

  describe.only('negative numbers, in brackets', () => {
    it('handles negatives as second operands (addition)', () => {
      const f = '4-(-1)';
      const value = Parser.evaluate(f);

      expect(value).to.equal(5);
    });

  });

  describe('edge cases, misc', () => {
    it('handles whitespace between operators', () => {
      expect(Parser.evaluate("4 + 1")).to.equal(5);
      expect(Parser.evaluate("4 * ( 1 + 2 )")).to.equal(12);
    });
  });
});
