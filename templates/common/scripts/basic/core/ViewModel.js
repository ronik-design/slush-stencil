export default class ViewModel {

    constructor() {
        this._channel = postal.channel();
        this._subscriptions = [];
    }

    observe(prop, val) {
        let observe = (p, v) => {
            if (Array.isArray(v)) {
                this[p] = ko.observableArray(v);
            } else {
                this[p] = ko.observable(v);
            }
        };

        if (prop instanceof Object) {
            Object.keys(prop).forEach(p => observe(p, prop[p]));
        } else {
            observe(prop, val);
        }
    }

    with(obs) {
        return ko.pureComputed(() => obs());
    }

    knockout() {
        // Class `get` and `set` properties get upgraded
        let proto = Object.getPrototypeOf(this);
        Object.getOwnPropertyNames(proto)
            .map(name => ({
                name,
                desc: Object.getOwnPropertyDescriptor(proto, name)
            }))
            .filter(o => o.desc.configurable)
            .filter(o => 'get' in o.desc)
            .forEach(o => {
                let comp = ko.pureComputed({
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
        let sub = this._channel.subscribe(topic, callback);
        this._subscriptions.push(sub);
    }

    publish(topic, data) {
        this._channel.publish(topic, data);
    }

    destroy() {
        // Remove subscriptions
        this._subscriptions.forEach(sub => sub.unscubscribe());
    }
}
