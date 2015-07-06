var webpack = require('webpack');
var config = require('./webpack.config.js');


var PLUGINS = [
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
            'dead_code': false,
            'unused': false,
            'drop_debugger': true,
            'warnings': true,
            'keep_fargs': true
        }
    }),
    new webpack.optimize.AggressiveMergingPlugin()
];

config.output.filename = 'main.js';
config.cache = false;
config.debug = false;
config.devtool = false;
config.plugins = config.plugins.concat(PLUGINS);

module.exports = config;
