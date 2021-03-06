

var DEBUG = !!process.env.C9_PORT,
    PROTOCOL_HTTP = 'http://',PROTOCOL_HTTPS = 'https://',
    APP_PROTOCOL = PROTOCOL_HTTP,
    APP_DOMAIN = 'sitemonitor.nxtplace.c9.io',
    APP_PORT = 80,
    APP_PATH_ROOT = '/',
    IS_DEFAULT_PORT = (APP_PROTOCOL == PROTOCOL_HTTP && APP_PORT == 80) || (APP_PROTOCOL == PROTOCOL_HTTPS && APP_PORT == 443),
    APP_DOMAIN_WITH_PORT = APP_DOMAIN +(IS_DEFAULT_PORT ? '' : (':'+ APP_PORT)),
    globalConfig = {
        site: {
            protocol: APP_PROTOCOL,
            domain: APP_DOMAIN,
            domainWithPort: APP_DOMAIN_WITH_PORT,
            port: APP_PORT,
            root: APP_PATH_ROOT
        },
        siteRoot: APP_PROTOCOL + APP_DOMAIN_WITH_PORT + APP_PATH_ROOT,
        apiEndpoint: APP_PROTOCOL + APP_DOMAIN_WITH_PORT + APP_PATH_ROOT + 'api/' 
    },
    express = require('express'),
    connect = require('./node_modules/express/node_modules/connect/index.js'),
    parseCookie = connect.utils.parseCookie,
    io = require('socket.io'),
    log = require('./lib/log.js'),
    handlersPath = './lib/handlers/',
    handlers = [
        'clienthandler',
        'api-store'
        ];
        
globalConfig.parseCookie = parseCookie;
globalConfig.io = io;
globalConfig.log = log; 


log.debug("Starting... port: %d" , (process.env.PORT || process.env.C9_PORT));




var app = express.createServer();
globalConfig.app = app;


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
         
   // app.use(connect['conditional-get']);
    
    app.use(app.router);
        
    app.use(express['static'](__dirname + '/public', DEBUG ? {} : { maxAge: 3600 * 1000 }));
    
    if(DEBUG) app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    else app.use(express.errorHandler());
});
 
require('./lib/socketio/init.js')(globalConfig);





for(var i=0;i<handlers.length;i++) {
    require(handlersPath + handlers[i] + '.js')(globalConfig,app, log);
}

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