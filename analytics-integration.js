if(extension.listen_for_evt && extension.track_ttc_event) {
  window.optimizely.get("custom/ttc").listenTrack(
    extension.listen_for_evt, 
    extension.track_ttc_event, 
    extension.resettable === 'yes');
}