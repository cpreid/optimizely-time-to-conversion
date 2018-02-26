# optimizely-time-to-conversion

Optimizely Analytics Extension that allows you to measure the "Time To Conversion" for a given metric within your experiment

> This works by persisting a list of _timeable events_ & _bucketing timestamps_ by means of the [(user api)](https://developers.optimizely.com/x/solutions/javascript/reference/index.html#function_setuser). Within Project JavaScript, there is an event tracking listener [(docs)](https://developers.optimizely.com/x/solutions/javascript/reference/#function_registerlisteners) that checks to see if the fired event lives in the list of _timeable events_. If so, the elapsed time (in seconds) between the bucketing decision and the current time is calculated and this value is dispatched as an event (numeric metric) to Optimizely.

![Results Screen](https://github.com/cpreid/optimizely-time-to-conversion/blob/master/docs/resultscreen.png)

### How to install
* Install the `Project JavaScript` code found in [projectjs.js](https://github.com/cpreid/optimizely-time-to-conversion/blob/master/projectjs.js)
* Create an Analytics Extension from JSON [(Optimizely docs)](https://help.optimizely.com/Integrate_Other_Platforms/Custom_analytics_integrations_in_Optimizely_X#Create_as_JSON)
  * Copy the JSON contents from [analytics-integration-config.json](https://github.com/cpreid/optimizely-time-to-conversion/blob/master/analytics-integration-config.json)
* Enable the extension you created [(Optimizely docs)](https://help.optimizely.com/Integrate_Other_Platforms/Custom_analytics_integrations_in_Optimizely_X#Enable_an_integration)

### How to use
* Create a Numeric Metric [(Optimizely docs)](https://help.optimizely.com/Measure_success%3A_Track_visitor_behaviors/Create_a_metric_in_Optimizely_X) and take note of its _api name_
* Navigate to the experiment to which you'd like to track the conversion
* Visit the 'Metrics' tab and add the Numeric Metric you created in the first step
* Visit the 'Integrations' tab and you will see a _Time To Conversion integration_ module 
![Integrations Screen](https://github.com/cpreid/optimizely-time-to-conversion/blob/master/docs/integrationsscreen.png)
* Check the 'tracked' checkbox in the upper right
  * Set the `Listen for Event (api name)` field to the _api name_ of the event you want to time
  * Set the `Time To Conversion Event (api name)` field to the _api name_ of the numeric metric you created above
  * Select the appropriate _Reset timer on re-bucket_ setting. If you want to reset the timer on each re-bucket in the experiment, choose 'yes' otherwise choose 'no'.
* Save your changes, Publish the experiment
---
### Debugging

#### Use the following method to log the data persisted to the visitor profile via the extension

```
window.optimizely.get("custom/ttc").debug();
```

#### Enable logging to debug the following as they occur:
```
localStorage.setItem('logttc', 1);
```
* _Timeable events_ that are registered into the visitors profile (via the `window.optimizely.get("custom/ttc").listenTrack` call within the extension
* Dispatched tracking calls to Optimizely that include the numeric metric 'time to conversion'
---
### Future enhancements
* Max time-to-conversion (extension setting)
* Conversions in the same session only (extension setting)

