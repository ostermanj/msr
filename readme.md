# EU's Market Stability Reserve (carbon market) 

This is a set of charts to visualize the effect over time of the EU's Market Stability Reserve (carbon market) under different, user-selected carbon mitigation scenarios. The first is a small multiples series of column charts showing how emissions allowances, emissions, and other factors change over time under different scenarios. The second in a Sankey diagram showing (a) what happens on average to a 1-ton reduction in emissions as it tracks through the MSR depending on the year it was made; the second pane (b) doe sthe same but for the marginal 1-ton reduction.

## About the code

The graphs are all based on [Highcharts](https://api.highcharts.com/highcharts/) modified to create a small-multiples-type dashboard.

## To edit

1. [Install npm](https://www.npmjs.com/get-npm)
1. Clone the repository.
1. Run `npm install` in the directory of your repository to install Grunt and other dev dependencies
1. Start a dev server such as python -m SimpleHTTPServer
1. Run `grunt watch` to convert the SCSS into CSS, lint the HTML and JavaScript files when they are edited, and transpile the ES6 index.js file into pre-ES6 compatible code.

**Note that editable dev files are in /dev-css and /dev-js folders, respectively.** Files in /css and /js folders are emitted by the build process and should not be edited directly.

## To deploy

1. Run `grunt postcss` to automatically add any necesary vendor prefixes to the css and emit a build file to the /css folder. Run `grunt cssmin` to minify the .css file to .min.css. Run `grunt uglify` to minimize the javascript.
1. The live code exists inline in the body of a page on RFF's site
1. To edit the live page, cut and paste css/styles.min.css, js/index.js and the relevant bits of index.php into the right places in the content body. Existing page content is commented to make this clear.