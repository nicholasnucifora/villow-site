import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

// This deliberately edits source ranges, rather than serialising HTML. The
// surviving product sections and current cinema keep their exact bytes.
const sourceURL=new URL('../a-source.html',import.meta.url);
const write=process.argv.slice(2).includes('--write');
const args=process.argv.slice(2);
if(args.includes('--help')){
 console.log('node previews/homepage/qa/trim-a-markup.mjs [--write]\nDefault: report the proposed trim without writing a-source.html.');
 process.exit(0);
}
if(args.some(arg=>arg!=='--write'))throw new Error('Only --write is supported.');
const voidElements=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const rawTextElements=new Set(['script','style','textarea','title']);

function tagEnd(html,start){
 let quote='';
 for(let at=start;at<html.length;at++){
  const char=html[at];
  if(quote){if(char===quote)quote='';}
  else if(char==='"'||char==="'")quote=char;
  else if(char==='>')return at+1;
 }
 throw new Error(`Unclosed tag at ${start}`);
}
function attributes(openTag){
 const attrs=new Map();
 const head=/^<\s*[^\s/>]+/.exec(openTag);
 let at=head?.[0].length||0;
 while(at<openTag.length){
  while(/\s/.test(openTag[at]||''))at++;
  if(at>=openTag.length||openTag[at]==='>'||openTag[at]==='/')break;
  const nameStart=at;
  while(at<openTag.length&&!/[\s=/>]/.test(openTag[at]))at++;
  const name=openTag.slice(nameStart,at).toLowerCase();
  if(!name)throw new Error(`Malformed attribute in ${openTag.slice(0,90)}`);
  while(/\s/.test(openTag[at]||''))at++;
  let value='';
  if(openTag[at]==='='){
   at++;while(/\s/.test(openTag[at]||''))at++;
   const quote=openTag[at]==='"'||openTag[at]==="'"?openTag[at++]:'';
   const valueStart=at;
   if(quote){while(at<openTag.length&&openTag[at]!==quote)at++;value=openTag.slice(valueStart,at);at++;}
   else{while(at<openTag.length&&!/[\s>]/.test(openTag[at]))at++;value=openTag.slice(valueStart,at);}
  }
  attrs.set(name,value);
 }
 return attrs;
}
function parse(html){
 const nodes=[],stack=[];
 let at=0;
 while(at<html.length){
  const start=html.indexOf('<',at);if(start<0)break;
  if(html.startsWith('<!--',start)){const end=html.indexOf('-->',start+4);if(end<0)throw new Error('Unclosed HTML comment');at=end+3;continue;}
  if(html.startsWith('<![CDATA[',start)){const end=html.indexOf(']]>',start+9);if(end<0)throw new Error('Unclosed CDATA');at=end+3;continue;}
  if(/^<!|^<\?/.test(html.slice(start,start+2))){at=tagEnd(html,start);continue;}
  const match=/^<\s*(\/?)\s*([A-Za-z][A-Za-z0-9:-]*)\b/.exec(html.slice(start));
  if(!match){at=start+1;continue;}
  const end=tagEnd(html,start),tag=match[2].toLowerCase();
  if(match[1]){
   const current=stack.pop();
   if(!current||current.tag!==tag)throw new Error(`Unbalanced </${tag}> at ${start}; expected ${current?.tag||'no open tag'}`);
   current.closeStart=start;current.end=end;at=end;continue;
  }
  const openTag=html.slice(start,end),parent=stack.at(-1)||null;
  const node={tag,start,openEnd:end,closeStart:end,end,attrs:attributes(openTag),parent,children:[]};
  parent?.children.push(node);nodes.push(node);
  if(!voidElements.has(tag)&&! /\/\s*>$/.test(openTag)){
   stack.push(node);
   if(rawTextElements.has(tag)){
    const close=new RegExp(`<\\/\\s*${tag}\\s*>`,'ig');close.lastIndex=end;
    const closeMatch=close.exec(html);if(!closeMatch)throw new Error(`Unclosed raw-text ${tag}`);
    at=closeMatch.index;continue;
   }
  }
  at=end;
 }
 if(stack.length)throw new Error(`Unclosed elements: ${stack.map(node=>node.tag).join(', ')}`);
 return nodes;
}
const inside=(node,ancestor)=>node.start>=ancestor.start&&node.end<=ancestor.end;
const hasAncestor=(node,predicate)=>{for(let current=node.parent;current;current=current.parent)if(predicate(current))return true;return false;};
const original=await readFile(sourceURL,'utf8');
const nodes=parse(original);
const byAttr=(name,value)=>nodes.filter(node=>node.attrs.has(name)&&(value===undefined||node.attrs.get(name)===value));
const current=byAttr('data-ip-view-panel','cinema-cloud-cat');
if(current.length!==1)throw new Error(`Expected one current Cloud cinema panel; found ${current.length}`);
const categories={
 oldStackHero:byAttr('data-i-stack-hero'),
 oldHeroPanels:byAttr('data-ip-view-panel').filter(node=>node.attrs.get('data-ip-view-panel')!=='cinema-cloud-cat'),
 oldStackLibrary:byAttr('data-i-stack-library'),
 nonSagePictures:byAttr('data-i-art-picture').filter(node=>node.attrs.get('data-i-art-picture')!=='i15'&&hasAncestor(node,ancestor=>ancestor.attrs.has('data-i-artwork'))),
};
const candidates=Object.values(categories).flat();
const removals=candidates.filter(node=>!candidates.some(other=>other!==node&&inside(node,other)));
const retainedArtworks=byAttr('data-i-artwork').filter(node=>!removals.some(removal=>inside(node,removal)));
const patches=removals.map(node=>({start:node.start,end:node.end,replacement:''}));
for(const artwork of retainedArtworks){
 const sage=nodes.filter(node=>node.attrs.get('data-i-art-picture')==='i15'&&inside(node,artwork));
 if(sage.length!==1)throw new Error('Each retained artwork must contain exactly one Sage picture.');
 const opening=original.slice(artwork.start,artwork.openEnd);
 const fixed=artwork.attrs.has('data-active-art')?opening.replace(/\bdata-active-art\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i,'data-active-art="i15"'):opening.replace(/>$/,' data-active-art="i15">');
 if(fixed!==opening)patches.push({start:artwork.start,end:artwork.openEnd,replacement:fixed});
 const sageOpening=original.slice(sage[0].start,sage[0].openEnd);
 if(sage[0].attrs.has('hidden'))patches.push({start:sage[0].start,end:sage[0].openEnd,replacement:sageOpening.replace(/\s+hidden(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/i,'')});
}
let trimmed=original;
for(const patch of patches.sort((a,b)=>b.start-a.start))trimmed=trimmed.slice(0,patch.start)+patch.replacement+trimmed.slice(patch.end);
const after=parse(trimmed);
const afterPanel=after.filter(node=>node.attrs.has('data-ip-view-panel'));
if(afterPanel.length!==1||afterPanel[0].attrs.get('data-ip-view-panel')!=='cinema-cloud-cat')throw new Error('Unexpected surviving hero panel.');
const currentBytes=original.slice(current[0].start,current[0].end);
if(trimmed.slice(afterPanel[0].start,afterPanel[0].end)!==currentBytes)throw new Error('Current Cloud cinema markup changed.');
if(after.some(node=>node.attrs.has('data-i-stack-hero')||node.attrs.has('data-i-stack-library')))throw new Error('A legacy stack remains.');
for(const art of after.filter(node=>node.attrs.has('data-i-artwork'))){
 const pictures=after.filter(node=>node.attrs.has('data-i-art-picture')&&inside(node,art));
 if(pictures.length!==1||pictures[0].attrs.get('data-i-art-picture')!=='i15'||pictures[0].attrs.has('hidden'))throw new Error('Retained artwork is not fixed to visible Sage.');
}
const preservedIds=['i-title','feed-to-watch-later','o-limits','o-viewing','across-devices','watch-with-people','good-company','watch-together','beyond-watching','help-shape-web'];
for(const id of preservedIds){
 const before=nodes.find(node=>node.attrs.get('id')===id),result=after.find(node=>node.attrs.get('id')===id);
 if(!before||!result||original.slice(before.start,before.end)!==trimmed.slice(result.start,result.end))throw new Error(`Preservation failed: ${id}`);
}
if(write&&trimmed!==original)await writeFile(sourceURL,trimmed);
console.log(JSON.stringify({mode:write?'written':'dry-run',source:fileURLToPath(sourceURL),bytesBefore:Buffer.byteLength(original),bytesAfter:Buffer.byteLength(trimmed),removed:Object.fromEntries(Object.entries(categories).map(([key,value])=>[key,value.filter(node=>key!=='nonSagePictures'||!removals.some(removal=>removal!==node&&inside(node,removal))).length])),topLevelRemovedRanges:removals.length,currentCinemaByteExact:true,preservedIds,changes:trimmed!==original},null,2));
