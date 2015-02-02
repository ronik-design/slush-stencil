import slugify from 'uslug';

export default {
    formatPage(rawData) {
        var timestamp = Date.now();
        var id = 'm_' + timestamp;

        var formattedPage = {
            id: id,
            path: slugify(rawData.title),
            title: rawData.title,
            content: rawData.content,
            timestamp: timestamp
        };

        return formattedPage;
    }
};
