/**
  If using SVG Sprite Stacks this polyfill will allow <use> in IE.
  import svg4everybody from "svg4everybody";
**/

import App from "./app";


window.App = new App();

document.addEventListener("DOMContentLoaded", () => {
  // svg4everybody();
  window.App.start();
});
