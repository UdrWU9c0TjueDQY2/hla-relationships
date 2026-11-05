"""Letter workshop film. Requires source captures, Pillow, DejaVu fonts, and ffmpeg."""
from pathlib import Path
from subprocess import Popen,PIPE
import sys
from PIL import Image,ImageDraw,ImageFont
root=Path(sys.argv[1]).resolve()
fonts=Path('/usr/share/fonts/truetype/dejavu')
def font(name,size):return ImageFont.truetype(str(fonts/(name+'.ttf')),size)
label=font('DejaVuSans-Bold',14);headline=font('DejaVuSerif',35);caption=font('DejaVuSans',21)
scenes=[
(0,3,'starting','Start with a line to your future self:\n“Dear future me, today felt special.”'),
(3,7,'prompt','Show detail prompts. The workshop\nflags “special” and asks what differed.'),
(7,11,'carry','Use the starting draft for the revision.\nBoth fields now hold the same words.'),
(11,13,'first-detail','Give the moment an object and an action.\nThe blue mug wobbles on the table.'),
(13,16,'rewrite','Give the moment an object and an action.\nThe blue mug wobbles on the table.'),
(16,21,'compare','Compare the drafts. The folded napkin\nis the detail future you can picture.')
]
def stamp(sec):return f'00:00:{sec:02}.000'
vtt=[(a,b,t) for a,b,k,t in scenes]
vtt[3]=(11,16,vtt[3][2]);vtt.pop(4)
(root/'letter-detail.vtt').write_text('WEBVTT\n\n'+'\n\n'.join(f'{stamp(a)} --> {stamp(b)}\n{t}' for a,b,t in vtt)+'\n')
proc=Popen(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','512x752','-r','6','-i','-','-an','-c:v','libx264','-profile:v','baseline','-level','3.0','-preset','medium','-crf','33','-pix_fmt','yuv420p','-movflags','+faststart',str(root/'letter-detail.mp4')],stdin=PIPE)
for a,b,shot,words in scenes:
    page=Image.open(root/(shot+'.png')).convert('RGB')
    im=Image.new('RGB',(512,752),'#f9eee5');d=ImageDraw.Draw(im)
    d.text((32,18),'DEAR YOU   /   WEB WORKSHOP',font=label,fill='#805363')
    d.text((30,43),'Keep the wobbly mug.',font=headline,fill='#4b3538')
    d.rectangle((30,105,481,570),outline='#b78a8b',width=2);im.paste(page,(32,107))
    for line in words.splitlines():assert d.textlength(line,font=caption)<=449,line
    d.multiline_text((31,588),words,font=caption,fill='#392b30',spacing=8)
    d.line((32,688,480,688),fill='#c9aca2',width=1)
    d.text((32,704),'Fictional letter',font=label,fill='#805363')
    d.text((480,704),'HONEST LITTLE APPS',font=label,fill='#805363',anchor='ra')
    if a==0:im.save(root/'letter-detail-poster.webp',quality=78,method=6)
    for _ in range((b-a)*6):proc.stdin.write(im.tobytes())
proc.stdin.close()
if proc.wait():raise RuntimeError('encoding failed')
