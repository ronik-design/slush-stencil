"use strict";

var path = require("path");
var webpack = require("webpack");
var STENCIL = require("./stencil/params");

var DEST = STENCIL.buildDir;

var ENTRY = {
  "main.js": ["babel-core/polyfill", "./scripts/main.js"]
};


var providePlugins = {};

if (STENCIL.jsFramework === "basic") {
  providePlugins.ko = "knockout";
  providePlugins.postal = "postal";
}

if (STENCIL.jsFramework === "backbone") {
  providePlugins.Backbone = "backbone";
  providePlugins._ = "lodash";
}

var aliases = {};

if (STENCIL.cssFramework === "bootstrap") {
  aliases.bootstrap = path.resolve(__dirname, "node_modules/bootstrap-styl/js");
}

var externals = {};

if (STENCIL.jsFramework === "basic" || STENCIL.jsFramework === "backbone") {
  externals.$ = "jquery";
  externals.jQuery = "jquery";
}

var LOADERS = [{
  test: /scripts\/vendor\/.+\.js$/,
  loaders: ["imports?this=>window"]
}, {
  test: /\.jsx?$/,
  exclude: /node_modules|scripts\/vendor/,
  loaders: [
    "babel?stage=0",
    "eslint"
  ]
}];

module.exports = {
  entry: ENTRY,

  output: {
    filename: "main.js",
    path: DEST + "/javascript/",
    publicPath: "/javascript/"
  },

  stats: {
    colors: true,
    reasons: false
  },

  plugins: [
    new webpack.ProvidePlugin(providePlugins)
  ],

  externals: externals,

  resolve: {
    aliases: aliases,
    modulesDirectories: ["local_modules", "node_modules"],
    extensions: ["", ".js", ".jsx"]
  },

  eslint: {
    configFile: "./scripts/.eslintrc"
  },

  module: {
    loaders: LOADERS
  }
};
