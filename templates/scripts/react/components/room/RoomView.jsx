import React from 'tuxx/React';
import RoomStore from '../../stores/RoomStore.js';
import RoomActions from '../../actions/RoomActions.js';
import Rooms from './Rooms.jsx';
import RoomCreateForm from './RoomCreateForm.jsx';
import RouterState from 'tuxx/Router/State';
import RouteHandler from 'tuxx/Router/RouteHandler';

var RoomView = React.createOwnerClass({
    mixins: [
        RouterState
    ],

    getInitialState() {
        return {
            rooms: RoomStore.getAll()
        };
    },

    listenerCallback() {
        this.setState({
            rooms: RoomStore.getAll()
        });
    },

    connectOwnerToStore() {
        return {
            store: RoomStore,
            listener: () => {
                this.listenerCallback();
            }
        };
    },

    componentWillMount() {
        RoomActions.get();
    },

    registerOwnerProps() {
        return {
            createRoom(name) {
                RoomActions.create({name: name});
            },

            deleteRoom(id) {
                RoomActions.destroy({id: id});
            },

            updateRoom(name, id) {
                RoomActions.update({name:name, id:id});
            }
        };
    },

    render() {
        let rooms = this.state.rooms;
        let roomId = this.getParams().roomId;
        let roomName;

        if (roomId !== undefined) {
            for (var i = 0; i < rooms.length; i++) {
                if (String(rooms[i].id) === roomId) {
                    roomName = rooms[i].name;
                }
            }
        }

        return (
          <div>
            <RoomCreateForm />
            <Rooms rooms={this.state.rooms} />
                <br />
                <br />
                <h1>{roomName ? 'You are in room: ' + roomName : 'Click a room name to continue'}</h1>
                <br />
            <RouteHandler />
          </div>
        );
    }
});

export default RoomView;
