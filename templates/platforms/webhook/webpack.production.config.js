var webpack = require('webpack');
var assign = require('101/assign');
var commonConfig = require('./webpack.config.js');

var PLUGINS = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
        '__DEV__': false
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
];

var productionConfig = {
    cache: false,
    debug: false,
    devtool: false,
    plugins: PLUGINS
};

var config = assign(commonConfig, productionConfig);

config.plugins = config.plugins.concat(PLUGINS);

module.exports = config;
