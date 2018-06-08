import createDropdown from './dropdown.js';
import createRadio from './radio.js';

export default function(options, i){
    console.log('in user options');
    if (options.userOptions){
        if (options.userOptions.type === 'dropdown') {
            createDropdown(options, i);
        } else {
            createRadio(options, i);
        }
    }
}