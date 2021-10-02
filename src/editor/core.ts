import './styles/core.scss';
import './shared/util';
import './shared/registrator';

// Select2 default settings
$.fn.select2.defaults.set('theme', 'default');
$.fn.select2.defaults.set('width', '100%');
$.fn.select2.defaults.set('dropdownCssClass', 'node-red-contrib-z2m-select2');
$.fn.select2.defaults.set('dropdownParent', '#red-ui-editor');
