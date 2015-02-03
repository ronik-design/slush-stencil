import alt from '../core/alt';

class ServerActions {
    constructor() {
        this.generateActions('receiveCreatedPage', 'receiveAll');
    }
}

export default alt.createActions(ServerActions);
