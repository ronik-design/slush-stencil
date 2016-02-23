import ko from "knockout";
import pages from "./pages";
import bindings from "./bindings";

class App {

  constructor() {

    this.root = null;
    this.page = null;
    this.pageName = "DEFAULT";
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

  setPage(pageName) {

    this.pageName = pages[pageName] ? pageName : this.pageName;
  }

  loadPage() {

    const Page = pages[this.pageName];
    this.page = new Page({ vars: this.pageVars, config: this.config });
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

      if (customBindings[name].allowVirtual) {
        ko.virtualElements.allowedBindings[name] = true;
      }
    });
  }

  addAfterPageFn(fn) {

    if (fn instanceof Function) {
      this.afterPage.push(fn);
    }
  }

  start(root = document.body) {

    this.root = root;

    this.addCustomBindings(bindings);

    if (!this.page) {
      this.setPage();
    }

    this.loadPage();

    this.afterPage.forEach((fn) => fn(this.page, this));

    ko.applyBindings(this.page, this.root);
  }

  stop() {

    ko.cleanNode(this.root);
  }
}

export default App;
