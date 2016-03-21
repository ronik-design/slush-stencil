"use strict";

const path = require("path");
const webpack = require("webpack");
const STENCIL = require("./stencil");

const dest = path.join(STENCIL.buildDir, STENCIL.staticPath);

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

  entry: {
    "main.js": ["babel-polyfill", "./scripts/main.js"]
  },

  output: {
    filename: "main.js",
    path: path.join(__dirname, dest, "javascript")
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
    extensions: ["", ".js"]
  },

  eslint: {
    configFile: path.join(__dirname, "scripts/.eslintrc")
  },

  module: { loaders }
};
