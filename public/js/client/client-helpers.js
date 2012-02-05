
var DomTracker = DomTracker || {};
(function(DomTracker) {
    
DomTracker.Helpers = {
    extend:function(dest, src) {
        var args = arguments;
        for(var i=1;i<args.length;i++) {
            var arg = args[i];
            for(var x in arg) {
                if(arg.hasOwnProperty(x)) {
                    dest[x] = arg[x];
                }
            }
        }
    },
    extendIf:function(dest, src) {
        var args = arguments;
        for(var i=1;i<args.length;i++) {
            var arg = args[i];
            for(var x in arg) {
                if(arg.hasOwnProperty(x) && !dest.hasOwnProperty(x)) {
                    dest[x] = arg[x];
                }
            }
        }
    },
    
    loadScript:function(url, callback) {
        var el = document.createElement('script');
        el.type = 'text/javascript'; 
        if(callback) {
            var onLoadCb = function() {
                if(callback){
                    callback();
                }
                callback=null;
            };
            el.onload = onLoadCb;
            if(el.addEventListener) {
                el.addEventListener('load', onLoadCb); 
            } else if(el.attachEvent) {
                el.attachEvent('onload', onLoadCb);
            }
        }
        el.src = url;
        
        var head = document.getElementsByTagName('HEAD')[0]; 
        head.appendChild(el);  
        
    },
    addListener:function(element, eventName, handler) {
        var usecapture = true;
		element.addEventListener(eventName, handler, usecapture); 
	},
    
    isWindow: function(obj) {
        return obj && typeof obj === "object" && "setInterval" in obj;
	},
	getWindow:function(elem) {
		return DomTracker.Helpers.isWindow( elem ) ?
			elem :
			elem.nodeType === 9 ?
				elem.defaultView || elem.parentWindow :
				false;
	}
    
};


})(DomTracker);