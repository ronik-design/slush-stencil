import React from 'tuxx/React';

var RoomCreateForm = React.createOwneeClass({
    handleSubmit(e) {
        e.preventDefault();
        this.nearestOwnerProps.createRoom(this.state.message);
        this.setState({message: ''});
    },

    getInitialState() {
        return {message: ''};
    },

    handleChange(event) {
        this.setState({message: event.target.value});
    },

    render() {
        let message = this.state.message;
        return (
          <form onSubmit={this.handleSubmit}>
            <input ref="roomName" type="text" value={this.state.message} placeholder="Create Room" onChange={this.handleChange} />
            <button type="submit">Create Room</button>
          </form>
        );
    }
});

export default RoomCreateForm;
