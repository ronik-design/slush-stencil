import MessageActions from '../actions/MessageActions';
import ActionStores from 'tuxx/Stores/ActionStores';

var MessageStore = ActionStores.createStore({
    _messages: [],

    all() {
        return this._messages;
    },

    onGet(data) {
        this._messages = data;
        this.emitChange();
    },

    onCreate(data) {
        this._messages.push(data);
        this.emitChange();
    },

    onDestroy(data) {
        for (var i = 0; i < this._messages.length; i++) {
            if (this._messages[i].id === data.id) {
                this._messages.splice(i, 1);
                break;
            }
        }
        this.emitChange();
    },

    onUpdate(data) {
        for (var i = 0; i < this._messages.length; i++) {
            if (this._messages[i].id === data.id) {
                this._messages[i] = data;
                break;
            }
        }
        this.emitChange();
    },

    register() {
        return {
            message: {
                get: this.onGet,
                create: this.onCreate,
                destroy: this.onDestroy,
                update: this.onUpdate
            }
        };
    }
});

export default MessageStore;
