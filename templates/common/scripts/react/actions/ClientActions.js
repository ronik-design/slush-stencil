import alt from '../core/alt';
import Data from '../services/Data';
import DataUtils from '../utils/DataUtils';

class Actions {
    createPage(data) {
        var page = DataUtils.formatPage(data);

        this.dispatch(page);
        Data.createPage(page);
    }
}

export default alt.createActions(Actions);
