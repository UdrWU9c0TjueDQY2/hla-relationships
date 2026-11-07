from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import simpleSplit

HERE = Path(__file__).resolve().parent
OUT = HERE / 'secondyes-two-stop-planning-sheet.pdf'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
pdfmetrics.registerFont(TTFont('HLA', FONT))
pdfmetrics.registerFont(TTFont('HLA-Bold', BOLD))
c = canvas.Canvas(str(OUT), pagesize=letter, pageCompression=1)
c.setTitle('Two-stop date planning sheet - Honest Little Apps')
c.setAuthor('Honest Little Apps')
c.setSubject('A blank planning sheet and a fictional worked example. Separate companion to SecondYes.')
INK = '#41233C'
MUTED = '#514C50'
RULE = '#A39AA1'
TINT = '#F4EEF3'
L, R, W = 42, 570, 528
APPLE = 'https://apps.apple.com/us/app/secondyes-second-date-planner/id6806461390'
RESOURCE = 'https://udrwu9c0tjuedqy2.github.io/hla-relationships/secondyes/date-plan-tradeoffs/'

def text(x, y, value, size=10, bold=False, color=INK):
    c.setFillColor(color)
    c.setFont('HLA-Bold' if bold else 'HLA', size)
    c.drawString(x, y, value)

def para(value, x, y, width, size=9.5, leading=13):
    for line in simpleSplit(value, 'HLA', size, width):
        text(x, y, line, size)
        y -= leading
    return y

def line(x, y, width):
    c.setStrokeColor(RULE)
    c.setLineWidth(.55)
    c.line(x, y, x+width, y)

def label_line(label, x, y, width, size=9):
    text(x, y, label, size, color=MUTED)
    line(x, y-18, width)

def heading(label, y):
    c.setFillColor(TINT)
    c.roundRect(L, y-7, W, 23, 4, stroke=0, fill=1)
    text(L+9, y, label, 10.5, True)
    return y-23

def header(kicker, title, page):
    text(L, 752, 'HONEST LITTLE APPS  /  '+kicker, 9, True)
    text(L, 717, title, 23, True)
    text(R-50, 752, str(page)+' / 2', 9)
    line(L, 701, W)

def footer(page):
    line(L, 69, W)
    text(L, 54, 'Free companion from Honest Little Apps, publisher of SecondYes.', 8.1)
    text(L, 41, 'Works without the app. Optional: SecondYes for iPhone on the App Store.', 8.1)
    c.linkURL(APPLE, (L, 37, R, 50), relative=0, thickness=0)
    text(L, 28, 'Online worksheet: hla-relationships / secondyes / date-plan-tradeoffs', 7.7, color=MUTED)
    c.linkURL(RESOURCE, (L, 24, R, 36), relative=0, thickness=0)

header('BLANK WRITING SHEET', 'Two stops. One agreed plan.', 1)
para('For two adults planning with someone they already know. Use one currency. No names or contact details are needed. Check costs, travel and venue access directly.', L, 682, W, 9.5)

y = heading('1  Agree the limits', 635)
label_line('Currency', L, y, 100)
label_line('Maximum total per person*', L+124, y, 182)
label_line('Total minutes available', L+330, y, 198)
label_line('Shared-expense ceiling (included, not extra)', L, y-40, W)
text(L, y-73, '*Include each person\'s agreed share of any shared costs.', 8.1, color=MUTED)

y = heading('2  Choose the two stops', 505)
for x, stop in [(L, 'STOP 1'), (L+278, 'STOP 2')]:
    text(x, y, stop, 9, True)
    label_line('Activity / venue to confirm', x, y-19, 250)
    label_line('Activity minutes', x, y-58, 250)
    label_line('Cost per person / shared cost for pair', x, y-97, 250)
y = 329
para('Pair total = 2 x (stop 1 + stop 2 per-person cost) + shared costs + other costs. If prices differ, total each person separately. Count a shared expense once.', L, y, W, 8.5, 11)
label_line('Pair total / agreed share for each / any unconfirmed costs', L, y-35, W)

y = heading('3  Check the whole evening', 251)
text(L, y, 'Travel in + arrival + stop 1 + travel between + stop 2 + wrap-up + travel home', 8.5)
label_line('Minutes for each part / total / latest finish (check both if travelling separately)', L, y-22, W)

y = heading('4  Make room for a fallback and a real choice', 169)
label_line('Alternate plan, its cost/time, and when you will check conditions', L, y, W)
text(L, y-37, 'Each person: yes / no / alternative. No reply is not agreement.', 8.5)
label_line('Person 1 choice / Person 2 choice / what still needs agreeing', L, y-54, W)
footer(1)
c.showPage()

header('FICTIONAL WORKED EXAMPLE', 'Check the numbers. Keep the choice.', 2)
para('These invented activities and prices demonstrate the worksheet. They are not current venue prices or recommendations. The sample amounts already include taxes and fees.', L, 682, W, 9.5)

y = heading('1  The agreed limits', 629)
para('Both people allow 160 minutes and up to 25 currency units each, including their share of shared expenses. They also set a separate 12-unit ceiling for shared costs.', L, y, W, 10, 14)

y = heading('2  What the activities cost', 551)
for row, desc in enumerate([
    'Stop 1: cafe - 35 minutes; 8 units per person; no shared charge.',
    'Stop 2: small gallery - 55 minutes; 10 units per person; no shared charge.',
    'Other cost: parking - 10 units for the pair, counted once.'
]):
    text(L, y-row*21, desc, 9.4)
y -= 76
text(L, y, 'Pair total: 2 x (8 + 10) + 10 = 46 units', 11, True)
para('If split equally: 46 / 2 = 23 units each, within 25. Shared costs are 10 units, within the separate 12-unit ceiling. The 10-unit charge is not added again to each person.', L, y-23, W, 9.5, 13)

y = heading('3  Time includes the edges', 373)
parts = [('Travel in',20), ('Arrival/check-in',5), ('Cafe',35), ('Between stops',15), ('Gallery',55), ('Wrap-up',5), ('Travel home',20)]
text(L, y, '20 + 5 + 35 + 15 + 55 + 5 + 20 = 155 minutes', 11, True)
para('That leaves 5 minutes within their 160-minute limit. For a 17:00 meeting: leave at 16:40; arrive at 17:00; cafe 17:05-17:40; transfer 17:40-17:55; gallery 17:55-18:50; wrap up by 18:55; home at 19:15.', L, y-25, W, 9.5, 14)

y = heading('4  A fallback is a proposal, not an assumption', 248)
para('They will check weather, the route and opening hours at noon. If rain makes the transfer impractical, they can suggest one indoor cafe stop and recalculate cost and time. A substitute still needs agreement.', L, y, W, 9.5, 14)

y = heading('5  Both people can revise the plan', 159)
para('Person 1 says yes. Person 2 proposes the cafe only and a 19:00 finish. The two-stop plan is not agreed. They need to confirm a revised plan before treating the invitation as settled. Either person can decline.', L, y, W, 9.5, 14)
footer(2)
c.save()
print(OUT)
