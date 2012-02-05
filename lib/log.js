var util = require('util');

/* simple logging 

    // supports util.format syntax: http://nodejs.org/docs/latest/api/util.html#util.format
    
    e.g. log.debug('%s %s', 1, 2, 3, 4)
*/
function Log(category) {
    this.category = category || '';
}
module.exports = Log;

Log.enabled = true;
Log.minLevel = -1;
Log.Level = {};
Log.getChild = function(cat) {
    if(!Log._rootLogger) Log._rootLogger = new Log();
    return Log._rootLogger.getChild(cat);
};
Log.prototype = { 
    constructor: Log,
    getChild:function(cat) {
        var c = this.category ;
        if(c) c += '.';
        return new Log(c + cat);
    }
};

var arrayJoin = Array.prototype.join;
var arrayShift = Array.prototype.shift;
function formatNumber(nr) {
    if(nr < 10) return '0'+nr;
    return nr;
}
function doLog(lvl,type, category, msg) {
    if(!Log.enabled || lvl < Log.minLevel) return; 
    var d = new Date(); 
    var d2 = d.getFullYear() + '-' + formatNumber((d.getMonth() + 1)) + '-'  + formatNumber(d.getDate());
    d2 += ' '+ formatNumber(d.getHours()) + ':'+ formatNumber(d.getMinutes()) + ':' + formatNumber(d.getSeconds());
    
    if(msg.length > 1) {
        var format = arrayShift.call(msg);
        msg = util.format.apply(format, msg); 
    } else {
        msg = msg[0];
        //arrayJoin.call(msg, '')
    }
    console.log('[' + d2 + '] [' + type + '] ' + category + ' ' + msg);
}

var types = ['trace','debug','log','info','warn','error','fatal'];
for(var i=0;i<types.length;i++) {
    (function(type,lvl) {
        var name = type.toUpperCase(); 
        Log.Level[name] =
            Log.Level[type] = 
            lvl;
        
        Log[type] = function(msg) {
            doLog(lvl,name,'', arguments);
        };
        Log.prototype[type] = function(msg) {
            doLog(lvl,name,this.category, arguments);
        };
    })(types[i], i + 1);
}




