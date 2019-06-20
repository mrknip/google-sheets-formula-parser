module.exports = {
    "env": {
      "browser": true,
      "commonjs": true,
      "mocha": true,
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
      "ecmaVersion": 2018
    },
    "rules": {
      "semi": ["error", "always"],
      "space-infix-ops": ["error", {"int32Hint": false}],
      "comma-spacing": ["error", { "before": false, "after": true }],
      "object-curly-spacing": ["error", "always"],
      "no-trailing-spaces": ["error"],
      "space-before-blocks": ["error", "always"]
    }
};
