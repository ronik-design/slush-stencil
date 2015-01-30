import TuxActions from 'tuxx/Actions';
import ajax from '../helpers/AjaxHelper';

var RoomActions = TuxActions.createActionCategory({
    category: 'rooms',
    source: 'view_component',
    actions: ['create', 'get', 'update', 'destroy']
});

RoomActions.before('get', function(dispatch) {
    ajax({
            type: 'GET',
            location: 'rooms',
            data: {}
        })
        .then((data) => dispatch(data));
});

RoomActions.before('create', function(dispatch, actionBody) {
    ajax({
            type: 'POST',
            location: 'rooms',
            data: {
                roomname: actionBody.name
            }
        })
        .then((data) => dispatch(data));
});

RoomActions.before('update', function(dispatch, actionBody) {
    ajax({
            type: 'PUT',
            location: 'rooms',
            data: {
                roomname: actionBody.name,
                roomId: actionBody.id
            }
        })
        .then((data) => dispatch(data));
});

RoomActions.before('destroy', function(dispatch, actionBody) {
    ajax({
            type: 'DELETE',
            location: 'rooms',
            data: {
                roomId: actionBody.id
            }
        })
        .then((data) => dispatch({ id: actionBody.id }));
});

export default RoomActions;
