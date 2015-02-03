var Http = require('http'),
    Static = require('node-static');

var file = new Static.Server('./.build');

Http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(3000);
