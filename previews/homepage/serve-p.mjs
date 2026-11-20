import {studies} from './study-navigation.mjs';
studies.push(['o', 'Shared moments'], ['p', 'Steady rhythm']);
process.env.VILLOW_PREVIEW_PORT = '4409';
await import('./serve.mjs');
