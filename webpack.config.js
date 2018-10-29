const path = require('path'),
  webpack = require('webpack'),
  poststylus = require('poststylus'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  dotenv = require('dotenv');

module.exports = () => {
  // call dotenv and it will return an Object with a parsed key
  const env = dotenv.config().parsed;

  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    context: __dirname + "/app",
    entry: [
      'babel-polyfill', './app.jsx'
    ],
    output: {
      path: __dirname,
      filename: "bundle.js"
    },
    resolveLoader: {
      // Tell webpack to look for required files in node
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.json', '.styl']
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    module: {
      // npParse === aframe Bugfix for console warning
      noParse: [
        /node_modules\/aframe\/dist\/aframe-master.js/, // for aframe from NPM
        /node_modules\/cannon\/build\/cannon.js/, // for aframe-extras from NPM
      ],
      loaders: [
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['es2015', 'stage-0', 'react']
          }
        }, {
          test: /\.json$/,
          loader: 'json-loader'
        }, {
          test: /\.styl$/,
          loader: 'style-loader!css-loader!stylus-loader'
        }, {
          test: /\.(png|jpg|woff|woff2|eot|ttf|svg)(\?[a-z0-9=&.]+)?$/,
          loader: 'url-loader?limit=100000'
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new webpack.LoaderOptionsPlugin({
        options: {
          stylus: {
            use: [poststylus(['autoprefixer'])]
          }
        }
      }),
      new HtmlWebpackPlugin({
        title: 'Wikipedia Edits VR Heatmap',
        template: __dirname + '/app/index.html',
        inject: 'body',
        files: {
          'css': [__dirname + '/app/style.styl']
        }
      })
    ]
  };
}
