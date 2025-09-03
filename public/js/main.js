import { WindowManager } from './windowManager.js';
import { startMenuManager } from './startMenuManager.js';
import { clockManager } from './clockManager.js';
import { ContentLoader } from './content-loader.js';

const OSVersion = "4 (1.2)";

import Toasty from './Toasty.js';
window.toasty = new Toasty("top-right", { basePath: "./" });

const windowManager = new WindowManager();
const startMenu = startMenuManager();
window.winmgr = windowManager;
clockManager();

//Explorer open window

    window.addEventListener('message', receiveMessage, false);

    function receiveMessage(event) {
        // Important: Check the origin of the message sender for security

        const receivedData = event.data; // The message data
        if (receivedData.filetype == "html")
        {
             windowManager.createWindow({
            title: 'Nova File Explorer Html Webview',
            icon: './icons/file-icons/html.png',
            content: `<iframe src="`+receivedData.filelocation+`" width="100%" height="100%" style="border:none;"></iframe>`,
            x: 100,
            y: 100,
            width: 800,
            height: 600
            });
          }
        else if (receivedData.filetype == "png") {
            windowManager.createWindow({
            title: 'Preview',
            icon: './icons/file-icons/png.png',
            content: `<img src="`+receivedData.filelocation+`">`,
            x: 100,
            y: 100,
            width: 800,
            height: 600
            });
        }
        else if (receivedData.filetype == "global_application") {
            windowManager.createWindow({
            title: receivedData.windowtitle,
            icon: './icons/file-icons/html.png',
            content: `<iframe src="`+receivedData.location+`" width="100%" height="100%" style="border:none;"></iframe>`,
            x: 100,
            y: 100,
            width: 800,
            height: 600
            });
            
        }
        else if (receivedData.filelocation) {
            windowManager.createWindow({
            title: 'notepad',
            icon: './icons/file-icons/png.png',
            content: '<iframe src="./applications/notepad.html?file=../'+receivedData.filelocation+'" width="100%" height="100%" style="border:none;"></iframe>',
            x: 100,
            y: 100,
            width: 800,
            height: 600
            });
            
        }
        
        // Process the receivedData
    }

window.addEventListener("DOMContentLoaded", () => {


  const progressEl = document.getElementById("load-progress");
  const logEl = document.getElementById("log-text");
  const setupEl = document.getElementById("setup-screen");
  const lockEl = document.getElementById("wt9-lock");
  const desktopEl = document.getElementById("desktop");
  const downloadEl = document.getElementById("download-progress");
  const loader = new ContentLoader("webtop-cache-v1", progressEl, logEl, setupEl, lockEl, desktopEl,downloadEl);
  //loader.loadAssets("/assets.json");
  
});


function updateBatteryUI(level, charging) {
  const percent = Math.round(level * 100);
  const textEl = document.getElementById("battery-text");

  // update text
  textEl.textContent = percent + "%";

  // hide all battery icons first
  document.querySelectorAll(".battery-icon").forEach(icon => {
    icon.style.display = "none";
  });

  // show correct icon based on percent zones
  if (percent >= 76 && percent <= 100) {
    document.getElementById("batt-full").style.display = "block";
  } else if (percent >= 51 && percent <= 75) {
    document.getElementById("batt-3quart").style.display = "block";
  } else if (percent >= 26 && percent <= 50) {
    document.getElementById("batt-half").style.display = "block";
  } else if (percent >= 0 && percent <= 25) {
    document.getElementById("batt-quarter").style.display = "block";
  }

  // add ⚡ if charging
  if (charging) {
    textEl.textContent += " ⚡";
  }
}

window.addEventListener("offline", (e) => {
  document.getElementById("net-text").innerText = "Offline";
});

window.addEventListener("online", (e) => {
document.getElementById("net-text").innerText = "Online";
});

// Try to use the Battery API
if ("getBattery" in navigator) {
  navigator.getBattery().then(battery => {
    // initial update
    updateBatteryUI(battery.level, battery.charging);

    // update on changes
    battery.addEventListener("levelchange", () => {
      updateBatteryUI(battery.level, battery.charging);
    });
    battery.addEventListener("chargingchange", () => {
      updateBatteryUI(battery.level, battery.charging);
    });
  });
} else {
  // fallback demo (simulate battery drain)
  let fakeLevel = 1.0;
  setInterval(() => {
    fakeLevel -= 0.05;
    if (fakeLevel < 0) fakeLevel = 1.0;
    updateBatteryUI(fakeLevel, false);
  }, 3000);
}

if (localStorage.getItem("background")) {
      const targetDiv = window.parent.document.getElementById('desktop');
          if (targetDiv) {
            targetDiv.style.backgroundImage = localStorage.getItem("background");
          }
}
if (localStorage.getItem("accent_color")) {
        const taskbar = window.parent.document.getElementById('taskbar');
        if (taskbar) {
          taskbar.style.background = localStorage.getItem("accent_color");
        }
}
 window.addEventListener("message", (event) => {
            if (event.data?.type === "toast" && typeof event.data.line === "string" && typeof event.data.type === "string") {
                window.toasty.show(event.data.line,{type: event.data.type})
            }
        });
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
function openPopup(url, windowName, features) {
  window.open(url, windowName, features);
}


document.getElementById('search-button').addEventListener('click', () => {
  const query = document.getElementById('taskbar-input').value;

  if (query.includes("webtop://")) {
    //Webtop Links
    const wturl = "webtop://"
    var wtcontent = ""
    if (query == wturl+"tw-extension") {
      wtcontent = `<iframe src="./applications/wttw.html" width="100%" height="100%" style="border:none;"></iframe>`
        

    }
    else if (query == wturl+"america") {
      wtcontent = `
      <style>
      .window-content {
      background-image: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9DMNTPDfZu9sDvTYHXmKf4tqe68I4ZHON6A&s")
      }
      .bounds {
  border: 5px red solid;
  width: 200px;
  height: 300px;
}

@keyframes hor-movement {
  from {
    margin-left: 0%;
  }
  to {
    margin-left: 100%;
  }
}

@keyframes ver-movement {
  from {
    margin-top: 0%;
  }
  to {
    margin-top: 100%;
  }
}

.eagleimage {
  animation-name: hor-movement, ver-movement;
  animation-duration: 3.141s, 1.414s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: linear;
}
      </style>
      <img class="eagleimage" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2tPmjRPauwDUb-vBjy909E7n-k5Ni9TdwyQ&s">

      <audio src="https://nationalanthems.info/wp-content/plugins/mp3-jplayer/download.php?mp3=loc%2Fus.mp3&pID=0" autoplay></audio>
      `
    }
    else if (query == wturl+"webtop-urls") {
      wtcontent = `
      <ul>
       <li>${wturl}tw-extension</li>
       <li>${wturl}webtop-urls</li>
       <li>${wturl}america</li>
      </ul>
      `
    }
    else {
      wtcontent = `<h1>404</h1>`
    }

      windowManager.createWindow({
          title: `${query}`,
          content: wtcontent,
          x: 200,
          y: 150,
          width: 800,
          height: 600
      });
  }
  else {
        windowManager.createWindow({
          title: `Search: ${query}`,
          content: `<iframe src="${query}" width="100%" height="100%" style="border:none;"></iframe>`,
          x: 200,
          y: 150,
          width: 800,
          height: 600
      });
  
  }
});

if (!localStorage.getItem("setup"))
{
   windowManager.createWindow({
  title: 'Setup',
  icon: './WebTop4.png',
  content: `<iframe src="./applications/setup.html" width="100%" height="100%" style="border:none;"></iframe>`,
  x: 100,
  y: 100,
  width: 800,
  height: 600
});
localStorage.setItem("setup",true);
}

if (!localStorage.getItem("viewedNotesForWebtop"+OSVersion))
{
   windowManager.createWindow({
  title: 'Patch Notes for Webtop '+OSVersion,
  icon: './WebTop4.png',
  content: `<iframe src="./applications/update-notes.html" width="100%" height="100%" style="border:none;"></iframe>`,
  x: 200,
  y: 100,
  width: 800,
  height: 600
});
localStorage.setItem("viewedNotesForWebtop"+OSVersion,true)
}


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