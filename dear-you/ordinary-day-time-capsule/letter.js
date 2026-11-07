import {letter} from './model.mjs';
const fields=['day','place','detail','moment','question'].map(id=>document.getElementById(id));
const preview=document.getElementById('preview');
const count=document.getElementById('count');
const download=document.getElementById('download');
const card=document.getElementById('card');
const print=document.getElementById('print');
const status=document.getElementById('status');

function current(){return letter(fields.map(e=>e.value));}

function render(){
  const result=current();
  preview.textContent=result.text;
  count.textContent=result.count+' of 4 prompts answered';
  download.disabled=card.disabled=print.disabled=!result.count;
  status.textContent='';
}

function requestDownload(blob,filename){
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function wrapLine(value,limit=52){
  if(!value)return [''];
  const words=value.split(/\s+/).filter(Boolean);
  const lines=[];
  let line='';
  for(const word of words){
    if(word.length>limit){
      if(line){lines.push(line);line='';}
      for(let start=0;start<word.length;start+=limit)lines.push(word.slice(start,start+limit));
      continue;
    }
    const next=line?line+' '+word:word;
    if(next.length>limit){if(line)lines.push(line);line=word;}
    else line=next;
  }
  if(line)lines.push(line);
  return lines.length?lines:[''];
}

function visualLines(value){
  const output=[];
  for(const paragraph of value.split(/\n/)){
    if(!paragraph.trim()){output.push('');continue;}
    output.push(...wrapLine(paragraph));
  }
  return output;
}

function makeKeepsakeCard(value){
  const ns='http://www.w3.org/2000/svg';
  const lines=visualLines(value);
  const width=1200;
  const height=Math.max(900,310+lines.length*44);
  const svg=document.createElementNS(ns,'svg');
  svg.setAttribute('xmlns',ns);
  svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
  svg.setAttribute('role','img');
  svg.setAttribute('aria-labelledby','card-title card-desc');

  const title=document.createElementNS(ns,'title');
  title.id='card-title';
  title.textContent='Ordinary day keepsake letter';
  svg.append(title);
  const desc=document.createElementNS(ns,'desc');
  desc.id='card-desc';
  desc.textContent='A visual keepsake made from the words entered in the Ordinary Day Time Capsule.';
  svg.append(desc);

  const background=document.createElementNS(ns,'rect');
  background.setAttribute('width','1200');
  background.setAttribute('height',String(height));
  background.setAttribute('fill','#fffaf1');
  svg.append(background);

  const edge=document.createElementNS(ns,'rect');
  edge.setAttribute('x','44');
  edge.setAttribute('y','44');
  edge.setAttribute('width','1112');
  edge.setAttribute('height',String(height-88));
  edge.setAttribute('rx','20');
  edge.setAttribute('fill','none');
  edge.setAttribute('stroke','#9b625a');
  edge.setAttribute('stroke-width','3');
  svg.append(edge);

  const mark=document.createElementNS(ns,'text');
  mark.setAttribute('x','90');
  mark.setAttribute('y','112');
  mark.setAttribute('fill','#8a4a43');
  mark.setAttribute('font-family','system-ui, sans-serif');
  mark.setAttribute('font-size','22');
  mark.setAttribute('font-weight','700');
  mark.setAttribute('letter-spacing','4');
  mark.textContent='FOR A LATER YOU';
  svg.append(mark);

  const rule=document.createElementNS(ns,'line');
  rule.setAttribute('x1','90');
  rule.setAttribute('x2','1110');
  rule.setAttribute('y1','150');
  rule.setAttribute('y2','150');
  rule.setAttribute('stroke','#dbcab7');
  rule.setAttribute('stroke-width','2');
  svg.append(rule);

  const text=document.createElementNS(ns,'text');
  text.setAttribute('x','90');
  text.setAttribute('y','220');
  text.setAttribute('fill','#422f30');
  text.setAttribute('font-family','Georgia, serif');
  text.setAttribute('font-size','31');
  for(const [index,line] of lines.entries()){
    const span=document.createElementNS(ns,'tspan');
    span.setAttribute('x','90');
    span.setAttribute('dy',index?'44':'0');
    span.textContent=line||' ';
    text.append(span);
  }
  svg.append(text);

  const footer=document.createElementNS(ns,'text');
  footer.setAttribute('x','90');
  footer.setAttribute('y',String(height-82));
  footer.setAttribute('fill','#8a4a43');
  footer.setAttribute('font-family','system-ui, sans-serif');
  footer.setAttribute('font-size','18');
  footer.textContent='Made privately in the Honest Little Apps Ordinary Day Time Capsule';
  svg.append(footer);

  return '<?xml version="1.0" encoding="UTF-8"?>\n'+new XMLSerializer().serializeToString(svg);
}

fields.forEach(e=>e.addEventListener('input',render));

download.addEventListener('click',()=>{
  const result=current();
  if(!result.count)return;
  requestDownload(new Blob([result.text],{type:'text/plain;charset=utf-8'}),'my-ordinary-day-letter.txt');
  status.textContent='Text download requested. Check your browser downloads and keep your file somewhere you trust.';
});

card.addEventListener('click',()=>{
  const result=current();
  if(!result.count)return;
  const svg=makeKeepsakeCard(result.text);
  requestDownload(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}),'my-ordinary-day-keepsake.svg');
  status.textContent='Keepsake card download requested. It contains your words, so review it before sharing.';
});

print.addEventListener('click',()=>{if(current().count)window.print();});
render();
