ttcModule.clear();
ttcModule.bindTTCTracking('click_nav', 'visit_last_page', 'visit_last_page_ttc', {resettable:true, min: 5, max: 10});
ttcModule.checkEvt('click_nav');

/**
* convert after 3 seconds, should fail
*/
setTimeout(function() {
    ttcModule.checkEvt('visit_last_page');    
}, 3000);

/**
* convert after 7 seconds, should pass
*/
setTimeout(function() {
    ttcModule.checkEvt('visit_last_page');    
}, 7000);

/**
* convert after 12 seconds, should fail because converted at 7 seconds
*/
setTimeout(function() {
    ttcModule.checkEvt('visit_last_page');    
}, 12000);