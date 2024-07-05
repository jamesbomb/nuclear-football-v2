const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const ESLintPlugin = require('eslint-webpack-plugin')
const merge = require('./webpack.base.config')
const { absPath } = require('./utils')
const { appName, devSourceMap } = require('./config')

module.exports = merge({
  mode: 'development',
  target: 'electron-renderer',
  devtool: devSourceMap,
  entry: './src/renderer/main.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: 'defaults'
                }
              ]
            ]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]',
            esModule: false
          }
        }
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader', // Crea stili all'interno del DOM utilizzando le tag <style>
          'css-loader', // Traduce CSS in CommonJS
          'sass-loader' // Compila Sass in CSS, utilizzando Node Sass per default
        ]
      }
    ]
  },
  output: {
    filename: 'renderer.js',
    path: absPath('dist')
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: absPath('src/index.html'),
      title: appName
    }),
    new ESLintPlugin({ formatter: 'codeframe' })
  ],
  resolve: {
    alias: {
      '@': absPath('src/renderer')
    }
  }
})
