/* eslint no-console:0 */

const isUninitialized = function (val) {
  return val === null || val === undefined || Array.isArray(val) && val.length === 0;
};

export default class ViewModel {

  constructor(options = {}) {
    Object.getOwnPropertyNames(options)
      .filter((name) => name.charAt(0) === "$")
      .forEach((name) => this[name] = options[name]);
  }

  observable(prop, val) {

    const observe = (p, v) => {
      if (Array.isArray(v)) {
        this[p] = ko.observableArray(v);
      } else {
        this[p] = ko.observable(v);
      }

      this[p]._firstValue = v;

      this[p]._dirty = ko.observable(false);

      this[p].isDirty = ko.computed(() => {
        return this[p]._dirty();
      });

      this[p].subscribe((vi) => {

        if (isUninitialized(this[p]._firstValue)) {
          if (Array.isArray(vi)) {
            // clone array for initial value
            this[p]._firstValue = [].concat(vi);
          } else {
            this[p]._firstValue = vi;
          }
        }

        this[p]._dirty(!(this[p]._firstValue === vi));
      });

      this[p].reset = () => {
        return this[p](this[p]._firstValue);
      };

      return this[p];
    };

    if (prop instanceof Object) {
      const observables = {};
      Object.keys(prop).forEach((p) => observables[p] = observe(p, prop[p]));
      return observables;
    } else {
      return observe(prop, val);
    }
  }

  computed(prop, get, set) {

    const compute = (p, g, s) => {

      this[p] = ko.pureComputed({
        read: g.bind(this),
        write: s ? s.bind(this) : null
      });

      return this[p];
    };

    if (prop instanceof Object) {
      const computeds = {};
      Object.keys(prop).forEach((p) => {
        const pGet = prop[p].get ? prop[p].get : prop[p];
        const pSet = prop[p].set ? prop[p].set : null;
        computeds[p] = compute(p, pGet, pSet);
      });
      return computeds;
    } else {
      return compute(prop, get, set);
    }
  }

  with(obs) {
    return ko.pureComputed(() => obs());
  }

  log(message) {

    if (message instanceof Error) {
      return console.error(message);
    }

    if (message) {
      console.log(message);
    }
  }

  destroy() {

    // Placeholder
  }
}
