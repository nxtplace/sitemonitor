
(function(DomTracker, window,oldQueue) {
    var trackers = {};
    /* call function */
    function handle(arg) {
        var p1 = arg.shift(),
            tracker = 'default',
            idx = p1.indexOf('.');
        if(idx !== -1) {
            tracker = p1.substr(0,idx);
            p1 = p1.substr(idx + 1);
        }
        if(!trackers[tracker]) {
            trackers[tracker] = new DomTracker.Class();
        }
        tracker = trackers[tracker];
        
        
        var cstack = p1.split('.'),
            obj = tracker;
        while(cstack.length > 1 && obj) { obj = obj[cstack.shift()]; }
        if(obj) {
            obj[cstack.shift()].apply(obj, arg);
        }         
    }
    
    var _dtq = window._dtq = {
        push:function(data) {
            for(var i=0;i<arguments.length;i++) {
                handle(arguments[i]); 
            } 
        }
    };
    if(oldQueue) {
        setTimeout(function() {
            var tmp;
            while(oldQueue.length > 0) {
                tmp = oldQueue.shift();
                _dtq.push(tmp);
            }
        }, 0);
    }
    
})(window.DomTracker,window,window._dtq);

//DomTracker

