import GAEventHandler from '../dev-js/ga-event-handler.js';
export default function(options, j){
    var container = document.getElementById('chart-' + j);
    if ( options.userOptions.legend ){
        let label = document.createElement('label');
        label.setAttribute('for', 'chart-' + j + '-dropdown');
        label.innerHTML = options.userOptions.legend;
        container.insertAdjacentHTML('beforebegin', label.outerHTML);
    }
    var dropdown = document.createElement('select');
    dropdown.setAttribute('id', 'chart-' + j + '-dropdown');
    options.userOptions.options.forEach((s,i) => {
        var option = document.createElement('option');
        option.setAttribute('value', s.key);
        option.innerHTML = s.value;
        dropdown.appendChild(option);
    });
    container.insertAdjacentHTML('beforebegin', dropdown.outerHTML);
    var rendered = document.getElementById('chart-' + j + '-dropdown');
    
    rendered.onchange = function(){
        console.log(rendered.value);
        GAEventHandler('selectUserOption', this.value + '-' + options.title.text);
        options.updateFunction.call(options,rendered.value);
    };
};