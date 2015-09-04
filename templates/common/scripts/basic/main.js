/**
  If using SVG Sprite Stacks this polyfill will allow <use> in IE.
  Also include `svg4everybody()` in your main function below.

  import svg4everybody from "svg4everybody";
**/
import "./core/log";
import App from "./app";


window.App = new App();

$(function main() {
  $(() => window.App.start());
});
