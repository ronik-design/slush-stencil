"use strict";

const webpack = require("webpack");
const STENCIL = require("./stencil");

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

const loaders = [
  {
    test: /scripts\/vendor\/.+\.js$/,
    loader: "imports?this=>window"
  }, {
    test: /\.js$/,
    exclude: /node_modules|scripts\/vendor/,
    loader: "babel",
    query: {
      cacheDirectory: true,
      presets: ["es2015-native-modules"]
    }
  }, {
    test: /\.js$/,
    exclude: /node_modules|scripts\/vendor/,
    loader: "eslint"
  }
];

module.exports = {

  output: {
    filename: "main.js"
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
    modules: ["local_modules", "node_modules"],
    extensions: ["", ".js", ".jsx"]
  },

  module: { loaders }
};
