// always keep at the top
window.optimizely = window.optimizely || [];

var ttcModule = function() {

  var attrKeys = {start: 'start_ttc_data', stop: 'stop_ttc_data'};

  var log = function() {
    if(localStorage.getItem('logttc')) {
      console.log.apply(console, arguments);
    }
  }
  
  var getData = function(attrKey) {
    var bucketedMetadata = {};
    try {
      bucketedMetadata = JSON.parse(window.localStorage.getItem(attrKey + "_" + window.optimizely.get("visitor").visitorId));
    } catch (err) {}
    return bucketedMetadata;
  }

  var setData = function(attrKey, ttcData) {
    window.localStorage.setItem(attrKey + "_" + window.optimizely.get("visitor").visitorId, JSON.stringify(ttcData));
  }  

  var measureDelta = function(start) {
    var delta = null;
    if(start) {
      try {
        delta = (new Date() - new Date(start)) / 1000;
      } catch(err) { }
    }        
    return delta;
  }

  var validateResettable = function(ts, reset) {
    if(reset === false || !ts) return false;
    else if(reset === true) return true;
    else { // reset can be a number of minutes
      measureDelta(ts) >= reset;
    }    
  }

  var validateBounds = function(delta, min, max) {
    log('Validate bounds', min + ' < ' + delta + ' < ' + max); 
    var valid = true;
    if(min !== null && delta < min) valid = false;
    if(max !== null && delta > max) valid = false;
    return valid;
  }

  var markStarted = function(evtName, startClockData) {
    var entry = startClockData[evtName],
        resettable = validateResettable(entry.ts, entry.r);
    if(!entry.ts || resettable) {
      entry.ts = (new Date).getTime();
      startClockData[evtName] = entry;
      setData(attrKeys.start, startClockData);
      log('Started clock (' + evtName + ')', entry);
    }
  }

  var markStopped = function(evtName, stopClockData, startClockData) {
    var stopEntry = stopClockData[evtName],
        findStart = startClockData[stopEntry.s] || null,
        timeDelta = measureDelta(findStart ? findStart.ts : null),
        validBounds = validateBounds(
                        timeDelta, 
                        stopEntry ? stopEntry.y : null, 
                        stopEntry ? stopEntry.z : null);

    if(!stopEntry.o && findStart && findStart.ts && validBounds) {            
      log('Track stopEntry (' + stopEntry.t + ')', timeDelta, stopEntry, findStart);
      window.optimizely.push({
       "type": "event",
       "eventName": stopEntry.t,
       "tags": {
         "value": timeDelta                   
       }
      });
      stopEntry.o = true;
      stopClockData[evtName] = stopEntry;
      setData(attrKeys.stop, stopClockData);
    }        
    else if(!stopEntry.o && findStart && !findStart.ts) {
      log('Start stopEntry has null timestamp');
    }
    else if(!stopEntry.o && findStart && findStart.ts && !validBounds) {
      log('Timedelta out of bounds', timeDelta, findStart);
    }
    else if(!stopEntry.o && !findStart) {
      log('Couldnt find start', stopEntry);
    }
    else {
      log('Already tracked', stopEntry);
    }  
  }

  var bindStopListener = function(startEvtName, stopEvtName, trackToEvtName, config) {
    var stopClockData = getData(attrKeys.stop),
        newEntry = {
          's': startEvtName,
          't': trackToEvtName,
          'o': false,
          'y': config.min || null,
          'z': config.max || null
        };
    if(!stopClockData[stopEvtName]) {
      stopClockData[stopEvtName] = newEntry;
      setData(attrKeys.stop, stopClockData);
    }
  }

  var bindTTCTracking = function(startEvtName, stopEvtName, trackToEvtName, config) {
    config = config || {};
    var startClockData = getData(attrKeys.start),
        newEntry = {
          'ts': null,
          'r': config.resettable || false
        };

    var existingEntry = startClockData[startEvtName];
    if(config.resettable && existingEntry) {
      existingEntry.ts = newEntry.ts;
      startClockData[startEvtName] = existingEntry;
      setData(attrKeys.start, startClockData);
    }
    else if(!existingEntry) {
      startClockData[startEvtName] = newEntry;
      setData(attrKeys.start, startClockData);
      bindStopListener(startEvtName, stopEvtName, trackToEvtName, config);            
    }
  }

  var checkEvt = function(evtName) {
    var startClockData = getData(attrKeys.start),
        stopClockData  = getData(attrKeys.stop);
    if(startClockData[evtName]) markStarted(evtName, startClockData);
    if(stopClockData[evtName]) markStopped(evtName, stopClockData, startClockData);
  }

  var _debug = function() {
    console.log('Start', getData(attrKeys.start));
    console.log('Stop', getData(attrKeys.stop));
  }

  var clear = function() {
    setData(attrKeys.start, {});
    setData(attrKeys.stop, {});
  }

  return {
    bindTTCTracking: bindTTCTracking,
    checkEvt: checkEvt,
    debug: _debug,
    clear: clear
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
     window.optimizely.get("custom/ttc").checkEvt(evt.data.apiName);
  }
});