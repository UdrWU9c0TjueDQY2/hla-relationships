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
$('highlight').replaceChildren();const ranges=found.flatMap(x=>x.matches).sort((a,b)=>a.start-b.start);let end=0;ranges.forEach(r=>{const span=document.createElement('span');span.textContent=text.slice(end,r.start);$('highlight').appendChild(span);const mark=document.createElement('mark');mark.textContent=text.slice(r.start,r.end);$('highlight').appendChild(mark);end=r.end;});const tail=document.createElement('span');tail.textContent=text.slice(end);$('highlight').appendChild(tail);$('analysis').hidden=false;$('analysis-title').focus();}
function compare(){$('comparison-file-status').textContent='';const a=$('original').value,b=$('revision').value;$('comparison').hidden=true;if(!a.trim()||!b.trim()){$('status').textContent='Add both a starting draft and your revised draft before comparing.';(!a.trim()?$('original'):$('revision')).focus();return;}
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

const exampleText = 'It was a special morning.';
const exampleRevision = 'We ate toast on the kitchen floor while the table paint dried.';

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

function loadWorkedExample(event) {
  event.preventDefault();
  const original = $('original');
  const revision = $('revision');
  const alreadyLoaded = original.value === exampleText && revision.value === exampleRevision;
  if (!alreadyLoaded && !discardDrafts('Replace both drafts with the fictional worked example?')) return;
  clearOutput();
  original.value = exampleText;
  revision.value = exampleRevision;
  // Notify the editing controls only after a confirmed replacement.
  for (const field of [original, revision]) {
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }
  analyze();
  $('compare').click();
}

$('example').addEventListener('click', loadWorkedExample);
$('hero-example').addEventListener('click', loadWorkedExample);

$('clear').addEventListener('click', () => {
  if (!discardDrafts('Erase both drafts from this page?')) return;
  clearOutput();
  $('original').value = '';
  $('revision').value = '';
  $('original').focus();
});

const draftPicker = $('draft-version');
const keepDraft = $('keep-draft');
const copyStatus = $('copy-status');
let chosenDraft = null;
let copyAttempt = 0;

function updateDraftActions() {
  copyAttempt++;
  copyStatus.textContent = '';
  const hasOriginal = Boolean($('original').value.trim());
  const hasRevision = Boolean($('revision').value.trim());
  keepDraft.hidden = !hasOriginal && !hasRevision;
  if (keepDraft.hidden) {
    chosenDraft = null;
    return;
  }
  if (chosenDraft && !$(chosenDraft).value.trim()) chosenDraft = null;
  draftPicker.value = chosenDraft || (hasRevision ? 'revision' : 'original');
  const both = hasOriginal && hasRevision;
  $('draft-picker').hidden = !both;
  $('single-version').hidden = both;
  $('single-version').textContent = hasRevision ? 'Your revised draft' : 'Your starting draft';
  $('copy-revision').textContent = draftPicker.value === 'revision' ? 'Copy revised letter' : 'Copy starting draft';
}

for (const id of ['original', 'revision']) $(id).addEventListener('input', updateDraftActions);
// Example and clear update the fields programmatically.
for (const id of ['example', 'clear']) $(id).addEventListener('click', updateDraftActions);
draftPicker.addEventListener('change', () => {
  chosenDraft = draftPicker.value;
  updateDraftActions();
});
window.addEventListener('pageshow', updateDraftActions);
updateDraftActions();

$('copy-revision').addEventListener('click', async () => {
  const field = $(draftPicker.value);
  const text = field.value;
  const attempt = ++copyAttempt;
  if (!text.trim()) return;
  try {
    await navigator.clipboard.writeText(text);
    if (attempt === copyAttempt) copyStatus.textContent = 'Copied. Paste your letter wherever you want to keep it.';
  } catch {
    if (attempt !== copyAttempt) return;
    field.focus();
    field.select();
    copyStatus.textContent = 'Your text is selected. Use your device’s Copy command.';
  }
});

$('download-draft').addEventListener('click', () => {
  const version = draftPicker.value;
  const text = $(version).value;
  if (!text.trim()) return;
  copyAttempt++;
  saveTextFile(text, version === 'revision' ? 'letter-revised.txt' : 'letter-starting-draft.txt');
  copyStatus.textContent = 'Text file prepared. Your browser handles the download.';
});

$('download-comparison').addEventListener('click', () => {
  if ($('comparison').hidden) return;
  const before = $('before').textContent;
  const after = $('after').textContent;
  if (!before.trim() || !after.trim()) return;
  saveTextFile(['Starting draft', before, 'Revised draft', after].join('\n\n'), 'letter-before-and-after.txt');
  $('comparison-file-status').textContent = 'Text file prepared with both versions.';
});

function saveTextFile(text, filename) {
  const file = new Blob([text], {type: 'text/plain;charset=utf-8'});
  const fileURL = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = fileURL;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(fileURL), 60000);
}
