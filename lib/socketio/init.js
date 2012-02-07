
module.exports = function(globalConfig) {
    var app = globalConfig.app,
        io = globalConfig.io,
        parseCookie=globalConfig.parseCookie;
        
    if(!parseCookie) parseCookie=require('connect').utils.parseCookie;
    
      
     //@see: http://www.danielbaulig.de/socket-ioexpress/
    //setup socket.io
    var sio = io.listen(app, {
        // allow caching, using e-tag
        'browser client etag': true,
        //minify:
        'browser client minification': true
        // gzip spawns a child process which is not always allowed :(
        //'browser client gzip': true
        
        }); 
    globalConfig.sio = sio;
    
    //parse the expressjs session id cookie
    sio.set('authorization', function (data, accept) {
        // check if there's a cookie header
        if (data.headers.cookie) {
            // if there is, parse the cookie
            data.cookie = parseCookie(data.headers.cookie);
            // note that you will need to use the same key to grad the
            // session id, as you specified in the Express setup.
            data.sessionID = data.cookie['express.sid'];
        } else {
           // if there isn't, turn down the connection with a message
           // and leave the function.
           return accept('No cookie transmitted.', false);
        }
        // accept the incoming connection
        accept(null, true);
    });
  
    
};