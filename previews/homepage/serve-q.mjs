import {studies} from './study-navigation.mjs';
studies.push(['o', 'Shared moments'], ['p', 'Steady rhythm'], ['q', 'Calmer details']);
process.env.VILLOW_PREVIEW_PORT = '4410';
await import('./serve.mjs');
