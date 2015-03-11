import alt from '../core/alt';
import DataUtils from '../utils/DataUtils';

class Actions {
    createPage(data) {
        var page = DataUtils.formatPage(data);
        this.dispatch(page);
    }
}

export default alt.createActions(Actions);
