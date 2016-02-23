import { ready } from "vanillajs-dom";
import svg4everybody from "svg4everybody";
import App from "./app";

window.app = new App();
svg4everybody();

ready(() => window.app.start());
