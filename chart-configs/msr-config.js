const dataSource = require('../data/msr-data.json');
import { dataController } from '../dev-js/highchart-app.js';
import checkXAxisLabels from '../dev-js/checkXAxisLabels.js';
//import { sharedMethods } from '../dev-js/shared-methods.js';
function createSeries(data){
    console.log(this, data);
    createCharts.call(this, data, this.initialCategory);

}
function createCharts(data, scenario){
    console.log('in createCharts', scenario);
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
                    x:16,
                    align: 'left'
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
    var colorIndexes = {
        emissions: 0,
        tnac: 1,
        msr: 2,
        intake: 3,
        cancel: 5,
        cancelled: 4
    };
    var suppliedSeries = this.xAxis.categories.map((c, i) => {
        return ( !isUpdate ) ? { // ON UODATE ONLY UPDATE THE DATA OF THE SERIES, NOT THE OTHER PROPERTIES
                                 // OR THE SERIES WILL BE REPLACED, NOTANIMATED
            data: [
                [i, valuesObj[c]]
            ],
            name: c,
            colorIndex: colorIndexes[c]
        } : {
            data: [
                [i, valuesObj[c]]
            ]};
    });
    var calculatedSeries = ( !isUpdate ) ? {
        data: [
            [this.xAxis.categories.indexOf('emissions'), ( valuesObj.allowances && valuesObj.emissions && valuesObj.allowances - valuesObj.emissions > 0 ) ? valuesObj.allowances - valuesObj.emissions : null],
        ],
        name: 'Surplus allowances',
        className: 'surplus-allowances'
    } : {
        data: [
            [this.xAxis.categories.indexOf('emissions'), ( valuesObj.allowances && valuesObj.emissions && valuesObj.allowances - valuesObj.emissions > 0 ) ? valuesObj.allowances - valuesObj.emissions : null],
        ]};
    var extraIntakeSeries = ( !isUpdate ) ? {
        data: [
            {
                x: this.xAxis.categories.indexOf('intake'), 
                y: valuesObj.extra_intake,
            }
        ],
        className: 'extra-intake',
        name: 'Extra intake',
        colorIndex: 6
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



function updateCharts(scenario){
    this.children.forEach((chart, i, charts) => {
        chart.userOptions.currentCategory = scenario;
        console.log(chart, scenario);
        var series = createChildSeries.call(this, chart.userOptions.childData, scenario, true);
        chart.update({series});
        if ( chart.misplacedLabels ) {
            chart.renderTo.classList.add('in-transition');
            if ( i === charts.length - 1) {
                setTimeout(() => {
                    checkXAxisLabels.call(chart);
                }, 500); // need to recheck labels after update
            }
        }
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
                checkXAxisLabels.call(this); // IE and MSEdge do not properly place the labels
                                             // ignores x and y attribute on the SVG text nodes
                                             // this function checks bounding box of labels and 
                                             // corrects if the bbox indicates they are misplaced
        } else {
            setTimeout(() => {
                setRowColumnClasses.call(this); 
            }, 500);
        }
        
    }
    var timer;
    window.addEventListener('resize', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            setRowColumnClasses.call(this);    
        },500);
    });
    setRowColumnClasses.call(this);
}

var seriesNames = {
 'cancel':      'cancel',
 'intake':      'net intake',
 'emissions':   'emissions',   
 'tnac':        'TNAC',
 'msr':         'MSR', 
 'cancelled':   'cancelled'
};
export default { 
    chart: {  
        className: 'msr',
        height: 130,
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
        enabled: false,
       
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
            return `
                    <span style="display: flex; justify-content: space-between; align-items: flex-end;"><span style="${this.x === 'cancel' ? 'font-weight:bold' : ''}">Cancel: </span><span>${ values.cancel !== null ? Highcharts.numberFormat(values.cancel, 0, '.',',') : 'n.a.'}</span></span>
                    <span style="display: flex; justify-content: space-between; align-items: flex-end;"><span style="${this.x === 'intake' ? 'font-weight:bold' : ''}">Intake: </span><span>${ year > 2018 ? Highcharts.numberFormat(values.intake, 0, '.',',') : 'n.a.'}</span></span>
                    ${ ( values.extra_intake && this.x !== 'intake' ) ? '<span style="display: flex; justify-content: space-between; align-items: flex-end;"><span>Extra intake: </span><span>' + Highcharts.numberFormat(values.extra_intake, 0, '.',',') + '</span></span>' : ''}
                    ${ ( values.extra_intake && this.x === 'intake' ) ? '<span style="display: flex; justify-content: space-between; align-items: flex-end;"><span style="font-weight:bold;">Extra intake: </span><span>' + Highcharts.numberFormat(values.extra_intake, 0, '.',',') + '</span></span>' : ''}
                    <span style="display: flex; justify-content: space-between; align-items: flex-end;"><span style="${this.x === 'emissions' ? 'font-weight:bold;' : ''}">Cap: </span><span>${ values.allowances !== null ? Highcharts.numberFormat(values.allowances, 0, '.',',') : 'n.a.'}</span></span>
                    <span style="display: flex; justify-content: space-between; align-items: flex-end;"><span style="${this.x === 'emissions' ? 'font-weight:bold' : ''}">Emissions: </span><span>${Highcharts.numberFormat(values.emissions, 0, '.',',')}</span></span>
                    <span style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px dashed #aaa"><span style="${this.x === 'emissions' ? 'font-weight:bold' : ''}">Surplus: </span><span>${ values.allowances !== null ? Highcharts.numberFormat(values.allowances - values.emissions, 0, '.',',') : 'n.a.'}</span></span>
                    <span style="display: flex; justify-content: space-between; align-items: flex-end;"><span style="${this.x === 'tnac' ? 'font-weight:bold' : ''}">TNAC: </span><span>${Highcharts.numberFormat(values.tnac, 0, '.',',')}</span></span>
                    <span style="display: flex; justify-content: space-between; align-items: flex-end;"><span style="${this.x === 'msr' ? 'font-weight:bold' : ''}">MSR: </span><span>${ values.msr !== null ? Highcharts.numberFormat(values.msr, 0, '.',',') : 'n.a.'}</span></span>
                    <span style="display: flex; justify-content: space-between; align-items: flex-end;"><span style="${this.x === 'cancelled' ? 'font-weight:bold' : ''}">Total cancelled: </span><span>${ values.cancelled !== null ? Highcharts.numberFormat(values.cancelled, 0, '.',',') : 'n.a.'}</span></span>
                `;
        },
        //padding: 4
        positioner: function(){
            return {x:0,y:0};
        }
    },
    xAxis: {
        categories: [ 'emissions', 'intake', 'cancel', 'tnac','msr','cancelled'], 

        labels: {
            align: 'right', // need to specify for FF and perhaps other browsers
            y: 7,
            padding: -10,
            reserveSpace: false ,
            rotation: -65,
            formatter: function(){
                return seriesNames[this.value];
            }


        },
        tickPositions: [0,1,2,3,4,5],
        tickLength: 0,
        plotBands: [
           {
                from: 1,
                to: 5.5,
                zIndex:1
            }
        ],
        plotLines: [{
            value: 2.5,
            label: {
                text: 'flow',
                className: 'stock-flow',
                x:12,
                y:12,
                align: 'right',
            },
            className: 'shortdot',
            zIndex:3
        },
        {
            value: 2.5,
            label: {
                text: 'stock',
                className: 'stock-flow',
                x:18,
                y:12,
                align: 'left',
            },
            className: 'shortdot flow',
            zIndex:3
        }]
    },
    yAxis: {
        max:4200, // TO DO: set programmatically,
        min: -200,
        gridZIndex:2,
        reversedStacks: false,
        endOnTick:false,
        startOnTick: false,
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
        tickPositions: [0,1000,2000,3000] 
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
    initialCategory: 'Normal',
    isMultiple: true,
    seriesCreator: createSeries,
    updateFunction: updateCharts,
    userOptions: {
        type: 'dropdown',
        options: [
            {key: 'Normal', value: 'Normal (about 2.7%)'},
            {key: '-0.50%', value: '0.5%'},
            {key: '-1%', value: '1.0%'},
            {key: '-1.50%', value: '1.5%'},
            {key: '-2%', value: '2.0%'},
            {key: '-2.50%', value: '2.5%'},
            {key: '-3%', value: '3.0%'},
            {key: '-3.50%', value: '3.5%'},
            {key: '-4%', value: '4.0%'},
            {key: '-4.50%', value: '4.5%'},
            {key: '-5%', value: '5.0%'}
        ],
        legend: 'Select mitigation (annual decrease in carbon emissions)'
    },
    note: null
};