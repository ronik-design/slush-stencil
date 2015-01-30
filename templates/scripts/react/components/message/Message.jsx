import React from 'tuxx/React';
import MessageForm from './MessageForm.jsx';

var Message = React.createMutableClass({
    anyPropTypes: {
        message: React.PropTypes.object.isRequired,
        deleteMessage: React.PropTypes.func.isRequired
    },

    mutableTraits: {
        props: 'text',
        state: 'editing'
    },

    getInitialState() {
        return {
            editing: false
        };
    },

    componentWillReceiveProps() {
        this.closeEditForm();
    },

    closeEditForm() {
        this.setState({ editing: false });
    },

    edit(e) {
        e.preventDefault();
        if (this.isMounted()) {
            this.setState({ editing: !this.state.editing });
        }
    },

    deleteMessage(e) {
        e.preventDefault();
        this.nearestOwnerProps.deleteMessage(this.props.message.id);
    },

    render() {
        var editForm;
        var message = this.props.message;
        if (this.state.editing) {
          editForm = <MessageForm message={message} editing={this.state.editing} roomId={this.props.roomId} addOrEdit='Edit' />;
        }

        return (
          <li key={message.id}>
            {message.username} - {message.text} <br />
            {editForm}
            <button onClick={this.deleteMessage}>Delete</button><button onClick={this.edit}>{this.state.editing ? 'Cancel' : 'Edit'}</button>
          </li>
        );
    }
});

export default Message;
