import Actions from 'tuxx/Actions';
import ajax from '../helpers/Ajax';

var MessageActions = Actions.createActionCategory({
    category: 'message',
    source: 'message_views',
    actions: ['get', 'create', 'destroy', 'update']
});

MessageActions.before('get', function(dispatch, actionBody) {
    ajax({
            type: 'GET',
            location: 'messages',
            data: actionBody
        })
        .then((data) => dispatch(data));
});

MessageActions.before('create', function(dispatch, actionBody) {
    ajax({
            type: 'POST',
            location: 'messages',
            data: actionBody
        })
        .then((data) => dispatch(data));
});

MessageActions.before('destroy', function(dispatch, actionBody) {
    ajax({
            type: 'DELETE',
            location: 'messages',
            data: {
                messageId: actionBody.id,
                roomId: actionBody.roomId
            }
        })
        .then((data) => dispatch({ id: actionBody.id }));
});

MessageActions.before('update', function(dispatch, actionBody) {
    ajax({
            type: 'PUT',
            location: 'messages',
            data: {
                text: actionBody.text,
                roomId: actionBody.roomId,
                messageId: actionBody.id
            }
        })
        .then((data) => dispatch(data));
});

export default MessageActions;
