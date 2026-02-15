module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Allow console in development (will be removed in production builds)
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // Allow unused vars starting with underscore
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    // Prefer const/let over var
    'no-var': 'error',
    'prefer-const': 'error',

    // Allow function hoisting
    'no-use-before-define': ['error', { functions: false, classes: true }],

    // Relax some strict rules for flexibility
    'consistent-return': 'off',
    'no-underscore-dangle': 'off',
    'func-names': 'off',
    'no-param-reassign': ['error', { props: false }],

    // Require await in async functions
    'require-await': 'error',

    // Prettier integration
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
