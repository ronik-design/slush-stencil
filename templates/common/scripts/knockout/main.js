import "babel-polyfill";
import objectFitImages from "object-fit-images";
import svg4everybody from "svg4everybody";

import { ready } from "vanillajs-dom";
import App from "./app";

window.app = new App();

ready(() => {
  svg4everybody();
  objectFitImages();
  window.app.start();
});
