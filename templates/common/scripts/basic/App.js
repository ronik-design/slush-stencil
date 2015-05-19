import pages from './pages';

export default class App {

    constructor() {
        this.page = null;
    }

    setPage(page) {
        let Page = pages[page] || pages.default;
        this.page = new Page();
    }

    start() {
        ko.applyBindings(this.page);
    }
}
