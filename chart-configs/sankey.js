const dataSource = require('../data/sankey.json');
import { dataController } from '../dev-js/highchart-app.js';
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
        inverted: true,
        height: 1200
        
       
    },
    plotOptions: {
        sankey: {
          colorByPoint: false,
          curveFactor: 0.33,
          nodePadding: 50,
          nodeWidth: 20,
          dataLabels: {
            enabled: false
          }

        }

    },
    title: {
        text: 'Highcharts Sankey Diagram'
    },

    series: [{
        keys: ['from', 'to', 'weight', 'colorIndex', 'className'],
        data: dataSource,
        type: 'sankey',
        name: 'Sankey demo series',
        nodes: [
          {
            id: 'reduction',
            colorIndex: 10
          },
          {
            id: 'tnac-0',
            colorIndex: 1
          }, {
            id: 'tnac-1',
            colorIndex: 1
          }, {
            id: 'tnac-2',
            colorIndex: 1
          }, {
            id: 'tnac-3',
            colorIndex: 1
          }, {
            id: 'tnac-4',
            colorIndex: 1
          }, {
            id: 'tnac-5',
            colorIndex: 1
          }, {
            id: 'tnac-6',
            colorIndex: 1
          }, {
            id: 'tnac-7',
            colorIndex: 1
          }, {
            id: 'tnac-8',
            colorIndex: 1
          }, {
            id: 'tnac-9',
            colorIndex: 1
          }, {
            id: 'tnac-10',
            colorIndex: 1
          }, {
            id: 'tnac-11',
            colorIndex: 1
          }, {
            id: 'tnac-12',
            colorIndex: 1
          }, {
            id: 'msr-1',
            colorIndex: 2
          }, {
            id: 'msr-2',
            colorIndex: 2
          }, {
            id: 'msr-3',
            colorIndex: 2
          }, {
            id: 'msr-4',
            colorIndex: 2
          }, {
            id: 'msr-5',
            colorIndex: 2
          }, {
            id: 'msr-6',
            colorIndex: 2
          }, {
            id: 'msr-7',
            colorIndex: 2
          }, {
            id: 'msr-8',
            colorIndex: 2
          }, {
            id: 'msr-9',
            colorIndex: 2
          }, {
            id: 'msr-10',
            colorIndex: 2
          }, {
            id: 'msr-11',
            colorIndex: 2
          }, {
            id: 'msr-12',
            colorIndex: 2
          }, {
            id: 'cancel-5',
            colorIndex: 4
          }, {
            id: 'cancel-6',
            colorIndex: 4
          }, {
            id: 'cancel-7',
            colorIndex: 4
          }, {
            id: 'cancel-8',
            colorIndex: 4
          }, {
            id: 'cancel-9',
            colorIndex: 4
          }, {
            id: 'cancel-10',
            colorIndex: 4
          }, {
            id: 'cancel-11',
            colorIndex: 4
          }, {
            id: 'cancel-12',
            colorIndex: 4
          }
        ]
    }],
    
    // extends Highcharts options
    dataSource: null,
    initialCategory: null,
    seriesCreator: null,
    updateFunction: null,
    userOptions: null,
    note: null
};