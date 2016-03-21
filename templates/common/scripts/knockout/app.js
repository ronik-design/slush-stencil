import ko from "knockout";
import * as pages from "./pages";
import * as bindings from "./bindings";
import * as components from "./components";

class App {

  constructor() {

    this.rootEl = null;
    this.config = {};
    this.pages = {};
    this.components = {};
  }

  setConfig() {

    if (arguments.length === 2) {
      this.config[arguments[0]] = arguments[1];
    }

    if (arguments.length === 1) {
      this.config = Object.assign(this.config, arguments[0]);
    }
  }

  clearConfig() {

    this.config = {};
  }

  addBindings() {

    for (const name in bindings) {
      ko.bindingHandlers[name] = bindings[name];
      if (bindings[name].allowVirtual) {
        ko.virtualElements.allowedBindings[name] = true;
      }
    }
  }

  addComponents() {

    for (const name in components) {
      const Component = components[name];
      this.components[name] = ko.observable(new Component({ config: this.config }));
    }
  }

  addPages() {

    for (const name in pages) {
      const Page = pages[name];
      this.pages[name] = ko.observable(new Page({ config: this.config }));
    }
  }

  start(rootEl = document.body) {

    this.rootEl = rootEl;

    this.addBindings();
    this.addComponents();
    this.addPages();

    ko.applyBindings(this, this.rootEl);
  }

  stop() {

    ko.cleanNode(this.rootEl);
  }
}

export default App;
