import {letter} from './model.mjs';
const fields=['day','place','detail','moment','question'].map(id=>document.getElementById(id));
const preview=document.getElementById('preview'),count=document.getElementById('count'),download=document.getElementById('download'),print=document.getElementById('print'),status=document.getElementById('status');
function current(){return letter(fields.map(e=>e.value));}
function render(){const result=current();preview.textContent=result.text;count.textContent=result.count+' of 4 prompts answered';download.disabled=print.disabled=!result.count;status.textContent='';}
fields.forEach(e=>e.addEventListener('input',render));
download.addEventListener('click',()=>{const result=current();if(!result.count)return;const url=URL.createObjectURL(new Blob([result.text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='my-ordinary-day-letter.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Download requested. Check your browser downloads and keep your file somewhere you trust.';});
print.addEventListener('click',()=>{if(current().count)window.print();});
render();