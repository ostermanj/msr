/* exported arrayFind */
import { arrayFind } from './polyfills';
import HighchartApp from './highchart-app.js';
var chartConfigs = [require('../chart-configs/msr-config.js').default, require('../chart-configs/sankey.js').default];
console.log(HighchartApp, chartConfigs);

HighchartApp.chartController.init(chartConfigs);            