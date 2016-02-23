"use strict";

const webpack = require("webpack");
const config = require("./webpack.config.js");
const STENCIL = require("./stencil");

const plugins = [
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": "\"production\"",
    "__DEV__": false
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin()
];

if (STENCIL.minifyJs) {

  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      "screw_ie8": true,
      "properties": true,
      "dead_code": false,
      "unused": false,
      "drop_debugger": true,
      "warnings": true,
      "keep_fargs": true
    }
  }));

  plugins.push(new webpack.optimize.AggressiveMergingPlugin());
}

config.output.filename = "main.js";
config.cache = false;
config.debug = false;
config.devtool = false;
config.plugins = config.plugins.concat(plugins);

module.exports = config;
