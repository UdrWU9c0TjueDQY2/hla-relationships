const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const source=fs.readFileSync(process.argv[2]||'src/unfight/one-topic-conversation-invitation/app.js','utf8');
const created=[];
function node(value=''){
  const n={value,textContent:'',className:'',disabled:false,children:[],listeners:{},focused:false,clicked:false,
    addEventListener(type,fn){this.listeners[type]=fn;},
    append(...items){this.children.push(...items);},
    after(item){this.afterNode=item;},
    remove(){this.removed=true;},
    focus(){this.focused=true;},
    click(){this.clicked=true;},
    fire(type){return this.listeners[type]?.();}
  };
  created.push(n);
  return n;
}
const els={topic:node(),when:node(),ask:node(),draft:node(),result:node(),build:node(),sample:node(),reset:node()};
let copied='',blobParts=null,revoked='';
class BlobMock{constructor(parts,options){this.parts=parts;this.options=options;blobParts=parts;}}
const URLMock={createObjectURL(){return 'blob:local-draft';},revokeObjectURL(url){revoked=url;}};
const document={getElementById:id=>els[id],createElement:()=>node(),body:{append(n){this.last=n;}}};
const navigator={clipboard:{async writeText(value){copied=value;}}};
vm.runInNewContext(source,{document,navigator,Blob:BlobMock,URL:URLMock,setTimeout:fn=>fn()});
(async()=>{
const buttons=created.filter(n=>n.textContent==='Copy current draft'||n.textContent==='Download current draft');
const copy=buttons.find(n=>n.textContent.startsWith('Copy'));
const download=buttons.find(n=>n.textContent.startsWith('Download'));
assert(copy&&download);
assert(copy.disabled&&download.disabled);
els.topic.value='weekend errands';els.when.value='Saturday morning';els.ask.value='what feels manageable';
els.build.onclick();
assert(!copy.disabled&&!download.disabled);
const exact=els.draft.value;
assert.match(exact,/Would you be open/);
await copy.onclick();
assert.equal(copied,exact);
assert.match(els.result.textContent,/Nothing was sent or stored/);
els.draft.value=exact.replace('Saturday morning','Sunday afternoon');
els.draft.fire('input');
assert(!copy.disabled&&!download.disabled);
assert.equal(els.result.textContent,'');
await copy.onclick();
assert.equal(copied,els.draft.value);
download.onclick();
assert.deepEqual(blobParts,[els.draft.value+'\n']);
assert.equal(document.body.last.download,'one-topic-conversation-invitation.txt');
assert(document.body.last.clicked&&document.body.last.removed);
assert.equal(revoked,'blob:local-draft');
els.reset.onclick();
const confirm=created.find(n=>n.textContent==='Clear my work');
assert(confirm);
confirm.onclick();
assert.equal(els.draft.value,'');
assert(copy.disabled&&download.disabled);
assert.equal(els.topic.value,'');
assert(!/fetch\(|XMLHttpRequest|localStorage|sessionStorage/.test(source));
const html=fs.readFileSync('src/unfight/one-topic-conversation-invitation/index.html','utf8');
assert(html.includes('id6794421070'));
assert(html.includes('never sends a message'));
assert(html.includes('does not assess safety or replace professional support'));
console.log('UnFight invitation export checks passed: exact copy, local download, edit lifecycle, guarded reset, privacy boundaries');
})().catch(error=>{console.error(error);process.exit(1);});
