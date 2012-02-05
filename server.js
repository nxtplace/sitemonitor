
var http = require('http');



http.createServer(function(req, res) {
    res.write('hello world2');
    res.end();
}).listen(process.env.PORT || process.env.C9_PORT);
