module.exports = {
  extends: ['eslint-config-airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'react/react-in-jsx-scope': 0,
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 0
  }
}