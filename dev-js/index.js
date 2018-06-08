import HighchartApp from './highchart-app.js';
var chartConfigs = [require('../chart-configs/msr-config.js').default];
console.log(HighchartApp, chartConfigs);

HighchartApp.chartController.init(chartConfigs);            