"use strict";

var webpack = require("webpack");
var config = require("./webpack.config.js");

var PLUGINS = [
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    "__DEV__": true
  })
];

config.cache = true;
config.debug = true;
config.devtool = "inline-source-map";
config.plugins = config.plugins.concat(PLUGINS);

module.exports = config;
