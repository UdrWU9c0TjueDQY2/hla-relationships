const {chromium} = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + '/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const dir=path.resolve(process.argv[2]||'.');
const draft='Dear future me, today felt special.';
const revision='Dear future me, the blue mug I made wobbles on the table. I slip a folded napkin under it before pouring tea.';
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CAPTURE_CHROME||'/tmp/sturdy-v5-browser/chrome',args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage({viewport:{width:448,height:462},deviceScaleFactor:1});
 await p.route('https://**/*',r=>r.abort());await p.goto('file://'+path.join(dir,'public/index.html'));
 async function shot(name,selector,above){await p.locator(selector).evaluate((e,d)=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-d),above);await p.screenshot({path:path.join(dir,name+'.png'),animations:'disabled'});}
 await p.locator('#original').fill(draft);await shot('starting','label[for=original]',12);
 await p.locator('#analyze').click();assert.equal(await p.locator('#highlight mark').innerText(),'special');assert.match(await p.locator('#prompts').innerText(),/What detail made this different/);await shot('prompt','#highlight',84);
 await p.locator('#start-revision').click();assert.equal(await p.locator('#revision').inputValue(),draft);await shot('carry','#start-revision',20);
 await p.locator('#revision').fill('Dear future me, the blue mug I made wobbles on the table.');await shot('first-detail','label[for=revision]',16);
 await p.locator('#revision').fill(revision);await shot('rewrite','label[for=revision]',16);
 await p.locator('#compare').click();assert.equal(await p.locator('#before').innerText(),draft);assert.equal(await p.locator('#after').innerText(),revision);await shot('compare','#comparison .grid',4);
 assert.equal(await p.locator('#copy-revision').isVisible(),true);console.log(JSON.stringify({fictional_start:draft,fictional_revision:revision,real_prompt:await p.locator('#prompts').textContent(),real_count:await p.locator('#count').innerText()}));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
