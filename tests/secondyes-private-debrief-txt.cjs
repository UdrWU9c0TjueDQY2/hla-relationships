const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(__dirname+'/../src/secondyes/should-i-go-on-a-second-date-debrief/index.html','utf8');
function node(){return{disabled:false,hidden:false,value:'',textContent:'',handlers:{},focusCount:0,selectCount:0,addEventListener(k,f){this.handlers[k]=f},focus(){this.focusCount++},select(){this.selectCount++},click(){this.clickCount=(this.clickCount||0)+1},remove(){this.removed=true}}}
const ids=['debrief-form','summary','copy-note','save-note','copy-status','save-fallback','fallback-note'];
const els=Object.fromEntries(ids.map(id=>[id,node()]));
els['copy-note'].disabled=true;els['save-note'].disabled=true;els['save-fallback'].hidden=true;
els['debrief-form'].values={interest:'yes',comfort:'comfortable',energy:'lighter',hesitation:'none',reaction:'glad',pace:'same'};
els['debrief-form'].elements={interest:[node()]};
let appended,downloaded,blobText='',copied='';
const context={
  document:{getElementById:id=>els[id],createElement:()=>{downloaded=node();return downloaded},body:{appendChild:n=>{appended=n}},createRange:()=>({selectNodeContents(){}})},
  navigator:{clipboard:{writeText:async text=>{copied=text}}},
  FormData:class{constructor(form){this.form=form}entries(){return Object.entries(this.form.values)}},
  Blob:class{constructor(parts,opts){blobText=parts.join('');this.type=opts.type}},
  URL:{createObjectURL:blob=>{assert.equal(blob.type,'text/plain;charset=utf-8');return'blob:test'},revokeObjectURL:url=>assert.equal(url,'blob:test')},
  setTimeout:fn=>fn(),
  getSelection:()=>({removeAllRanges(){},addRange(){}})
};
context.window=context;
vm.createContext(context);vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],context);

els['debrief-form'].handlers.submit({preventDefault(){}});
assert.match(els.summary.textContent,/INTEREST LOOKS CLEAR/);
assert.equal(els['copy-note'].disabled,false);assert.equal(els['save-note'].disabled,false);
els['save-note'].handlers.click();
assert.equal(appended,downloaded);assert.equal(downloaded.download,'secondyes-private-debrief.txt');assert.equal(downloaded.clickCount,1);assert(downloaded.removed);
assert.match(blobText,/PRIVATE AFTER-DATE DEBRIEF/);assert.match(blobText,/does not assess another person, create consent or obligation, or schedule a date/);assert.match(blobText,/Nothing in this note was transmitted/);
console.log('PASS local text download, filename and consent boundary');

els['debrief-form'].handlers.change();
assert.equal(els['copy-note'].disabled,true);assert.equal(els['save-note'].disabled,true);assert.equal(els['save-fallback'].hidden,true);assert.match(els.summary.textContent,/Answers changed/);
console.log('PASS changed answers invalidate stale output');

els['debrief-form'].values={interest:'maybe',comfort:'pressured',energy:'drained',hesitation:'concern',reaction:'curious',pace:'pause'};
els['debrief-form'].handlers.submit({preventDefault(){}});context.URL.createObjectURL=undefined;els['save-note'].handlers.click();
assert.equal(els['save-fallback'].hidden,false);assert.match(els['fallback-note'].value,/COMFORT COMES BEFORE/);assert.match(els['fallback-note'].value,/does not assess another person/);assert.equal(els['fallback-note'].selectCount,1);assert.match(els['copy-status'].textContent,/selected for manual copy/);
console.log('PASS complete manual fallback and safety-case result');

els['debrief-form'].handlers.reset();
assert.equal(els['copy-note'].disabled,true);assert.equal(els['save-note'].disabled,true);assert.equal(els['save-fallback'].hidden,true);assert.match(els.summary.textContent,/Choose the six answers/);
assert.equal(els['debrief-form'].elements.interest[0].focusCount,1);
console.log('PASS reset clears export state and restores keyboard focus');

assert(!/fetch\(|localStorage|sessionStorage|XMLHttpRequest/.test(html));
assert.equal((html.match(/href="https:\/\/apps\.apple\.com/g)||[]).length,1);assert(html.includes('https://apps.apple.com/us/app/secondyes-second-date-planner/id6806461390'));
assert(html.includes('rel="canonical" href="https://udrwu9c0tjuedqy2.github.io/hla-relationships/secondyes/should-i-go-on-a-second-date-debrief/"'));
assert(html.includes('@media(max-width:560px)'));assert(html.includes('aria-live="polite"'));assert(html.includes('readonly spellcheck="false"'));
console.log('PASS canonical, exact US CTA, local-only source and mobile/accessibility hooks');
