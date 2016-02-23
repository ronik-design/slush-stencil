"use strict";

const path = require("path");
const webpack = require("webpack");
const STENCIL = require("./stencil");

const dest = path.join(STENCIL.buildDir, STENCIL.staticPath);

const entry = {
  "main.js": ["babel-polyfill", "./scripts/main.js"]
};

const providePlugins = {};

if (STENCIL.js === "knockout") {
  providePlugins.ko = "knockout";
}

const aliases = {};

const externals = {};

if (STENCIL.jsExternals.indexOf("jquery") >= 0) {
  externals.jquery = "jQuery";
}

if (STENCIL.jsExternals.indexOf("modernizr") >= 0) {
  externals.modernizr = "Modernizr";
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
  entry,

  output: {
    filename: "main.js",
    path: path.join(dest, "/javascript/")
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
