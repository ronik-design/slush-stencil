import ServerActions from '../actions/ServerActions';

export default {
    getAllPages: function() {
        // simulate retrieving data from a database
        var rawPages = JSON.parse(localStorage.getItem('pages'));

        // simulate success callback
        ServerActions.receiveAll(rawPages || []);
    },

    createPage: function(page) {
        // simulate writing to a database
        var rawPages = JSON.parse(localStorage.getItem('pages'));

        rawPages = rawPages || [];

        rawPages.push(page);

        localStorage.setItem('pages', JSON.stringify(rawPages));

        // simulate success callback
        setTimeout(function() {
            ServerActions.receiveCreatedPage(page);
        }, 0);
    }
};
