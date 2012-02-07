var fs = require('fs');

module.exports = function(globalConfig, app) {
    //"use strict";
    var socketIoScriptCache = false;
    var log = globalConfig.log.getChild('ClientHandler');
    
    var clientJsDir = __dirname + '/../../public/js/';
    
  app.get('/client.js', function(req,res,next) {
      var files = [];
      if(req.query.modules) {
         var m  = req.query.modules.split(',');
         for(var i=0;i<m.length;i++) {
             if(/[a-zA-Z0-9,.\-]/.test(m[i])) {
                 files.push(m[i] + '.js');
             }
         }
          
      }
      
      
      files.push('client/client-noconflict.js');
      files.push('client/client-helpers.js');
      files.push('client/client-core.js');
      files.push('client/client-core-collect-data.js');
      
      //add async support as the last file
      files.push('client/client-async.js');
      
        res.contentType('application/x-javascript');
      sendSocketIo(res, function() {
        res.write("\n\n\n;\n");
        sendScriptFiles(res, next, files);
      });
  }); 
    
    //downloads the socket.io client lib and includes it in the response
    //TODO: verify if this works or that the libray must be included separately
    function sendSocketIo(res, cb) {
        var data = socketIoScriptCache;
        if(data) { 
            res.write(data);
            cb();
            return;
        }
        data='';
        console.log("Fetch socket.io from network");
        
        var siteInfo = globalConfig.site; 
        var http = require('http');
        var google = http.createClient(siteInfo.port, siteInfo.domain);
        var request = google.request('GET', siteInfo.root + 'socket.io.js', {'host': siteInfo.domainWithPort});
        request.end();
        data = '';
        request.on('response', function (response) {
          //console.log('STATUS: ' + response.statusCode);
          //console.log('HEADERS: ' + JSON.stringify(response.headers));
          response.setEncoding('utf8');
          response.on('end', function() {
            //console.log("DONE");
            socketIoScriptCache = data;
            res.write( data);
             if(cb) cb(); 
          });
          response.on('data', function (chunk) {
              //res.write(chunk);
              
            //console.log("DATA "+chunk.length);
              data += chunk;
                //console.log('BODY: ' + chunk);
          });
        });
    }
    
    function sendScriptFiles(res, next,files) {
        if(files.length === 0) {
            res.send(404);
            next();
        }
        //res.header('Content-Type' , 'application/x-javascript');
      //  res.contentType('application/x-javascript');
        //res.contentType('text/plain');
        res.write("(function(window) {\n");
          
          function _send(filename,cb) {
              var file = clientJsDir + filename;
              log.debug('File: '+ file);
              
              if(filename == 'jquery.js') res.write("\nvar realwindow = window; window = {};\n");
              
              fs.readFile(file, 'utf-8',function (err, data) {
                  if (err) {
                      res.write([
                          "\n\n\n\n/******************************\n\n",
                          "Error loading module: ",
                          filename,
                          "\n***************************************/\n\n\n"
                          ].join(''));
                        //estr = '' + err; 
                      
                     //return next(err);
                  } else {
                    res.write(data); 
                  }
                  
                  
                  if(filename == 'jquery.js') res.write("\nvar jQuery = window.jQuery, $ = window.$; window = realwindow;\n");
                  
                  
                  if(files.length > 0) {
                      res.write("\n\n;\n\n");
                      _send(files.shift(), cb);
                  } else {
                     log.debug('Done');
                      cb();
                  }
            });
              /*
              res.sendfile(file, function(err) {
                  if(err) return next(err);
                  if(files.length > 0) {
                      res.write("\n\n;\n\n");
                      _send(files.shift(), cb);
                  } else {
                      cb();
                  }
              });*/
          } 
          _send(files.shift(), function() { 
                res.write("\n})(this); \n");
                res.end();
                //next();
          }); 
       
    }
    
};