var webpack = require('webpack');
var config = require('./webpack.config.js');

var PLUGINS = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
        '__DEV__': false
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
];

config.cache = false;
config.debug = false;
config.devtool = false;
config.plugins = config.plugins.concat(PLUGINS);

module.exports = config;
