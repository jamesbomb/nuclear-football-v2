const { plugins } = require('./webpack.rules');

module.exports = {
  entry: './src/main.js',
  module: {
    rules: require('./webpack.rules'),
  },
  plugins: plugins, // Ensure plugins from webpack.rules.js are included here
};



// module.exports = {
//   /**
//    * This is the main entry point for your application, it's the first file
//    * that runs in the main process.
//    */
//   entry: './src/main.js',
//   // Put your normal webpack config below here
//   module: {
//     rules: require('./webpack.rules'),
//   },
// };
