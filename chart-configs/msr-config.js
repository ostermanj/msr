const dataSource = require('../data/msr-data.json');
import { dataController } from '../dev-js/highchart-app.js';
//import { sharedMethods } from '../dev-js/shared-methods.js';

function createCharts(data, scenario){
    var ChartConfig = function(parentConfig, y, i){
        console.log(this, parentConfig, y);
        this.currentCategory = this.initialCategory;
        this.indexInSet= i;
        this.childData = y;
        this.series = createChildSeries.call(this, y, scenario);
        for ( var key in parentConfig ) { // take the the ownProperties of the parent config and make them
                                          // the own properties of the child. Highcharts config obj won't work
                                          // with prototypically inherited properties  
            if ( parentConfig.hasOwnProperty(key) ){
                this[key] = parentConfig[key];
            }
        }
        this.title.text = y.key;
        this.yAxis.plotLines = [
            {
                value: this.childData.values.find(m => m.key === scenario).values[0].allowances,
                label: {
                    className: 'cap',
                    text: 'cap',
                    y:-10,
                    x:13,
                    align: 'center'
                }
            }
        ];
    }
    ChartConfig.prototype = this;   

    console.log(this.index);
    var parentContainer = document.getElementById('chart-' + this.index);
    this.setLength = data.length;
    this.children = [];
    data.forEach((y, i, array) => {
        var container = document.createElement('div');
        container.className = 'chart-container chart-container--small';
        container.id = 'chart-' + this.index + '-multiple-' + i;
        parentContainer.appendChild(container);
        var childConfig = new ChartConfig(this, y, i);
        this.children.push( new Highcharts.chart('chart-' + this.index + '-multiple-' + i, childConfig) );
    });

}

function createChildSeries(d, scenario, isUpdate){ 
    console.log(this);

    var valuesObj = d.values.find(m => m.key === scenario).values[0];
    var suppliedSeries = this.xAxis.categories.map((c, i) => {
        return ( !isUpdate ) ? { // ON UODATE ONLY UPDATE THE DATA OF THE SERIES, NOT THE OTHER PROPERTIES
                                 // OR THE SERIES WILL BE REPLACED, NOTANIMATED
            data: [
                [i, valuesObj[c]]
            ],
            name: c
        } : {
            data: [
                [i, valuesObj[c]]
            ]};
    });
    var calculatedSeries = ( !isUpdate ) ? {
        data: [
            [this.xAxis.categories.indexOf('emissions'), ( valuesObj.allowances && valuesObj.emissions ) ? valuesObj.allowances - valuesObj.emissions : null],
        ],
        name: 'Surplus allowances',
        className: 'surplus-allowances'
    } : {
        data: [
            [this.xAxis.categories.indexOf('emissions'), ( valuesObj.allowances && valuesObj.emissions ) ? valuesObj.allowances - valuesObj.emissions : null],
        ]};
    var extraIntakeSeries = ( !isUpdate ) ? {
        data: [
            {
                x: this.xAxis.categories.indexOf('intake'), 
                y: valuesObj.extra_intake,
            }
        ],
        className: 'extra-intake',
        name: 'Extra intake'
    } : {
        data: [
            {
                x: this.xAxis.categories.indexOf('intake'), 
                y: valuesObj.extra_intake,
            }
        ]};
    suppliedSeries.push(calculatedSeries, extraIntakeSeries);
    return suppliedSeries;
}

function createSeries(data){
    console.log(this, data);
    createCharts.call(this, data, this.initialCategory);

}

function updateCharts(scenario){
    this.children.forEach(chart => {
        chart.userOptions.currentCategory = scenario;
        console.log(chart, scenario);
        var series = createChildSeries.call(this, chart.userOptions.childData, scenario, true);
        chart.update({series});
    });
}

function setPositionalOptions(){
    function setRowColumnClasses(){
        console.log(this.userOptions.setLength, this.userOptions.children.length);
        if ( this.userOptions.setLength === this.userOptions.children.length ) {

            console.log('resized');
            var chartPositions = this.userOptions.children.map(c => {
                return {
                    left: c.renderTo.offsetLeft,
                    top: c.renderTo.offsetTop
                };
            });
            var columns = chartPositions.reduce((acc,cur) => {
                if ( acc.indexOf(cur.left) === -1 ){
                    acc.push(cur.left);
                }
                return acc;
            },[]);
            var rows = chartPositions.reduce((acc,cur) => {
                if ( acc.indexOf(cur.top) === -1 ){
                    acc.push(cur.top);
                }
                return acc;
            },[]);
            this.userOptions.children.forEach((chart, i, array) => {
                console.log(i);
                chart.setClassName('');
                var indexInRow = i % columns.length;
                var indexInCol = Math.floor( i / columns.length);
                if ( indexInRow === columns.length - 1 || i === array.length - 1){
                    console.log('index: ' + i, 'length: ' + array.length);
                    chart.container.classList.add('last-in-row');
                }
                if ( indexInRow === 0 ){
                    chart.container.classList.add('first-in-row');
                }
                if ( indexInCol === rows.length - 1 || i + columns.length > array.length - 1 ) {
                    chart.container.classList.add('last-in-column');
                }
                if ( indexInCol === 0 ){
                    chart.container.classList.add('first-in-column');
                }
            }); 
        } else {
            setTimeout(() => {
                setRowColumnClasses.call(this); 
            }, 100);
        }
        
    }
    var timer;
    window.addEventListener('resize', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            setRowColumnClasses.call(this);    
        },100);
    });
    setRowColumnClasses.call(this);
}

export default { 
    chart: {  
        
        height: 120,
        type: 'column',
        marginRight: 0,
        /*events: {
            load: function(){
                console.log(this);
                if ( this.userOptions.indexInSet === this.userOptions.setLength - 1 ){ // ie is the last chart in the multiple set
                    setPositionalOptions.call(this);
                }
            }
        }*/
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        
        column: {
         //   colorByPoint: true
            stacking: 'normal',
            //grouping: false
        }   
    },  
    subtitle: {
        text: null
    },           
    title: {
        text: null,
        margin: 5,
        align: 'center',
        x: 5,
        widthAdjust:0
    },
    tooltip: {
        valueDecimals: 0,
        valueSuffix: ' million tons',
        useHTML: true,
        shape: 'square',
        formatter: function(){
            console.log(this);
            var scenario = this.series.chart.userOptions.currentCategory;
            var values = this.series.chart.userOptions.childData.values.find(obj => obj.key === scenario).values[0];
            console.log(values);
            var year = this.series.chart.userOptions.childData.key;
            return `<span style="display: flex; justify-content: space-between;"><span style="${this.x === 'msr' ? 'font-weight:bold' : ''}">MSR stock: </span><span>${ values.msr !== null ? Highcharts.numberFormat(values.msr, 0, '.',',') : 'n.a.'}</span></span>
                    <span style="display: flex; justify-content: space-between;"><span style="${this.x === 'tnac' ? 'font-weight:bold' : ''}">TNAC: </span><span>${Highcharts.numberFormat(values.tnac, 0, '.',',')}</span></span>
                    <span style="display: flex; justify-content: space-between;"><span style="${this.x === 'emissions' ? 'font-weight:bold;' : ''}">Cap: </span><span>${ values.allowances !== null ? Highcharts.numberFormat(values.allowances, 0, '.',',') : 'n.a.'}</span></span>
                    <span style="display: flex; justify-content: space-between;"><span style="${this.x === 'emissions' ? 'font-weight:bold' : ''}">Emiss.: </span><span>${Highcharts.numberFormat(values.emissions, 0, '.',',')}</span></span>
                    <span style="display: flex; justify-content: space-between;"><span style="${this.x === 'emissions' ? 'font-weight:bold' : ''}">Surplus: </span><span>${ values.allowances !== null ? Highcharts.numberFormat(values.allowances - values.emissions, 0, '.',',') : 'n.a.'}</span></span>
                    <span style="display: flex; justify-content: space-between;"><span style="${this.x === 'intake' ? 'font-weight:bold' : ''}">MSR intake: </span><span>${ year > 2018 ? Highcharts.numberFormat(values.intake, 0, '.',',') : 'n.a.'}</span></span>
                    ${ ( values.extra_intake && this.x !== 'intake' ) ? '<span style="display: flex; justify-content: space-between;"><span>Extra intake: </span><span>' + Highcharts.numberFormat(values.extra_intake, 0, '.',',') + '</span></span>' : ''}
                    ${ ( values.extra_intake && this.x === 'intake' ) ? '<span style="display: flex; justify-content: space-between;"><span style="font-weight:bold;">Extra intake: </span><span>' + Highcharts.numberFormat(values.extra_intake, 0, '.',',') + '</span></span>' : ''}
                    <span style="display: flex; justify-content: space-between;"><span style="${this.x === 'cancelled' ? 'font-weight:bold' : ''}">Cancelled: </span><span>${ values.cancelled !== null ? Highcharts.numberFormat(values.cancelled, 0, '.',',') : 'n.a.'}</span></span>`;
        },
        //padding: 4
        positioner: function(){
            return {x:0,y:0};
        }
    },
    xAxis: {
        categories: [ 'msr', 'tnac', 'emissions', 'intake', 'cancelled'], 

        labels: {
            y: 7,
            padding: -5,
            reserveSpace: false ,
            autoRotation: [0,-45, -65, -75]
        },
        tickLength: 0,
        plotBands: [
            {
                from: -0.5,
                to: 1.5,
                zIndex:1
            },{
                from: 2.5,
                to: 4.5,
                zIndex:1
            }
        ],
        plotLines: [{
            value: 1.5,
            label: {
                text: 'stocks',
                className: 'stock-flow',
                x:8,
                y:8,
                align: 'right',
            },
            className: 'shortdot',
            zIndex:3
        },
        {
            value: 1.5,
            label: {
                text: 'flows',
                className: 'stock-flow',
                x:18,
                y:8,
                align: 'left',
            },
            className: 'shortdot flow',
            zIndex:3
        }]
    },
    yAxis: {
        max:2875, // TO DO: set programmatically,
        min: 0,
        gridZIndex:2,
        reversedStacks: false,
        endOnTick:false,
        labels: {
            formatter: function(){
                return this.axis.defaultLabelFormatter.call(this);
            },
            x:-2
        },
        title: {
            text: 'million tons',
            align:'high',
            reserveSpace: false,    
            rotation: 0,
            margin:0,
            y: -2,
           // offset: -60,
            x: -10
        },
        tickInterval: 1000 
    },
    /* extends highcharts */
    additionalOnload: function(){
        console.log(this);
        console.log(this.userOptions.indexInSet, this.userOptions.setLength);
        if ( this.userOptions.indexInSet === this.userOptions.setLength - 1 ){ // ie is the last chart in the multiple set
            setPositionalOptions.call(this);
        }
    },
    dataSource: dataController.nestData(dataSource, ['year','mitigation']),
    initialCategory: 'normal',
    isMultiple: true,
    seriesCreator: createSeries,
    updateFunction: updateCharts,
    userOptions: {
        type: 'radio',
        options: [
            {key: 'slow', value: 'Slow'},
            {key: 'normal', value: 'Normal'},
            {key: 'fast', value: 'Fast'}
        ],
        legend: 'Mitigation'
    },
    note: null
};