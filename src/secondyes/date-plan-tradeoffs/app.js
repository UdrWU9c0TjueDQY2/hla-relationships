const form = document.getElementById('plans');
const result = document.getElementById('result');
const field = id => document.getElementById(id);

function readPlan(prefix, fallback) {
  return {
    name: field(prefix + 'n').value.trim() || fallback,
    cents: Math.round(field(prefix + 'c').valueAsNumber * 100),
    minutes: field(prefix + 'a').valueAsNumber + field(prefix + 't').valueAsNumber
  };
}

function price(cents) {
  return (cents / 100).toFixed(2);
}

function compare(event) {
  event.preventDefault();
  const a = readPlan('a', 'Plan A');
  const b = readPlan('b', 'Plan B');
  const cheaper = a.cents < b.cents ? a : b;
  const shorter = a.minutes < b.minutes ? a : b;
  result.textContent = [
    ...[a, b].map(plan => plan.name + ': ' + price(plan.cents) + ' per person; ' + plan.minutes + ' total minutes.'),
    '',
    a.cents === b.cents ? 'Same estimated cost.' : cheaper.name + ' costs ' + price(Math.abs(a.cents - b.cents)) + ' less per person.',
    a.minutes === b.minutes ? 'Same estimated total time.' : shorter.name + ' takes ' + Math.abs(a.minutes - b.minutes) + ' fewer minutes.',
    '',
    'These estimates use the prices and travel times you entered.'
  ].join('\n');
}

form.addEventListener('submit', compare);
form.addEventListener('input', () => { result.textContent = ''; });
form.addEventListener('reset', () => { result.textContent = ''; });
