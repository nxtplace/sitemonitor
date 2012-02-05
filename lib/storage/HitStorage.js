
var crypto = require('crypto');

function md5(str) {
    return crypto.createHash("md5")
        .update(str)
        .digest("hex");   
}
function Storage() {
       
}
Storage.prototype = {
    constructor: Storage,
    
    
}

Storage._instance=new Storage();
Storage.getInstance = function() {
    return Storage._instance;   
}

module.exports = Storage._instance;

