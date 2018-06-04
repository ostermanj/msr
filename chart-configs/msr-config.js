const dataSource = require('../data/msr-data.json');
import { dataController } from '../dev-js/highchart-app.js';
//import { sharedMethods } from '../dev-js/shared-methods.js';

export default { 
    chart: {  
        //height: 500,
        type: 'column'  
    },
    plotOptions: {
        column: {
        //    stacking: 'normal'
        }   
    },  
    subtitle: {
        text: null
    },           
    title: {
        text: null
    },
    tooltip: {
        valueDecimals: 0,
        valueSuffix: ' million tons'
    },
    xAxis: {
        categories: ['Standard Scenario', 'High Gas Prices', 'High Demand', 'High Demand<br />and Gas Prices'], // TO DO: set programatically
        labels: {
            y: 40 
        }
    },
    yAxis: {
        max:5000, // TO DO: set programmatically
        reversedStacks: false,
        endOnTick:false,
        stackLabels: {
            crop: false,
            enabled: true,
            formatter: function() {
                return this.total !== 0 ? this.stack : 'n.a.'; 
            },
            overflow: 'none',
            verticalAlign: 'bottom',
            y: 20
        },
        title: {
            text: 'terawatt hours',
            align:'high',
            reserveSpace: false,    
            rotation: 0,
            margin:0,
            y: -25,
           // offset: -60,
            x: -10
        } 
    },
    /* extends highcharts */
    dataSource: dataController.nestData(dataSource, ['category','aeo','scenario']),
    initialCategory: 'baseline',
    initialUpdateParams: ['baseline'],
    isMultiple: true,
    seriesCreator: sharedMethods.createBarSeries,
    updateFunction: sharedMethods.updateChart,
    userOptions: sharedMethods.userOptions,
    note: 'Annual Energy Outlook estimates from 2011 (old) and 2016 (new). ' + 
          'Estimates from 2016 do not have the “high demand and gas prices” scenario. ' + 
          'Estimates from 2011 for the “high gas prices” and “high demand” scenarios are not available for the the $50/ton tax option. ' + 
          'Carbon-tax levels change over time—dollar amounts correspond to 2018 levels. Source: U.S. Energy Information Administration.',
};