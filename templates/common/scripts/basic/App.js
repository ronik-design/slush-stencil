import pages from "./pages";
import bindings from "./bindings";


export default class App {

  constructor() {
    this.page = null;
    this.pageVars = {};
    this.config = {};
    this.afterPage = [];
  }

  setConfig(options = {}) {
    this.config = Object.assign(options, this.config);
    if (this.page) {
      this.page.config = this.config;
    }
  }

  setPage(page) {
    const Page = pages[page] || pages.default;
    this.page = new Page({
      vars: this.pageVars,
      config: this.config
    });
  }

  setPageVar(key, value) {
    this.pageVars[key] = value;

    if (this.page) {
      this.page[key] = value;
    }
  }

  addCustomBindings(customBindings) {
    Object.keys(customBindings).forEach((name) => {
      ko.bindingHandlers[name] = customBindings[name];
    });
  }

  addAfterPageFn(fn) {
    if (fn instanceof Function) {
      this.afterPage.push(fn);
    }
  }

  start() {
    this.addCustomBindings(bindings);
    if (!this.page) {
      this.setPage();
    }

    this.afterPage.forEach((fn) => fn(this.page, this));
    ko.applyBindings(this.page);
  }

  stop() {
    window.removeEventListener("resize", this.onResize);
  }
}
