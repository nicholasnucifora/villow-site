import sharp from 'sharp';
import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
// Crops of native UI captures only: no controls, labels or values are redrawn.
const captures=[
 {key:'title',source:'./product-capture/native-filters.png',crop:{left:640,top:304,width:480,height:258},note:'Actual ChannelFilterEditor title-filter column. Fictional exclude phrase: reaction. Adjacent unfinished ranking control excluded.'},
 {key:'title-controls',source:'./product-capture/native-filters.png',crop:{left:640,top:386,width:480,height:176},note:'Native title-filter modes, phrase input and excluded phrase; closer crop for the annotated treatment.'},
 {key:'duration',source:'./product-capture/native-filters.png',crop:{left:160,top:304,width:480,height:155},note:'Actual ChannelFilterEditor video-length control, example 2–20 minutes. Ends before unfinished ranking control.'},
 {key:'delivery',source:'./product-capture/native-delivery.png',crop:{left:160,top:150,width:482,height:136},note:'Actual ChannelFilterEditor Daily/Scheduled delivery choice. Shared schedule, not an individual channel calendar.'},
 {key:'limits',source:'./product-capture/native-limits.png',crop:{left:120,top:32,width:330,height:255},note:'Actual UsageLimitEditorPanel excerpt: default and first two days. Fictional values.'},
 {key:'reflection',source:'./product-capture/native-verdicts.png',crop:{left:208,top:512,width:592,height:224},note:'Fresh current RateRecentVideos native question, Undo and three verdicts in light theme. No old screenshot or redrawn controls. Optional reflection, not a ratings statistic.'},
 {key:'title-mobile',source:'./product-capture/native-mobile-filters-title.png',crop:{left:48,top:207,width:316,height:300},note:'Same native title-filter component in its actual responsive phone layout.'},
 {key:'title-controls-mobile',source:'./product-capture/native-mobile-filters-title.png',crop:{left:48,top:287,width:316,height:220},note:'Native responsive title-filter modes, phrase input and excluded phrase.'},
 {key:'duration-mobile',source:'./product-capture/native-mobile-filters-top.png',crop:{left:48,top:329,width:316,height:154},note:'Native responsive duration control, before the unfinished performance-ranking section.'},
 {key:'delivery-mobile',source:'./product-capture/native-mobile-delivery.png',crop:{left:48,top:145,width:294,height:122},note:'Native responsive Daily/Scheduled control.'},
 {key:'reflection-mobile',source:'./product-capture/native-compact-verdicts.png',crop:{left:136,top:366,width:336,height:240},note:'Same native desktop reflection component in a narrower container, with original fonts and controls, for a readable homepage excerpt on small screens. Not presented as the app mobile layout.'},
];
for(const item of captures){
 const source=item.source.startsWith('.')?fileURLToPath(new URL(item.source,import.meta.url)):item.source;
 const output=new URL('./assets/i-product-'+item.key+'.webp',import.meta.url);
 await sharp(source).extract(item.crop).webp({lossless:true}).toFile(fileURLToPath(output));
}
await writeFile(new URL('./product-capture/crops.json',import.meta.url),JSON.stringify(captures,null,2)+'\n');
console.log('Prepared '+captures.length+' truthful product-detail crops.');
