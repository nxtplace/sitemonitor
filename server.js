

var DEBUG = !!process.env.C9_PORT,
    express = require('express'),
    log = require('./lib/log.js');

console.log("Start Test");
log.debug("Starting... port: " + (process.env.PORT || process.env.C9_PORT));

var app = express.createServer();
app.configure(function(){
    //app.use(express.methodOverride());
    //app.use(express.logger({ format: ':method :url' }));
    app.use(express.logger());
    
    app.use(express.bodyParser());
    
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'SiteMonitor2012',
        cookie: { path: '/', httpOnly: true, maxAge: 14400 * 1000 }
    }));
    
    app.use(app.router);
        
    app.use(express['static'](__dirname + '/public', DEBUG ? {} : { maxAge: 3600 * 1000 }));
    
    if(DEBUG) app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    else app.use(express.errorHandler());
});

app.get('/', function(r,r2) {
    log.info('Test'); 
    r2.end();
});
/*
http.createServer(function(req, res) {
    res.write('hello world2');
    res.end();
}).listen(process.env.PORT || process.env.C9_PORT);
*/

app.listen(process.env.PORT || process.env.C9_PORT);