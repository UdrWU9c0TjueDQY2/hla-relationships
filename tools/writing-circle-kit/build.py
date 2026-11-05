"""Build the original Dear You writing-circle kit. Requires reportlab."""
from pathlib import Path
from html import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FONT_ROOT = Path('/usr/share/fonts/truetype/dejavu')
for name, filename in [('Helvetica','DejaVuSans.ttf'),('Helvetica-Bold','DejaVuSans-Bold.ttf'),('Times-Roman','DejaVuSerif.ttf'),('Times-Bold','DejaVuSerif-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(FONT_ROOT/filename)))

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'src/dear-you/letter-detail-workshop'
URL = 'https://udrwu9c0tjuedqy2.github.io/hla-relationships/dear-you/letter-detail-workshop/#writing-circle'
APPLE = 'https://apps.apple.com/us/app/dear-you-daily-letters/id6792827344'
MODEL = [
    'Dear future me,',
    'I am writing at the kitchen table on a rainy Thursday. My blue mug rocks unless I slide a folded napkin under it. There is a library book beside the kettle that I have renewed twice.',
    'This morning I took the long way home from the shop. Someone had tied a red ribbon to a bicycle basket. I stopped to look at it instead of reaching for my phone. I would probably forget that minute if I did not write it here.',
    'I keep thinking I need a dramatic story before I can begin a letter. Today I only have a wobbly mug, a ribbon and a book I still want to finish. That feels like enough to record.',
    'When you read this, what is on your table? If the book is finished, was there a sentence you wanted to keep? You do not need to have changed anything. I am just curious about the ordinary day you are having.',
    'From the me at this table'
]
SECTIONS = [
 ('0-2 minutes | Set the boundary', 'Say: "This is a writing practice, not a sharing test. Choose an ordinary, comfortable moment. You may invent a scene, skip a prompt, leave or keep every word private. Nobody collects the letters. Reading aloud is optional."'),
 ('2-5 minutes | Notice the model', 'Read the fictional letter on page 2. Ask: Which object can you picture? Which sentence tells us what the writer thinks? Where does the letter leave a question unanswered? Discuss the model, not anybody\'s private experience.'),
 ('5-10 minutes | Draft quietly', 'Use page 3. Choose a room, journey or small task. Write one object, one action and one thought. Add a question for a later you. Fragments count; there is no minimum length. Offer the fictional-scene option again.'),
 ('10-15 minutes | Revise one line', 'Underline one broad phrase such as "a great day." Try a replacement that a camera or microphone could notice. Keep the feeling if it matters. Never invent a quotation or memory to satisfy a prompt.'),
 ('15-18 minutes | Optional response', 'Invite writers to share one chosen sentence, pass, or talk only about the model. Listeners answer: "The detail I could picture was..." Do not interpret the writer, ask for personal history or prescribe a better ending.'),
 ('18-20 minutes | Keep or discard', 'Each person decides what to keep. Take the paper home, copy it into an existing notebook, or discard it. The free browser workshop is optional. An app install is never needed to complete the session.')
]
INK = HexColor('#392B32'); ACCENT = HexColor('#824B5D'); PALE = HexColor('#F5EEF1')
W,H=612,792; LEFT=48; RIGHT=564
c = canvas.Canvas(str(OUT/'writing-circle-kit.pdf'), pagesize=(W,H), pageCompression=1)
c.setTitle('One Ordinary Detail - A 20-minute Writing Circle')
c.setAuthor('Honest Little Apps')
c.setSubject('Original facilitator guide, fictional model letter and private participant sheet')

def text(txt, y, size=10.5, font='Helvetica', width=516, leading=15, color=INK):
    c.setFont(font,size); c.setFillColor(color)
    for line in simpleSplit(txt,font,size,width):
        c.drawString(LEFT,y,line); y-=leading
    return y
def head(n, label, title, subtitle):
    c.setFillColor(ACCENT); c.rect(0,H-14,W,14,fill=1,stroke=0)
    text('HONEST LITTLE APPS  /  DEAR YOU WRITING COMPANION',751,9,'Helvetica-Bold')
    text(label.upper(),716,10,'Helvetica-Bold',color=ACCENT)
    text(title,686,25,'Times-Bold',leading=28)
    text(subtitle,654,10.5,width=510)
    c.setStrokeColor(HexColor('#C7ADB8'));c.line(LEFT,627,RIGHT,627)
def foot(n):
    c.setStrokeColor(HexColor('#C7ADB8'));c.line(LEFT,56,RIGHT,56)
    text('Original writing exercise by Honest Little Apps, publisher of Dear You. Not therapy.',42,8,width=500,leading=10)
    c.setFillColor(INK);c.setFont('Helvetica',8);c.drawRightString(RIGHT,28,f'{n} / 3')

head(1,'Facilitator guide','One ordinary detail','20 minutes. Any group size. Paper and a pen are enough. No app, account or submission.')
y=605
for title,body in SECTIONS:
    y=text(title,y,11,'Helvetica-Bold',leading=15,color=ACCENT)-4
    y=text(body,y,10.3,leading=14)-15
assert y>78, y
foot(1);c.showPage()

head(2,'Fictional model + revision','A letter from this table','A complete original example. These are invented details, not somebody\'s private letter.')
y=605
for p in MODEL:
    y=text(p,y,11,'Times-Roman',leading=15)-10
y-=3
y=text('A revision you can inspect',y,13,'Helvetica-Bold',color=ACCENT)-5
y=text('Broad line: "It was a special morning."',y,10.5,leading=15)-4
y=text('Specific line: "We ate toast on the kitchen floor while the table paint dried."',y,10.5,leading=15)-8
y=text('What changed? The revision names an action and a setting. It does not prove the morning felt special; the writer can add that feeling in their own words.',y,10.2,leading=14)-12
y=text('Three questions for the group',y,11,'Helvetica-Bold',color=ACCENT)-4
y=text('1. Which detail do you remember after looking away?  2. What remains unknown?  3. Which line would you keep without making it longer?',y,10.2,leading=14)
assert y>78,y
foot(2);c.showPage()

head(3,'Participant sheet','Keep the letter yours','Use a real ordinary scene, an invented scene, or skip anything. No one needs to read it.')
y=605
for prompt,sub,lines in [
 ('1 / Place one small thing in the scene','An object, sound or action you can describe without guessing.',3),
 ('2 / Write the thought beside it','What did you notice, wonder or want to remember?',3),
 ('3 / Ask a later you one question','It can stay unanswered. No prediction or promise is required.',2),
 ('4 / Revise one sentence','Replace a broad phrase with one detail. Keep wording that sounds like you.',2)]:
    y=text(prompt,y,11,'Helvetica-Bold',color=ACCENT)-3
    y=text(sub,y,9.5,leading=13)-8
    c.setStrokeColor(HexColor('#C7ADB8'))
    for _ in range(lines):c.line(LEFT,y-8,RIGHT,y-8);y-=20
    y-=14
y=text('Finish privately: keep, copy into a notebook, revise later, or discard.',y,10,'Helvetica-Bold',leading=14)-7
y=text('Optional free workshop and accessible text: use the resource link below.',y,9.2,leading=13)-2
c.linkURL(URL,(LEFT,y-7,RIGHT,y+11),relative=0)
y=text('Open the writing-circle resource',y,9.5,'Helvetica-Bold',color=ACCENT)-13
y=text('Optional app: Dear You. Free includes one waiting future letter at a time; Plus adds unlimited future letters through an auto-renewing subscription. App details checked Nov 5, 2026. The browser workshop does not save or seal letters.',y,8.5,leading=11)-4
c.linkURL(APPLE,(LEFT,y-7,RIGHT,y+11),relative=0)
y=text('View Dear You on the App Store',y,9,'Helvetica-Bold',color=ACCENT)
assert y>66,y
foot(3);c.save()

plain = ['ONE ORDINARY DETAIL - A 20-MINUTE WRITING CIRCLE',
 'Original facilitator kit by Honest Little Apps, publisher of Dear You.',
 'A writing exercise, not therapy. No app, account, payment or submission needed.',
 'FACILITATOR GUIDE']
for title,body in SECTIONS:plain += [title,body]
plain += ['FICTIONAL MODEL LETTER',*MODEL,
 'REVISION EXAMPLE',
 'Broad line: "It was a special morning."',
 'Specific line: "We ate toast on the kitchen floor while the table paint dried."',
 'The revision names an action and setting. It does not prove the morning felt special; the writer can add that feeling in their own words.',
 'PARTICIPANT PROMPTS',
 '1. Place one small thing in the scene. An object, sound or action you can describe without guessing.',
 '2. Write the thought beside it. What did you notice, wonder or want to remember?',
 '3. Ask a later you one question. It can stay unanswered. No prediction or promise required.',
 '4. Revise one sentence. Replace a broad phrase with one detail; keep wording that sounds like you.',
 'Finish privately: keep, copy into a notebook, revise later or discard.',
 'OPTIONAL TOOLS',URL,
 'Dear You is a separate iPhone/iPad app. Free includes one future letter waiting at a time. Plus adds unlimited future letters through an auto-renewing subscription. Prices appear before purchase. Checked Nov 5, 2026. This browser workshop does not save, seal or transfer letters.',APPLE]
(OUT/'writing-circle-kit.txt').write_text('\n\n'.join(plain)+'\n')
steps=''.join('<li><h4>'+escape(title)+'</h4><p>'+escape(body)+'</p></li>' for title,body in SECTIONS)
model=''.join('<p>'+escape(p)+'</p>' for p in MODEL)
section='''<section id="writing-circle" class="guide" aria-labelledby="circle-title">
<p class="kicker">FOR WRITING GROUPS / A 20-MINUTE SESSION</p>
<h2 id="circle-title">One ordinary detail. A whole letter.</h2>
<p>Run a complete writing circle with paper and a pen. The original three-page kit includes a facilitator timeline, a fictional model letter and a private participant sheet. No app, account or payment is needed.</p>
<div class="actions"><a class="cta" href="writing-circle-kit.pdf">Download the writing-circle kit (PDF, 3 pages)</a><a class="cta secondary" href="writing-circle-kit.txt" download>Download accessible text (.txt)</a></div>
<p class="fine">US Letter pages; choose “fit to page” when printing on A4. The PDF is not tagged; the complete guide and prompts are available as HTML below and in the text download. Sharing is optional. This is a writing exercise, not therapy.</p>
<details><summary>Read the complete facilitator guide</summary><ol>'''+steps+'''</ol></details>
<details><summary>Read the complete fictional model letter</summary><article aria-label="Fictional model letter">'''+model+'''</article>
<h3>Discuss the writing, not the writer</h3><p>Which detail do you remember after looking away? What remains unknown? Which line would you keep without making it longer?</p>
<p><strong>Broad line:</strong> “It was a special morning.” <strong>Specific line:</strong> “We ate toast on the kitchen floor while the table paint dried.” The revision names an action and setting. It does not prove the morning felt special; the writer can add that feeling in their own words.</p></details>
<details><summary>Read the participant prompts</summary><ol><li><strong>Place one small thing in the scene.</strong> An object, sound or action you can describe without guessing.</li><li><strong>Write the thought beside it.</strong> What did you notice, wonder or want to remember?</li><li><strong>Ask a later you one question.</strong> It can stay unanswered. No prediction or promise is required.</li><li><strong>Revise one sentence.</strong> Replace a broad phrase with one detail. Keep wording that sounds like you.</li></ol><p>Choose a real ordinary scene, an invented scene, or skip anything. Nobody needs to read your work. Keep it, copy into a notebook, revise later or discard.</p></details>
<p class="fine">Original kit by Honest Little Apps, publisher of Dear You. The separate iPhone/iPad app is optional. This web workshop does not save, seal or transfer letters.</p>
</section>'''
index=OUT/'index.html'
html=index.read_text()
if 'id="writing-circle"' not in html:
    marker='<section id="watch-a-revision"'
    assert html.count(marker)==1
    html=html.replace(marker,section+marker)
    index.write_text(html)
print(OUT/'writing-circle-kit.pdf')
