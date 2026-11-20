import {studies} from './study-navigation.mjs';
studies.push(['o', 'Shared moments']);
process.env.VILLOW_PREVIEW_PORT = '4408';
await import('./serve.mjs');
