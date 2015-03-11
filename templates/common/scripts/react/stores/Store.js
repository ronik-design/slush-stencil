import alt from '../core/alt';
import Data from '../services/Data';
import RouteActions from '../actions/RouteActions';
import ClientActions from '../actions/ClientActions';
import ServerActions from '../actions/ServerActions';

class Store {
    constructor() {
        this.bindActions(RouteActions);
        this.bindActions(ClientActions);
        this.bindActions(ServerActions);

        this.pages = {};
    }

    onToPage(payload) {
        // Do something when transitioning to a page
    }

    onFromPage(payload) {
        // Do something when transitioning from a page
    }

    onCreatePage(page) {
        this.pages[page.path] = page;
        Data.createPage(page);
    }

    onReceiveAll(rawPages) {
        this._addPages(rawPages);
        // need a waitFor example
        // this.waitFor([ThreadStore.dispatchToken]);
    }

    _addPages(rawPages) {
        rawPages.forEach((page) => {
            if (!this.pages[page.path]) {
                this.pages[page.path] = page;
            }
        });
    }

    static getPage(path) {
        var { pages } = this.getState();
        return pages[path];
    }

    static getPages() {
        var { pages } = this.getState();

        var array = [];

        for (var path in pages) {
            array.push(pages[path]);
        }

        return array;
    }
}

export default alt.createStore(Store);
