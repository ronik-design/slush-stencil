import React from 'tuxx/React';
import MessageStore from '../../stores/MessageStore';
import MessageActions from '../../actions/MessageActions';
import Messages from './Messages.jsx';
import MessageForm from './MessageForm.jsx';
import RouterState from 'tuxx/Router/State';

var MessageView = React.createOwnerClass({
  mixins: [
    RouterState
  ],

  getMessagesForRoom() {
    MessageActions.get({ roomId: this.roomId() });
  },

  getInitialState() {
    return {
      messages: MessageStore.all()
    };
  },

  listenerCallback() {
    this.setState({
      messages: MessageStore.all()
    });
  },

    connectOwnerToStore() {
        return {
            store: MessageStore,
            listener: () => {
                this.listenerCallback();
            }
        };
    },

  componentWillMount() {
    this.getMessagesForRoom();
  },

  componentWillReceiveProps() {
    this.getMessagesForRoom();
  },

  roomId() {
    return parseInt(this.getParams().roomId, 10);
  },

  registerOwnerProps() {
    return {
      createMessage: (text, username) => {
        MessageActions.create({ text: text, roomId: this.roomId(), username: username });
      },

      deleteMessage: (id) => {
        MessageActions.destroy({ id: id, roomId: this.roomId() });
      },

      updateMessage: (text, id) => {
        MessageActions.update({ id: id, text: text, roomId: this.roomId() });
      }
    };
  },

  render() {
    return (
      <div>
        <MessageForm />
        <Messages messages={this.state.messages} />
      </div>
    );
  }
});

export default MessageView;
