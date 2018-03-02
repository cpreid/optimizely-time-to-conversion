// always keep at the top
window.optimizely = window.optimizely || [];

var ttcModule = function() {

  var attributeKey = 'ttc';

  var log = function() {
    if(localStorage.getItem('logttc')) {
      console.log.apply(console, arguments);
    }
  }
  
  var getData = function() {
    var bucketedMetadata = {};
    try {
      bucketedMetadata = JSON.parse(window.optimizely.get('visitor').custom[attributeKey].value);
    } catch (err) {}
    return bucketedMetadata;
  }

  var findIdxByKey = function(haystack, key, value) {
    if (!haystack || !haystack.length) return -1;
    for (var i = 0; i < haystack.length; i++) {
      if (haystack[i][key] === value) {
        return i;
      }
    }
    return -1;
  }

  var saveTTCData = function(ttcData) {
    var saveAttr = {type: 'user', attributes: {}};
    saveAttr.attributes[attributeKey] = JSON.stringify(ttcData);
    window.optimizely.push(saveAttr);
  }

  var listenTrack = function(listenFor, trackTo, resettable) {
    var ttcData = getData(),
        trackItem = {
          // starting timestamp in ms epoch
          't': (new Date).getTime(), 
          // session that timer was started
          's': window.optimizely.get('session').sessionId,
          // numeric metric to track to
          'e': trackTo,
          // flag to only track once
          'o': false 
        };        

    var existingItem = findIdxByKey(ttcData[listenFor], 'e', trackTo);
    // update the time and session of existing trackable item
    if (resettable && existingItem > -1) {      
      ttcData[listenFor][existingItem].t = trackItem.t;
      ttcData[listenFor][existingItem].s = trackItem.s;
      log('Register listener for "' + listenFor + '"', ttcData);
    } 
    // new trackable item
    else if(existingItem < 0) {      
      ttcData[listenFor] = (ttcData[listenFor] || []).concat(trackItem);
      log('Register listener for "' + listenFor + '"', ttcData);      
    }
    saveTTCData(ttcData);
  }

  var checkDispatch = function(listenFor) {
    var ttcData = getData();
    (ttcData[listenFor] || []).forEach(function(item, idx, arr) {
      if(!item.o) {
        var timeDelta = Math.round((new Date() - new Date(item.t)) / 1000);
        log('Dispatch', item.e, timeDelta);
        arr[idx].o = true;
        window.optimizely.push({
         "type": "event",
         "eventName": item.e,
         "tags": {
           "value": timeDelta                   
         }
        });
      }             
    });
    saveTTCData(ttcData);
  }

  var _debug = function() {
    console.log(getData());
  }

  return {
    listenTrack: listenTrack,
    checkDispatch: checkDispatch,
    debug: _debug
  }

}();

/**
* Register ttcModule as an Optimizely module
*/
window.optimizely.push({
  type: "registerModule",
  moduleName: "ttc",
  module: ttcModule
});

/**
* Listen for all Optimizely events
* Check to see if they have a trackable ttc item
* Dispatch numeric event to optimizely
*/
window.optimizely.push({
  type: "addListener",
  filter: {
    type: "analytics",
    name: "trackEvent"
  },
  handler: function(evt) {
     window.optimizely.get("custom/ttc").checkDispatch(evt.data.apiName);
  }
});