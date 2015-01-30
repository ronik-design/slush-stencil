import React from 'tuxx/React';
import Link from 'tuxx/Router/Link';

var Room = React.createMutableClass({
    anyPropTypes: {
        room: React.PropTypes.object.isRequired,
        deleteRoom: React.PropTypes.func.isRequired,
        updateRoom: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            editing: false,
            message: ''
        };
    },

    deleteRoom(e) {
        e.preventDefault();
        this.nearestOwnerProps.deleteRoom(this.props.room.id);
    },

    updateRoom(e) {
        e.preventDefault();
        this.nearestOwnerProps.updateRoom(this.state.message, this.props.room.id);
    },

    componentWillReceiveProps() {
        this.setState({editing : false});
    },

    edit(e) {
        e.preventDefault();
        this.setState({
            editing: !this.state.editing,
            message: this.props.room.name
        });
    },

    handleChange(event) {
        this.setState({message: event.target.value});
    },

    render() {
        let roomContent;

        if (this.state.editing) {
          roomContent = (
            <form onSubmit={this.updateRoom}>
              <input ref="roomName" type="text" value={this.state.message} onChange={this.handleChange} />
              <button type="button" onClick={this.edit}>Cancel</button>
              <button type="submit">Edit</button>
            </form>
          );
        }
        else {
          roomContent = (
            <div>
              <Link to="rooms.room" params={{roomId: this.props.room.id}}>{this.props.room.name}</Link>
              <button onClick={this.edit}>Edit</button>
              <button onClick={this.deleteRoom}>Delete</button>
            </div>
          );
        }

        return roomContent;
    }
});

export default Room;
