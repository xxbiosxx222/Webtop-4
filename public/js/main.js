import { WindowManager } from './windowManager.js';
import { startMenuManager } from './startMenuManager.js';
import { clockManager } from './clockManager.js';
import Toasty from './Toasty.js';
window.toasty = new Toasty("top-right", { basePath: "./" });
const windowManager = new WindowManager();
const startMenu = startMenuManager();
clockManager();

window.getAccent = function(rgbaInput) {
  const taskbar = window.parent.document.getElementById("taskbar");
  if (!taskbar) return rgbaInput;

  const taskbarColor = window.parent.getComputedStyle(taskbar).backgroundColor;

  // Match RGBA from rgbaInput
  const inputMatch = rgbaInput.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
  const alpha = inputMatch?.[4];

  if (!alpha) {
    console.warn("Alpha not found in input:", rgbaInput);
    return rgbaInput;
  }

  // Match RGB from taskbar
  const taskbarMatch = taskbarColor.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  const rgb = taskbarMatch ? `${taskbarMatch[1]}, ${taskbarMatch[2]}, ${taskbarMatch[3]}` : "0,0,0";

  return `rgba(${rgb}, ${alpha})`;
};

document.getElementById('search-button').addEventListener('click', () => {
  const query = document.getElementById('taskbar-input').value;
  if (query) {
      windowManager.createWindow({
          title: `Search: ${query}`,
          content: `<iframe src="https://unduck.link?q=${encodeURIComponent(query)}" width="100%" height="100%" style="border:none;"></iframe>`,
          x: 200,
          y: 150,
          width: 800,
          height: 600
      });
  }
});

 windowManager.createWindow({
  title: 'Setup',
  icon: './WebTop4.png',
  content: `<iframe src="./applications/setup.html" width="100%" height="100%" style="border:none;"></iframe>`,
  x: 100,
  y: 100,
  width: 800,
  height: 600
});

window.addEventListener("message", (event) => {
  if (event.data?.type === "term") {
    const iframe = document.getElementById("window_terminal");
    iframe.contentWindow.postMessage(event.data, "*");
  }
});

document.querySelectorAll('.desktop-icon').forEach(icon => {
  const title = icon.getAttribute('data-title');
  const span = document.createElement('span');
  span.textContent = title;
  icon.appendChild(span);
  icon.addEventListener('dblclick', (e) => {
    const title = icon.getAttribute('data-title');
    const url = icon.getAttribute('data-url');
    const width = icon.getAttribute('data-width');
    const height = icon.getAttribute('data-height');
    const betaUrl = `beta${url.replace(/^\./, '')}`;

    const id = 'window_' + title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]+/g, '_')
      .replace(/^([^a-z])/, '_$1');

    if (e.shiftKey) {
      windowManager.createWindow({
        title: title,
        content: `<iframe src="${betaUrl}" id="${id}" width="100%" height="100%" style="border:none;" allowtransparency="true"></iframe>`,
        x: 200,
        y: 150,
        width: width,
        height: height
      });
    } else {
      windowManager.createWindow({
        title: title,
        content: `<iframe src="${url}" id="${id}" width="100%" height="100%" style="border:none;" allowtransparency="true"></iframe>`,
        x: 200,
        y: 150,
        width: width,
        height: height
      });
    }
    if(title == "Doom") {
        windowManager.createWindow({
        title: "Terminal [Doom]",
        content: `<iframe src="./applications/doom/term.html" id="window_terminal" width="100%" height="100%" style="border:none;" allowtransparency="true"></iframe>`,
        x: 200,
        y: 150,
        width: width,
        height: height
      });
    }
  });
});

const optionMenu = document.getElementById('settings');

optionMenu.addEventListener('click', (e) => {
    windowManager.createWindow({
      title: 'Settings',
      content: `<iframe src="./applications/settings.html" width="100%" height="100%" style="border:none;" allowtransparency="true"></iframe>`,
      x: 200,
      y: 150,
      width: 800,
      height: 600
    });
});

window.addEventListener('beforeunload', (event) => {
  const confirmation = confirm("Webtop got a shutdown request. Was this what you wanted?");
  if (!confirmation) {
    event.preventDefault();
    event.returnValue = '';
  } else {
  }
});

async function generateIconSVGFromImage(imgUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Important if icons are from other origins
    img.src = imgUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      function getPixelColor(x, y) {
        const data = ctx.getImageData(x, y, 1, 1).data;
        return [data[0], data[1], data[2]];
      }

      const positions = [
        [Math.floor(img.width / 2), 0],
        [Math.floor(img.width / 2), img.height - 1],
        [0, Math.floor(img.height / 2)],
        [img.width - 1, Math.floor(img.height / 2)],
      ];

      const colorCount = {};
      function rgbToKey(rgb) { return rgb.join(','); }
      function keyToRgb(key) { return key.split(',').map(Number); }

      positions.forEach(pos => {
        const color = getPixelColor(pos[0], pos[1]);
        const key = rgbToKey(color);
        colorCount[key] = (colorCount[key] || 0) + 1;
      });

      let mostFrequentKey = null;
      let maxCount = 0;
      for (const key in colorCount) {
        if (colorCount[key] > maxCount) {
          maxCount = colorCount[key];
          mostFrequentKey = key;
        }
      }
      const bgRgb = keyToRgb(mostFrequentKey);

      const darkenColor = (rgb) => rgb.map(c => Math.max(0, Math.min(255, Math.floor(c * 0.8))));
      const rgbToHex = (rgb) => '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('');
      const bgColor = rgbToHex(bgRgb);
      const strokeColor = rgbToHex(darkenColor(bgRgb));

      const smallCanvas = document.createElement('canvas');
      smallCanvas.width = 32;
      smallCanvas.height = 32;
      const sCtx = smallCanvas.getContext('2d');

      const scale = Math.max(32 / img.width, 32 / img.height);
      const sw = img.width * scale;
      const sh = img.height * scale;
      const sx = (32 - sw) / 2;
      const sy = (32 - sh) / 2;

      sCtx.clearRect(0, 0, 32, 32);
      sCtx.drawImage(img, sx, sy, sw, sh);
      const base64Image = smallCanvas.toDataURL('image/png');

      const svgInner = `
        <rect x="1" y="1" width="30" height="30" rx="4" ry="4"
          fill="${bgColor}" stroke="${strokeColor}" stroke-width="2"/>
        <image href="${base64Image}" x="3" y="3" width="26" height="26" />
      `;

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
          ${svgInner}
        </svg>
      `;

      resolve(svg);
    };

    img.onerror = () => {
      resolve(null);
    };
  });
}

async function replaceAllDesktopIcons() {
  // Select all desktop icon images
  const iconImgs = document.querySelectorAll('.desktop-icon img');

  for (const img of iconImgs) {
    const svg = await generateIconSVGFromImage(img.src);
    if (svg) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
  const svgElement = svgDoc.documentElement;

  img.parentNode.replaceChild(svgElement, img);
    }
  }
}

// Run the replacement after DOM is loaded
/* window.addEventListener('DOMContentLoaded', () => {
  replaceAllDesktopIcons();
});
*/