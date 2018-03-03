if(extension.start_at_evt && extension.stop_at_evt && extension.elapsed_ttc_metric) {
  var ttc = window.optimizely.get("custom/ttc"),
      configOptions = {resettable:false};
  
  // configure resettable parameter
    var resettableThreshold = parseFloat(extension.resettable_threshold),
      resettable = extension.resettable === 'yes';
  configOptions.resettable = resettableThreshold || resettable;
  
  // configure min/max
  var min = parseFloat(extension.max_ttc),
      max = parseFloat(extension.min_ttc);
  if(min) configOptions.min = min;
  if(max) configOptions.max = max;  
  
    ttc.bindTTCTracking(
    extension.start_at_evt, 
    extension.stop_at_evt, 
        extension.elapsed_ttc_metric, 
    configOptions
  );
}