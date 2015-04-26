var webpack = require('webpack');
var config = require('./webpack.config.js');
var SaveHashes = require('assets-webpack-plugin');

var PLUGINS = [
    new SaveHashes({ path: config.output.path, filename: 'rev-manifest.json' }),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
        '__DEV__': false
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            'screw_ie8': true,
            'properties': true,
            'dead_code': true,
            'drop_debugger': true,
            'warnings': true,
            'keep_fargs': true
        }
    }),
    new webpack.optimize.AggressiveMergingPlugin()
];

config.output.filename = 'main-[hash].js';
config.cache = false;
config.debug = false;
config.devtool = false;
config.plugins = config.plugins.concat(PLUGINS);

module.exports = config;
