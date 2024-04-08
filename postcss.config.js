const tailwindcss = require('tailwindcss');
// eslint-disable-next-line import/no-extraneous-dependencies
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: ['postcss-preset-env', tailwindcss, autoprefixer],
};
