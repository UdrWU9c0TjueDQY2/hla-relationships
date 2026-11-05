# Letter Detail Workshop demonstration

This 21-second silent clip records actions in the public browser workshop. It uses original fictional text: an opening about a “special” day is revised to describe a wobbly blue mug and a folded napkin. It shows the real prompt, starting-draft transfer and comparison. None of the footage is native app UI.

To reproduce, download the public workshop HTML, its v3 script and its stylesheet from the deployed version of source commit 5048c95b0de8d82b532721378f0f730e9e3cec3d into a work directory's public/ folder as index.html, app.js, style.css. Reproduce with Node and Playwright, Chromium (CAPTURE_CHROME; set CODEX_PRIMARY_RUNTIME_NODE_MODULES for Playwright), then Python/Pillow, DejaVu fonts and ffmpeg/libx264: node capture.cjs /path/to/work followed by python compose.py /path/to/work. Captures block unrelated remote assets and use only the fictional words in the capture script. Do not record personal correspondence.
