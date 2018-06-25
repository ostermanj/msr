const dataSource = require('../data/sankey.json');
import { dataController } from '../dev-js/highchart-app.js';

function createSeries(dataSource, year = this.initialCategory){
    
    var ChartConfig = function(parentConfig, type, i){
        console.log(this, parentConfig, type);
        this.currentCategory = this.initialCategory;
        this.indexInSet= i;
        this.childData = type;
        this.series = createChildSeries.call(this, type);//, y, scenario);
        for ( var key in parentConfig ) { // take the the ownProperties of the parent config and make them
                                          // the own properties of the child. Highcharts config obj won't work
                                          // with prototypically inherited properties  
            if ( parentConfig.hasOwnProperty(key) ){
                this[key] = parentConfig[key];
            }
        }
        this.title.text = i === 0 ? 'Average outcome in 2030 of one 1-ton reduction' : 'Marginal outcome in 2030 of one additional 1-ton reduction';
        this.plotOptions.sankey.nodePadding = i === 0 ? 50 : 100;
        
    }
    ChartConfig.prototype = this;   

    console.log(this.index);
    var parentContainer = document.getElementById('chart-' + this.index);
    this.setLength = dataSource.length;
    this.children = [];

    dataSource.forEach((type, i, array) => {
        var container = document.createElement('div');
        container.className = 'chart-container';
        container.id = 'chart-' + this.index + '-multiple-' + i;
        parentContainer.appendChild(container);
        var childConfig = new ChartConfig(this, type, i);
        this.children.push( new Highcharts.chart('chart-' + this.index + '-multiple-' + i, childConfig) );
    });
    
}
function createChildSeries(type){
    return [{
        keys: ['from', 'to', 'weight', 'colorIndex', 'className'],
        data: type.find(y => y.year === parseInt(this.initialCategory)).data.slice(),
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
    
}
function updateCharts(year){
    console.log(this);
    this.children.forEach(chart => {
        chart.userOptions.currentCategory = year;
        
        chart.update( {
            series:[{data: chart.userOptions.childData.find(y => y.year === parseInt(year)).data.slice()}]
        });
    });


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
        height: 225
        
       
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
            crop: false,
            nodeFormatter: function(){
                console.log(this);
                return this.point.id === 'reduction' ? this.key : this.key + ': ' + Highcharts.numberFormat(this.point.sum, 2);
            }
          }
        }

    },
    title: {
        text: 'Average outcome in 2030 of one 1-ton reduction',
        margin: 30
    },

    tooltip: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    
    // extends Highcharts options
    dataSource: dataSource,
    initialCategory: 2018,
    isMultiple: true,
    seriesCreator: createSeries,
    updateFunction: updateCharts,
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
        legend: 'Select year reduction is made (normal mitigation of about 2.7%)'
    },
    note: null
    
};