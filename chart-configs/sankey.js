const dataSource = require('../data/sankey.json');
import { dataController } from '../dev-js/highchart-app.js';

function createSeries(dataSource, year = this.initialCategory){
    
    var series =  [{
        keys: ['from', 'to', 'weight', 'colorIndex', 'className'],
        
        type: 'sankey',
        nodes: [
          {
            id: 'reduction',
            colorIndex: 10,
            name: '1-ton reduction in emissions'
          },
          {
            id: 'tnac',
            colorIndex: 1,
            name: 'Fraction still in circulation'
          }, {
            id: 'msr',
            colorIndex: 2,
            name: 'Fraction left in reserve'
          }, {
            id: 'cancel',
            colorIndex: 4,
            name: 'Fraction cancelled'
          }
        ]
        
    }];
    console.log(series)
    return series;
}

function updateChart(year){

    this.Highchart.update(
        {
            series:[{data: dataSource.find(y => y.year === parseInt(year)).data.slice()}]
        }
    );
    //this.Highchart.series[0].setData(dataSource.find(y => y.year === parseInt(year)).data.slice()); 
    // * important* without slice, the value of data propert would be assigned by reference to datasource
    // and all future assignments would change the value of the original. slice() makes a shallow copy
    // so that 2018  can be returned to without overwriting it.

}
export default { 
    defs: {
        gradient0: { // key
            tagName: 'linearGradient',
            id: 'gradient-0',
            x1: 0,
            y1: 0,
            x2: 1,
            y2: 0,
            children: [{
                tagName: 'stop',
                offset: 0
            }, {
                tagName: 'stop',
                offset: 1
            }]
        },
        gradient1: { // key
            tagName: 'linearGradient',
            id: 'gradient-1',
            x1: 0,
            y1: 0,
            x2: 1,
            y2: 0,
            children: [{
                tagName: 'stop',
                offset: 0
            }, {
                tagName: 'stop',
                offset: 1
            }]
        },
        gradient2: { // key
            tagName: 'linearGradient',
            id: 'gradient-2',
            x1: 0,
            y1: 0,
            x2: 1,
            y2: 0,
            children: [{
                tagName: 'stop',
                offset: 0
            }, {
                tagName: 'stop',
                offset: 1
            }]
        },
        gradient3: { // key
            tagName: 'linearGradient',
            id: 'gradient-3',
            x1: 0,
            y1: 0,
            x2: 1,
            y2: 0,
            children: [{
                tagName: 'stop',
                offset: 0
            }, {
                tagName: 'stop',
                offset: 1
            }]
        }
    },
    chart: {
        //inverted: true,
        //height: 1200
        
       
    },
    plotOptions: {
        sankey: {
          colorByPoint: false,
          curveFactor: 0.33,
          nodePadding: 50,
          nodeWidth: 20,
          dataLabels: {
            inside: false,
            align: 'right',  
            overflow: 'none',
            crop: false
          }
        }

    },
    title: {
        text: 'Average outcome of one 1-ton reduction by 2030',
        margin: 0
    },

    tooltip: {
        enabled: false
    },
    
    // extends Highcharts options
    dataSource: dataSource,
    initialCategory: 2018,
    seriesCreator: createSeries,
    updateFunction: updateChart,
    initialUpdateParams: [2018],
    userOptions: {
        type: 'dropdown',
        options: [
            {key: '2018', value: 2018},
            {key: '2020', value: 2020},
            {key: '2022', value: 2022},
            {key: '2024', value: 2024},
            {key: '2026', value: 2026},
            {key: '2028', value: 2028}
        ],
        legend: 'Select year reduction is made'
    },
    note: null
    
};