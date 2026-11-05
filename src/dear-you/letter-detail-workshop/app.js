'use strict';
const RULES=[['nice','What made it nice? Name one thing you noticed.'],['amazing','Which moment would let the reader see why?'],['great','What happened, in plain words?'],['special','What detail made this different from another day?'],['always','Can you name one particular time instead?'],['everything','Which one thing matters most in this sentence?'],['a lot','Could you name an example or an amount you remember?'],['things','Which objects, actions or changes do you mean?']];
function inspect(text){return RULES.map(([phrase,prompt])=>{const escaped=phrase.replace(/ /g,'\\s+'),re=new RegExp('\\b'+escaped+'\\b','gi');const matches=[...text.matchAll(re)].map(m=>({start:m.index,end:m.index+m[0].length}));return {phrase,prompt,matches};}).filter(x=>x.matches.length);}
function words(t){return (t.trim().match(/\S+/g)||[]).length;}
const $=id=>document.getElementById(id);
function invalidate(){$('analysis').hidden=true;$('comparison').hidden=true;$('status').textContent='';}
function analyze(){invalidate();const text=$('original').value;if(!text.trim()){$('status').textContent='Add a starting sentence or load the fictional example.';$('original').focus();return;}
if(text.length>3000){$('status').textContent='Keep the starting draft to 3,000 characters.';return;}
const found=inspect(text);$('prompts').replaceChildren();found.forEach(f=>{const p=document.createElement('p');p.textContent='“'+f.phrase+'” ('+f.matches.length+') — '+f.prompt;$('prompts').appendChild(p);});
$('analysis-note').textContent=found.length?'These are invitations to add detail, not errors. Keep any word that sounds right to you.':'None of the eight prompt phrases appeared. This does not mean the writing is specific or finished. Try naming one place, action or object yourself.';
$('highlight').replaceChildren();const ranges=found.flatMap(x=>x.matches).sort((a,b)=>a.start-b.start);let end=0;ranges.forEach(r=>{const span=document.createElement('span');span.textContent=text.slice(end,r.start);$('highlight').appendChild(span);const mark=document.createElement('mark');mark.textContent=text.slice(r.start,r.end);$('highlight').appendChild(mark);end=r.end;});const tail=document.createElement('span');tail.textContent=text.slice(end);$('highlight').appendChild(tail);$('analysis').hidden=false;}
function compare(){const a=$('original').value,b=$('revision').value;$('comparison').hidden=true;if(!a.trim()||!b.trim()){$('status').textContent='Add both a starting draft and your revised draft before comparing.';(!a.trim()?$('original'):$('revision')).focus();return;}
if(a.length>3000||b.length>3000){$('status').textContent='Keep each draft to 3,000 characters.';return;}$('status').textContent='';$('before').textContent=a;$('after').textContent=b;$('count').textContent='Starting draft: '+words(a)+' words. Revised draft: '+words(b)+' words. Length is not a quality score.';$('comparison').hidden=false;$('count').focus();}
$('analyze').addEventListener('click',analyze);$('compare').addEventListener('click',compare);
$('original').addEventListener('input',invalidate);$('revision').addEventListener('input',()=>{$('comparison').hidden=true;$('status').textContent='';});
$('start-revision').addEventListener('click', () => {
  const original = $('original');
  const revision = $('revision');
  if (!original.value.trim()) {
    $('status').textContent = 'Add a starting draft before using it for your revision.';
    original.focus();
    return;
  }
  if (revision.value !== original.value) {
    if (revision.value && !window.confirm('Replace your revision with the starting draft?')) return;
    revision.value = original.value;
    revision.dispatchEvent(new Event('input', { bubbles: true }));
  }
  revision.focus();
  revision.setSelectionRange(revision.value.length, revision.value.length);
});

const exampleText = 'Today was a great day. We did lots of things and everything felt special.';

function discardDrafts(message) {
  return (!$('original').value && !$('revision').value) || window.confirm(message);
}

function clearOutput() {
  invalidate();
  for (const id of ['before', 'after', 'count', 'highlight', 'analysis-note', 'prompts']) {
    $(id).replaceChildren();
  }
  if ($('copy-status')) $('copy-status').textContent = '';
}

$('example').addEventListener('click', () => {
  if (!discardDrafts('Replace both drafts with the fictional example?')) return;
  clearOutput();
  $('original').value = exampleText;
  $('revision').value = '';
  $('original').focus();
});

$('clear').addEventListener('click', () => {
  if (!discardDrafts('Erase both drafts from this page?')) return;
  clearOutput();
  $('original').value = '';
  $('revision').value = '';
  $('original').focus();
});

const copyRevision = $('copy-revision');
if (copyRevision) {
  const copyStatus = $('copy-status');
  let generation = 0;
  for (const id of ['original', 'revision', 'example', 'clear']) {
    const event = id === 'original' || id === 'revision' ? 'input' : 'click';
    $(id).addEventListener(event, () => {generation++; copyStatus.textContent = '';});
  }
  copyRevision.addEventListener('click', async () => {
    const revision = $('revision');
    const text = revision.value;
    const attempt = ++generation;
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      if (attempt === generation) copyStatus.textContent = 'Revision copied. You can paste it into a new letter.';
    } catch {
      if (attempt !== generation) return;
      revision.focus();
      revision.select();
      copyStatus.textContent = 'Your revision is selected. Use your device’s Copy command.';
    }
  });
}

