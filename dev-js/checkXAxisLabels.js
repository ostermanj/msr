export default function(){   // IE and MSEdge do not properly place the labels
                             // ignores x and y attribute on the SVG text nodes
                             // this function checks bounding box of labels and 
                             // corrects if the bbox indicates they are misplaced
                             // this works with no browser sniffing
    console.log('HERE!', this);
    var bbox = this.xAxis[0].labelGroup.element.getBBox();
    console.log(bbox);
    if ( bbox.x < -50 || this.misplacedLabels ){ // x less than -50 indictes that bbox of the labels is very much outside the containing element
        this.userOptions.children.forEach(chart => {
            chart.misplacedLabels = true;
            chart.xAxis[0].labelGroup.element.childNodes.forEach(node => {
                var x = node.getAttribute('x'); // get x and y attributes andpplay them instead to a transform
                var y = node.getAttribute('y');
                var transform = node.getAttribute('transform');
                var regex = /rotate\(.*?\)/;
                var rotate = transform.match(regex); // translate needs to come after the rotation. find existing rotate
                                                     // instruction and add to it
                node.removeAttribute('x');
                node.removeAttribute('y');
                node.setAttribute('transform', `${rotate} translate(${x - 37}, ${y})`);
            });
            chart.renderTo.classList.remove('in-transition'); // labels are re-placed on chart update and they have
                                                              // to be corrected again. in-transition class hides them
                                                              // during the transition
        });
    }
}