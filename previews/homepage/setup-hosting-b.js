import {previewPageURL} from './preview-pages.js';
const path = new URLSearchParams(location.search).get('path');
if (['web', 'both', 'all'].includes(path)) {
 document.querySelector('[data-setup-return]').href = `${previewPageURL('setup-instructions')}?path=${path}#create`;
}
