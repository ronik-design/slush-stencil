const isUninitialized = function (val) {
  return val === null || val === undefined || Array.isArray(val) && val.length === 0;
};

export default class ViewModel {

  constructor(options = {}) {
    Object.getOwnPropertyNames(options)
      .filter((name) => name.charAt(0) === "$")
      .forEach((name) => this[name] = options[name]);

    this._channel = postal.channel();
    this._subscriptions = [];
  }

  observe(prop, val) {
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

  with(obs) {
    return ko.pureComputed(() => obs());
  }

  knockout() {
    // Class `get` and `set` properties get upgraded
    const proto = Object.getPrototypeOf(this);
    Object.getOwnPropertyNames(proto)
      .map((name) => ({
        name,
        desc: Object.getOwnPropertyDescriptor(proto, name)
      }))
      .filter((o) => o.desc.configurable)
      .filter((o) => "get" in o.desc)
      .forEach((o) => {
        const comp = ko.pureComputed({
          read: o.desc.get.bind(this),
          write: o.desc.set ? o.desc.set.bind(this) : null
        });
        Object.defineProperty(this, o.name, {
          enumerable: true,
          configurable: true,
          get: comp,
          set: o.desc.set ? comp : undefined
        });
      });
  }

  subscribe(topic, callback) {
    const sub = this._channel.subscribe(topic, callback);
    this._subscriptions.push(sub);
  }

  publish(topic, data) {
    this._channel.publish(topic, data);
  }

  log(message) {
    this.publish("log", { message });
  }

  destroy() {
    // Remove subscriptions
    this._subscriptions.forEach((sub) => sub.unscubscribe());
  }
}
