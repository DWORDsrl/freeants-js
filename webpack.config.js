var webpack = require('webpack');
var path = require('path');
var yargs = require('yargs');

var libraryName = 'FreeAnts';

var plugins = [ new webpack.LoaderOptionsPlugin(
      {
        options: {
          tslint: {
            emitErrors: true,
            failOnHint: true
          }
        }
      })
    ];

var outputFile = '';
if (yargs.argv.p) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true, sourceMap: true }));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

var config = {
  entry: [
    __dirname + '/src/index.ts'
  ],
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      { 
        test: /\.ts?$/, 
        enforce: 'pre', 
        loader: 'tslint-loader', 
        exclude: /node_modules/
      },
      { 
        test: /\.ts?$/, 
        loader: 'ts-loader', 
        exclude: /node_modules/ 
      }
    ],    
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      "node_modules"
    ],
    extensions: ['.js', '.ts', '.jsx', '.tsx']
  },
  plugins: plugins,
};

module.exports = config;
