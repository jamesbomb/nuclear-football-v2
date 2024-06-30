const { rules, plugins } = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins, // Ensure plugins from webpack.rules.js are included here
};



// const rules = require('./webpack.rules');

// rules.push({
//   test: /\.css$/,
//   use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
// });

// module.exports = {
//   // Put your normal webpack config below here
//   module: {
//     rules,
//   },
// };
