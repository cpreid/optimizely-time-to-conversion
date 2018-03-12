# Optimizely Time To Conversion

Optimizely Analytics Extension that allows you to measure the "Time To Conversion" for a given metric within your experiment

> This works by persisting a list of _timeable events_ & _bucketing timestamps_ in localStorage. Within Project JavaScript, there is an event tracking listener [(docs)](https://developers.optimizely.com/x/solutions/javascript/reference/#function_registerlisteners) that checks to see if the fired event lives in the list of _timeable events_. If so, the elapsed time (in seconds) between the `Start Timer At Event (api name)` timestamp and the current time is calculated and this value is dispatched as an event (numeric metric) to Optimizely.

> Update: Previously, the module used the Optimizely visitor attributes API to store the data. This resulted in sending large chunks of stringified JSON in every Optimizely event request. The timestamp data has since been moved to separate local storage keys. Caveat: Measuring time-to-conversion across domains will not work out of the box, since the timestamp data is no longer attached to the Optimizely visitor data storage. 

![Results Screen](https://github.com/cpreid/optimizely-time-to-conversion/blob/master/docs/resultsscreen.png)

### How to install
* Install the `Project JavaScript` code found in [projectjs.min.js](https://github.com/cpreid/optimizely-time-to-conversion/blob/master/projectjs.min.js)
* Create an Analytics Extension from JSON [(Optimizely docs)](https://help.optimizely.com/Integrate_Other_Platforms/Custom_analytics_integrations_in_Optimizely_X#Create_as_JSON)
  * Copy the JSON contents from [analytics-integration-config.json](https://github.com/cpreid/optimizely-time-to-conversion/blob/master/analytics-integration-config.json)
* Enable the extension you created [(Optimizely docs)](https://help.optimizely.com/Integrate_Other_Platforms/Custom_analytics_integrations_in_Optimizely_X#Enable_an_integration)

### How to use
* Create a Numeric Metric [(Optimizely docs)](https://help.optimizely.com/Measure_success%3A_Track_visitor_behaviors/Create_a_metric_in_Optimizely_X) and take note of its _api name_
* Navigate to the experiment to which you'd like to track the conversion
* Visit the 'Metrics' tab and add the Numeric Metric you created in the first step
  * Configure the metric to the following settings `Decrease in total value per conversion` 
  ![Configure Metrics](https://github.com/cpreid/optimizely-time-to-conversion/blob/master/docs/metricscreen.png)
* Visit the 'Integrations' tab and you will see a _Time To Conversion integration_ module 
![Integrations Screen](https://github.com/cpreid/optimizely-time-to-conversion/blob/master/docs/integrationscreen.png)
* Check the 'tracked' checkbox in the upper right
  * `Start Timer At Event (api name)` - _api name_ of the event you want to begin the timer (_required_)
  * `Stop Timer At Event (api name)` - _api name_ of the event you want to stop the timer (_required_)
  * `Elapsed Time Metric (api name)` - _api name_ of the numeric event you will track the elapsed time to (_required_)
  * `Max Time To Conversion` -  will ignore elapsed times above the supplied value
  * `Min Time To Conversion` - will ignore elapsed times below the supplied value  
  * `Resettable` - indicates you want to reset the timer if the user re-converts on `Start Timer At Event`
  * `Resettable After Elapsed Time (sec)` - will only reset the timer if a user re-converts on `Start Timer At Event` after the supplied number of seconds 
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
* _Timeable events_ that are registered into the visitors profile (via the `window.optimizely.get("custom/ttc").bindTTCTracking` call within the extension
* Dispatched tracking calls to Optimizely that include the numeric metric 'time to conversion'
---
### Future enhancements
* Multiple metric support (currently you can only configure to time a single metric)
* Conversions in the same session only (extension setting)

