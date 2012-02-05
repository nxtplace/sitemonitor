var fs = require('fs');

module.exports = function(app, log) {
    log = log.getChild('ClientHandler');
    
    var clientJsDir = __dirname + '/../../public/js/';
    
  app.get('/client.js', function(req, res, next) {      
      sendScriptFiles(res, next, ['client.js']);
  }); 
  app.get('/client-full.js', function(req, res, next) {      
      sendScriptFiles(res, next, ['jquery.js','client.js']);
  }); 
    
    function sendScriptFiles(res, next,files) {
        if(files.length == 0) {
            res.send(404);
            next();
        }
        //res.header('Content-Type' , 'application/x-javascript');
        res.contentType('application/x-javascript');
        //res.contentType('text/plain');
        res.write("(function(window) {\n");
          
          function _send(filename,cb) {
              file = clientJsDir + filename;
              log.debug('File: '+ file);
              
              if(filename == 'jquery.js') res.write("\nvar realwindow = window; window = {};\n");
              
              fs.readFile(file, 'utf-8',function (err, data) {
                  if (err) return next(err);
                  
                  res.write(data);
                  
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