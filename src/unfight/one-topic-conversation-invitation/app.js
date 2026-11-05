const $ = id => document.getElementById(id);
const fields = ['topic', 'when', 'ask'].map($);
const [topic, when, ask] = fields;
const draft = $('draft');
const status = $('result');
let lastBuilt = '';
const sample = ['how we divide weekend errands', 'Saturday after breakfast', 'what feels manageable for each of us'];
const choices = document.createElement('div');
choices.className = 'actions';
const yes = document.createElement('button');
const no = document.createElement('button');
no.textContent = 'Keep my work';
no.className = 'secondary';
choices.append(yes, no);
let pending;
function cancel() {
  const previous = pending;
  pending = null;
  choices.remove();
  return previous;
}
function choose(trigger, message, label, action) {
  cancel();
  pending = {trigger, action};
  status.textContent = message;
  yes.textContent = label;
  status.after(choices);
  yes.focus();
}
yes.onclick = () => {
  const next = cancel();
  if (!next) return;
  next.trigger.focus();
  next.action();
};
no.onclick = () => {
  const previous = cancel();
  status.textContent = 'Your current work is unchanged.';
  previous?.trigger.focus();
};
const hasWords = () => fields.some(field => field.value !== '') || draft.value !== '';
const editedDraft = () => draft.value !== lastBuilt;
fields.forEach(field => field.addEventListener('input', () => {
  cancel();
  status.textContent = draft.value ? 'Your draft is unchanged. Choose Build my draft to use the updated details.' : '';
}));
draft.addEventListener('input', () => {
  cancel();
  status.textContent = '';
});
function build() {
  const [t, w, a] = fields.map(field => field.value.trim());
  if (!t || !w || !a) {
    status.textContent = 'Fill in the topic, offered time and what you want to understand.' + (draft.value ? ' Your current draft is unchanged.' : '');
    fields.find(field => !field.value.trim()).focus();
    return;
  }
  draft.value = lastBuilt = 'Would you be open to talking about ' + t + '? I could make time ' + w + '. I would like to understand ' + a + '. If that does not work for you, we can choose another time or leave it for now.';
  status.textContent = 'Draft ready. Edit anything that does not sound like you. This is an invitation, not an agreement.';
}
$('build').onclick = () => {
  cancel();
  if (fields.every(field => field.value.trim()) && editedDraft())
    choose($('build'), 'Building a new draft would replace the wording you edited.', 'Replace my draft', build);
  else build();
};
$('sample').onclick = () => {
  cancel();
  const fill = () => { fields.forEach((field, i) => {field.value = sample[i];}); build(); };
  if (hasWords()) choose($('sample'), 'The example would replace your current entries and draft.', 'Use the example', fill);
  else fill();
};
$('reset').onclick = () => {
  cancel();
  const clear = () => {
    fields.forEach(field => {field.value = '';});
    draft.value = lastBuilt = '';
    status.textContent = 'Cleared.';
    topic.focus();
  };
  if (hasWords()) choose($('reset'), 'Clear the entries and draft from this page?', 'Clear my work', clear);
  else clear();
};
