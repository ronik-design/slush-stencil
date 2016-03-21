"use strict";

const webpack = require("webpack");
const config = require("./webpack.config.js");

const plugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    "__DEV__": true
  })
];

config.cache = true;
config.debug = true;
config.devtool = "source-map";
config.plugins = config.plugins.concat(plugins);

module.exports = config;
