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

    this.pageInstances = {};
    this.componentInstances = {};
  }

  setConfig() {

    if (arguments.length === 2) {
      this.config[arguments[0]] = arguments[1];
    }

    if (arguments.length === 1) {
      this.config = Object.assign(this.config, arguments[0]);
    }
  }

  getPage(name) {

    const Ctor = pages[name];

    return () => {

      let instance = this.pageInstances[name];

      if (!instance) {
        instance = new Ctor({ config: this.config, app: this });
      }

      return instance;
    };
  }

  getComponent(name) {

    const Ctor = components[name];

    return () => {

      let instance = this.componentInstances[name];

      if (!instance) {
        instance = new Ctor({ config: this.config, app: this });
      }

      return instance;
    };
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
      Object.defineProperty(this.components, name, {
        get: this.getComponent(name)
      });
    }
  }

  addPages() {
    for (const name in pages) {
      Object.defineProperty(this.pages, name, {
        get: this.getPage(name)
      });
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
