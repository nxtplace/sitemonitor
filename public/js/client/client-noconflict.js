 
(function(OldDomTracker) {
    var DomTracker = window.DomTracker || {};
    window.DomTracker = DomTracker;
    DomTracker.noConflict=function() {
        if(OldDomTracker) {
            window.DomTracker = OldDomTracker; 
            OldDomTracker=null;
        }
        return DomTracker;
    }; 
})(window.DomTracker);
