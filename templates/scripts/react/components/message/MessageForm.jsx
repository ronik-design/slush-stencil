import React from 'tuxx/React';

var MessageForm = React.createOwneeClass({
  anyPropTypes: {
    updateMessage: React.PropTypes.func.isRequired,
    createMessage: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      username: 'Anonymous',
      editing: false,
      addOrEdit: 'Add'
    };
  },

  handleSubmit(e) {
    e.preventDefault();
    var messageNode = this.refs.message.getDOMNode();
    var message = messageNode.value.trim();

    if (this.props.editing) {
      this.nearestOwnerProps.updateMessage(message, this.props.message.id);
    } else {
      this.nearestOwnerProps.createMessage(message, this.props.username);
    }

    messageNode.value = '';
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input placeholder={this.props.addOrEdit + " Message"} defaultValue={this.props.text} ref="message"></input>
        <button type='submit'>{this.props.addOrEdit}</button>
      </form>
    );
  }
});

export default MessageForm;
