import RoomActions from '../actions/RoomActions';
import ActionStores from 'tuxx/Stores/ActionStores';

var RoomStore = ActionStores.createStore({
    _rooms: [],

    getAll() {
        return this._rooms;
    },

    onGet(data) {
        this._rooms = data;
        this.emitChange();
    },

    onCreate(data) {
        this._rooms.push(data);
        this.emitChange();
    },

    onUpdate(data) {
        var rooms = this._rooms;
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i].id === data.id) {
                rooms[i] = data;
                break;
            }
        }
        this.emitChange();
    },

    onDestroy(data) {
        var rooms = this._rooms;
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i].id === data.id) {
                rooms.splice(i, 1);
                break;
            }
        }
        this.emitChange();
    },

    register() {
        return {
            rooms: {
                get: this.onGet,
                create: this.onCreate,
                update: this.onUpdate,
                destroy: this.onDestroy
            }
        };
    }
});

export default RoomStore;
