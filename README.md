# SVG Background Switcher

Ever opened a white SVG in your browser and stared at a blank page wondering if the file was broken? Yeah, us too. Chrome renders SVGs on a white background, so any white or light-colored artwork just vanishes.

This extension fixes that. It adds a simple toolbar when viewing `.svg` files so you can switch the background to black, gray, checkerboard, or any color you want. Works with Chrome and any Chromium-based browser that supports Chrome extensions (Brave, Edge, Arc, Vivaldi, Opera, etc.).

## Features

- **Preset backgrounds:** White, black, dark gray, light gray, and checkerboard (transparency grid)
- **Custom color picker:** Choose any background color via the native color picker
- **Zoom controls:** Slider, +/- buttons, mouse wheel, and editable percentage input (5% to 1000%)
- **Persistent settings:** Last selected background color is saved across sessions via `chrome.storage.local`

## Install

1. Clone or download this repository
2. Open `chrome://extensions` (or `brave://extensions`)
3. Enable **Developer mode**
4. Click **Load unpacked** and select this directory
5. On the extension details page, enable **Allow access to file URLs** if you want to view local SVG files

## How It Works

The extension uses a service worker that listens for tab navigation to `.svg` URLs. When detected, it redirects the tab to a bundled `viewer.html` page that loads the SVG as an `<img>` element inside a proper HTML document with the toolbar.

### Files

- `manifest.json` - Extension manifest (Manifest V3)
- `service-worker.js` - Detects SVG navigation and redirects to viewer
- `viewer.html` - HTML viewer page with toolbar and SVG container
- `content.js` - Toolbar logic, color switching, zoom, and persistence

## License

MIT License

Copyright (c) 2026 Jean-Benoit Lesage

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
