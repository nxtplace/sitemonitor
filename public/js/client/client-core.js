

var DomTracker = DomTracker || {};

(function(DomTracker) {    
   "use strict";
  
    var Helper = DomTracker.Helper;
    
    DomTracker.start = function(config) {
        return new DomTracker.Class(config).start();
    };
    DomTracker.noConflict = function() {
        
    };
    
    //stuff
    var DomTrackerClz = DomTracker.Class = function (cfg) {
        if(!(this instanceof DomTrackerClz)) {
            return new DomTrackerClz(cfg);
        }
        DomTracker.Helper.extend(this, cfg);
        //init
        this._init();
    };
    DomTrackerClz.prototype = {
        constructor: DomTrackerClz,
        api: null,
        _init:function() {
            this._queue = [];
        },
        
        _trackMoves:function() {
            this.enableMove = true;
        },
        _trackClicks:function() {
            this.enableClicks = true;
        },
        
        
        _setApi:function(url) {
            this.api = url;
        },
        _setAccount:function(id) {
            this.accountId = id;
        },
        start:function() {
            
            return this;
        }
    };
    
    
})(DomTracker);
