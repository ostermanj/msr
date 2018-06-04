const dataSource = require('../data/msr-data.json');
import { dataController } from '../dev-js/highchart-app.js';
//import { sharedMethods } from '../dev-js/shared-methods.js';

function createCharts(data){
    var ChartConfig = function(parentConfig, y){
        console.log(this, parentConfig, y);
        this.childData = y;
        this.series = [createChildSeries.call(this,y)];
        for ( var key in parentConfig ) { // take the the ownProperties of the parent config and make them
                                          // the own properties of the child. Highcharts config obj won't work
                                          // with prototypically inherited properties  
            if ( parentConfig.hasOwnProperty(key) ){
                this[key] = parentConfig[key];
            }
        }
        this.title.text = y.key;
    }
    ChartConfig.prototype = this;

    function createChildSeries(d){ 
        var valuesObj = d.values.find(m => m.key === this.initialCategory).values[0];
        return {
            type: this.chart.type,
            data: this.xAxis.categories.map(c => valuesObj[c])
        };
    }

    console.log(this.index);
    var parentContainer = document.getElementById('chart-' + this.index);
    this.children = [];
    data.forEach((y, i) => {
        var container = document.createElement('div');
        container.className = 'chart-container chart-container--small';
        container.id = 'chart-' + this.index + '-multiple-' + i;
        parentContainer.appendChild(container);
        var childConfig = new ChartConfig(this, y);
        this.children.push( new Highcharts.chart('chart-' + this.index + '-multiple-' + i, childConfig) );
    });

}

function createSeries(data){
    console.log(this, data);
    createCharts.call(this, data);

}

export default { 
    chart: {  
        height: 275,
        type: 'column'  
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        column: {
            colorByPoint: true
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
        categories: ['tnac', 'allowances', 'emissions', 'msr', 'cancelled'], 
        labels: {
            y: 40 
        }
    },
    yAxis: {
        max:2200, // TO DO: set programmatically
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
            text: 'million tons',
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
    dataSource: dataController.nestData(dataSource, ['year','mitigation']),
    initialCategory: 'normal',
    isMultiple: true,
    seriesCreator: createSeries,
    updateFunction: null,
    userOptions: null,
    note: null
};