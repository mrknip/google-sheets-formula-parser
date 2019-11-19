var FUNCTIONS = {
  SUM: function (args) {
    return args
      .map(coerceFloat)
      .reduce(function(total, a) { return total + a; }, 0);
  },

  AVERAGE: function (args) {
    const total = args
      .map(coerceFloat)
      .reduce(function(total, a) { return total + a; }, 0);

    return total / args.length;
  },

  '+': function (args) {
    return args
      .map(coerceFloat)
      .reduce(function(total, a) { return total + a; }, 0);
  },

  '-': function (args) {
    return args
      .map(coerceFloat)
      .slice(1)
      .reduce(function(total, a) { return total - a; }, args[0]);
  },

  '/': function (args) {
    return args
      .map(coerceFloat)
      .slice(1)
      .reduce(function(total, a) { return total / a; }, args[0]);
  },

  '*': function (args) {
    return args
      .map(coerceFloat)
      .slice(1)
      .map(v => v * 1000)
      .reduce(function(total, a) { return total * a; }, args[0]) / 1000;
  },

  '^': function (args) {
    return args
      .map(coerceFloat)
      .slice(1)
      .reduce(function(total, a) { return total ** a; }, args[0]);
  }
};

const OPERATORS = ['+', '-', '/', '*', '^'];

function coerceFloat(value) { return parseFloat(value, 10); }

function evaluate(formula) {
  try {
    const parsedFormula = parse(formula);

    const value = getValue(parsedFormula);

    if (Number.isNaN(value)) {
      return {
        error: true,
        message: 'Invalid formula'
      };
    }

    return value;
  } catch(e) {
    return {
      error: true,
      message: e,
    };
  }
}

/**
 * Turns the formula into a tree.  Nodes are of shape { op, args }
 */
function parse(formula) {
  const parsedFormula = parsePrefixOperator(formula);

  if (parsedFormula) { // It's a prefix op, return that
    return parsedFormula;
  }

  // It's a value or a binary op
  return parseValueOrBinaryOperation(formula);
}

function parsePrefixOperator(rawFormula) {
  const formula = rawFormula.replace(/^\s*/, '');
  const operatorMatch = formula.match(/^([A-Z_]+)\(/);

  if (!operatorMatch) return;

  const operator = operatorMatch[1];
  const rest = formula.slice(operator.length).replace(/[()]/g, '');

  return {
    op: operator,
    args: rest
      .split(',')
      .map(function (value) {
        return parseValueOrBinaryOperation(value);
      }),
  };
}

function parseValueOrBinaryOperation(rawFormula, value = { operations: [], args: [] }, { isNewArgRequired = false } = {}) {
  // Remove any leading whitespace
  const formula = rawFormula.replace(/^\s*/, '');
  if (!formula || formula.length === 0) {
    // We're finished extracting ops and numbers
    return constructBinaryOperationTree({
      operations: value.operations,
      args: value.args,
    });
  }

  if (formula[0] === '(') {
    const innerFormulaMatch = getBracketedExpression(formula);
    const innerFormula = innerFormulaMatch.slice(1, innerFormulaMatch.length - 1);

    return parseValueOrBinaryOperation(formula.slice(innerFormulaMatch.length), {
      operations: value.operations,
      args: value.args.concat(parseValueOrBinaryOperation(innerFormula)),
    });
  }

  // If first char is an operator, add it
  if (OPERATORS.indexOf(formula[0]) > -1) {
    return parseValueOrBinaryOperation(
      formula.slice(1),
      {
        operations: value.operations.concat(formula[0]),
        args: value.args,
      },
      {
        isNewArgRequired: true,
      }
    );
  }

  const newArgs = value.args.slice();

  // HACK: this flag is to make sure the builder starts a new argument after we've added an operation
  if (isNewArgRequired) { newArgs.push(''); }

  if (value.args.length) {
    let currentValue = newArgs[newArgs.length - 1];
    newArgs[newArgs.length - 1] = currentValue += formula[0];
  } else {
    newArgs.push(formula[0]);
  }

  return parseValueOrBinaryOperation(formula.slice(1), {
    operations: value.operations,
    args: newArgs,
  });
}

// TODO import these helpers
function getBracketedExpression(formula) {
  let count = null;
  let out  = '';
  formula.split('').forEach((char) => {
    if (count === 0) return;
    if (count === null) count = 0;
    if (char === '(') count += 1;
    if (char === ')') count -= 1;

    out += char;
  });

  return out;
}

// This removes the first instance of an operation (left to right) and its neighbouring argms, and puts it in the tree
function extractOp(op, elements) {
  const index = elements.operations.indexOf(op);
  const newTree = {
    operations: elements.operations.slice(0),
    args: elements.args.slice(0),
  };

  newTree.args.splice(index, 2, {
    op: op,
    args: elements.args.slice(index, index + 2),
  });
  newTree.operations.splice(index, 1);
  return newTree;
}

// This constructs a tree from two flat lists of operations and arguments in order to get the order of operations correct
function constructBinaryOperationTree(elements) {
  const operations = elements.operations;

  const args =  elements.args;

  if (args.length === 1) return args[0];

  if (args.length <= 2) {
    return {
      op: operations[0],
      args: args,
    };
  }

  let newTree;

  if (operations.includes('^')) {
    newTree = extractOp('^', elements);

  } else if (operations.includes('/')) {
    newTree = extractOp('/', elements);

  } else if (operations.includes('*')) {
    newTree = extractOp('*', elements);

  } else if (operations.includes('+')) {
    newTree = extractOp('+', elements);

  } else if (operations.includes('-')) {
    newTree = extractOp('-', elements);
  }

  return constructBinaryOperationTree(newTree);
}


function getValue(parsedFormula) {
  const copyFormula = JSON.parse(JSON.stringify(parsedFormula));
  copyFormula.args = parsedFormula.args.map(function (argument) {
    if (argument.op) {
      return getValue(argument);
    }

    return argument;
  });

  return FUNCTIONS[copyFormula.op](copyFormula.args);
}

module.exports = {
  evaluate: evaluate,
  getBracketedExpression: getBracketedExpression,
};
