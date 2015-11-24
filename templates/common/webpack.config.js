"use strict";

const path = require("path");
const webpack = require("webpack");
const STENCIL = require("./stencil/params");

const DEST = path.join(STENCIL.buildDir, STENCIL.staticPath);

const ENTRY = {
  "main.js": ["babel-polyfill", "./scripts/main.js"]
};

const providePlugins = {};

if (STENCIL.jsFramework === "knockout") {
  providePlugins.ko = "knockout";
}

if (STENCIL.jsFramework === "backbone") {
  providePlugins.Backbone = "backbone";
  providePlugins._ = "lodash";
}

const aliases = {};

if (STENCIL.cssFramework === "bootstrap") {
  aliases.bootstrap = path.resolve(__dirname, "node_modules/bootstrap-styl/js");
}

const externals = {};

if (STENCIL.jsFramework === "knockout" || STENCIL.jsFramework === "backbone") {
  externals.jquery = "jQuery";
}

const loaders = [{
  test: /scripts\/vendor\/.+\.js$/,
  loaders: ["imports?this=>window"]
}, {
  test: /\.jsx?$/,
  exclude: /node_modules|scripts\/vendor/,
  loader: "babel",
  query: {
    cacheDirectory: true,
    presets: ["es2015"]
  }
}, {
  test: /\.jsx?$/,
  exclude: /node_modules|scripts\/vendor/,
  loader: "eslint"
}];

module.exports = {
  entry: ENTRY,

  output: {
    filename: "main.js",
    path: path.join(DEST, "/javascript/")
  },

  stats: {
    colors: true,
    reasons: false
  },

  plugins: [
    new webpack.ProvidePlugin(providePlugins)
  ],

  externals,

  resolve: {
    aliases,
    modulesDirectories: ["local_modules", "node_modules"],
    extensions: ["", ".js", ".jsx"]
  },

  eslint: {
    configFile: "./scripts/.eslintrc"
  },

  module: { loaders }
};
