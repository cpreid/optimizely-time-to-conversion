# optimizely-time-to-conversion

Allows you to automatically measure the time from visitor-bucketing to conversion 

## How to use
* Install the `Project JavaScript` code found in [projectjs.js](https://github.com/cpreid/optimizely-time-to-conversion/blob/master/projectjs.js)
* Create an Analytics Extension from JSON [(Optimizely docs)](https://help.optimizely.com/Integrate_Other_Platforms/Custom_analytics_integrations_in_Optimizely_X#Create_as_JSON)
  * Copy the JSON contents from [analytics-integration-config.json](https://github.com/cpreid/optimizely-time-to-conversion/blob/master/analytics-integration-config.json)
* Enable the extension you created [(Optimizely docs)](https://help.optimizely.com/Integrate_Other_Platforms/Custom_analytics_integrations_in_Optimizely_X#Enable_an_integration)
* Create a Numeric Metric [(Optimizely docs)](https://help.optimizely.com/Measure_success%3A_Track_visitor_behaviors/Create_a_metric_in_Optimizely_X) 
  * This metric's _api name_ will be used when configuring the integration within an experiment
* Visit the `Integrations` tab within an experiment
* Check the 'tracked' checkbox next to the *Time To Conversion* integration module
  * Set the `Listen for Event (api name)` field to the _api name_ of the event you want to time
  * Set the `Time To Conversion Event (api name)` field to the _api name_ of the numeric metric you created above
  * Select the appropriate _Reset timer on re-bucket_ setting. If you want to reset the timer on each re-bucket in the experiment, choose 'yes' otherwise choose 'no'.
* Save and Publish the experiment
