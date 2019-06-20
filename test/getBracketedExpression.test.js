const expect = require('chai').expect;
const getBracketedExpression = require('../').getBracketedExpression;

describe('Parser#getBracketedExpression', function () {
  it('gets a simple expression', () => {
    const formula = '(1 + 2)';
    expect(getBracketedExpression(formula)).to.equal('(1 + 2)');
  });

  it('stops at the closing bracket', () => {
    expect(getBracketedExpression("(1 + 2) + 1")).to.equal('(1 + 2)');
  });

  it('gets the expression enclosed by the outermost brackets', () => {
    expect(getBracketedExpression("((1 + 2) + 1)")).to.equal('((1 + 2) + 1)');
    expect(getBracketedExpression("((1 + 2) + 1) + 1")).to.equal('((1 + 2) + 1)');
  });
});
