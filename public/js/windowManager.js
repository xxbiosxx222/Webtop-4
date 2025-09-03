
export class WindowManager {
  constructor() {
    this.windows = new Map();
    this.activeWindow = null;
    this.windowIdCounter = 0;
    this.taskList = window.parent.document.getElementById('task-list');
  }
  


  createWindow({ title, icon, content, x, y, width, height }) {
    const id = this.windowIdCounter++;
    const liqGlass = new LiqGlass();
    const windowEl = window.parent.document.createElement('div');
    windowEl.className = 'window';
    windowEl.style.width = `${width}px`;
    windowEl.style.height = `${height}px`;
    windowEl.style.left = `${x}px`;
    windowEl.style.top = `${y}px`;
    const windowCreationAudio = new Audio('./os/sound/deck_ui_show_modal.wav');
    windowCreationAudio.play();
    const header = window.parent.document.createElement('div');
    header.className = 'window-header';

        function updateAccent() {
          header.style.backgroundColor = window.getAccent("rgba(50, 50, 50, 0.9)");
          requestAnimationFrame(updateAccent);
        }
        updateAccent();

    const titleEl = window.parent.document.createElement('div');
    titleEl.className = 'window-title';
    if (icon) {
      this.createWindowIcon(icon);
    }
    const titleText = window.parent.document.createElement('span');
    titleText.textContent = title;
    titleEl.appendChild(titleText);

    const controls = window.parent.document.createElement('div');
    controls.className = 'window-controls';

    const shadeBtn = this.createWindowButton(`➕`);
    const minimizeBtn = this.createWindowButton('➖');
    const maximizeBtn = this.createWindowButton(`➕`);
    const closeBtn = this.createWindowButton(`❌`)

    const shadeBtn2 = this.createWindowIcon(`./icons/controls/shade_up.svg`);
    const minimizeBtn2 = this.createWindowIcon('./icons/controls/minus.svg');
    const maximizeBtn2 = this.createWindowIcon(`./icons/controls/maximize-1.svg`);
    const closeBtn2 = this.createWindowIcon(`./icons/controls/x.svg`)

    controls.append(minimizeBtn2, maximizeBtn2);
    header.append(closeBtn2, titleEl, controls);

    const contentEl = window.parent.document.createElement('div');
    contentEl.className = 'window-content';
    contentEl.innerHTML = content;

    windowEl.append(header,contentEl);
    window.parent.document.getElementById('windows').appendChild(windowEl);
  

    const taskButton = window.parent.document.createElement('button');
    taskButton.className = 'task-button';
    taskButton.textContent = title;
    this.taskList.appendChild(taskButton);

    // Store window data
    const windowData = {
      element: windowEl,
      taskButton,
      title,
      isMinimized: false
    };

    this.windows.set(id, windowData);

    this.setupWindowEvents(id, windowEl, header);
    this.setupTaskButtonEvents(id, taskButton);
    this.setupWindowControls(id, closeBtn2, maximizeBtn2, minimizeBtn2, shadeBtn2);

    this.activateWindow(id);

    return id;
  }
  setupWindowEvents(id, windowEl, header) {
    let mouseDown = false;
    let clickDifferenceX = 0;
    let clickDifferenceY = 0;

    const iframe = windowEl.querySelector('iframe');

    windowEl.addEventListener('mousedown', () => this.activateWindow(id));

    header.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only handle left-clicks
      mouseDown = true;
      e.preventDefault();

      if (iframe) iframe.style.pointerEvents = 'none';

      const rect = windowEl.getBoundingClientRect();
      clickDifferenceX = e.clientX - rect.left;
      clickDifferenceY = e.clientY - rect.top;
    });

    header.addEventListener('dblclick', () => this.maximizeWindow(id));


    window.parent.document.addEventListener('mousemove', (e) => {
      if (!mouseDown) return;
      e.preventDefault();
      windowEl.style.left = `${e.clientX - clickDifferenceX}px`;
      windowEl.style.top = `${e.clientY - clickDifferenceY}px`;
    });

    window.parent.document.addEventListener('mouseup', () => {
      if (!mouseDown) return;
      mouseDown = false;

      if (iframe) iframe.style.pointerEvents = 'auto';
    });
  }

  setupTaskButtonEvents(id, taskButton) {
    taskButton.addEventListener('click', () => {
      const win = this.windows.get(id);
      if (win.isMinimized) {
        this.restoreWindow(id);
      } else if (this.activeWindow === id) {
        this.minimizeWindow(id);
      } else {
        this.activateWindow(id);
      }
    });
  }

  setupWindowControls(id, Btn1, Btn2, Btn3, Btn4) {
    Btn2.addEventListener('click', () => this.maximizeWindow(id));
    Btn3.addEventListener('click', () => this.minimizeWindow(id));
    Btn1.addEventListener('click', () => this.closeWindow(id));
    Btn4.addEventListener('click', () => this.shadeWindow(id));
  }

  createWindowButton(text) {
    const button = window.parent.document.createElement('button');
    button.className = 'window-button';
    button.textContent = text;
    return button;
  }
  createWindowIcon(text) {
    const button = window.parent.document.createElement('button');
    button.className = 'window-button';
    const image = window.parent.document.createElement('img');
    image.className = 'window-icon';
    image.src = text;
    button.appendChild(image);
    return button;
  }


  activateWindow(id) {
    this.windows.forEach((win, winId) => {
      if (winId === id) {
        win.element.style.zIndex = '100';
        win.taskButton.classList.add('active');
      } else {
        win.element.style.zIndex = '1';
        win.taskButton.classList.remove('active');
      }
    });
    this.activeWindow = id;
    
  }

  minimizeWindow(id) {
    const win = this.windows.get(id);
    win.element.style.display = 'none';
    win.isMinimized = true;
    win.taskButton.classList.remove('active');
    const windowMinimizeAudio = new Audio('./os/sound/deck_ui_side_menu_fly_out.wav');
    windowMinimizeAudio.play();
  }

shadeWindow(id) {
  const win = this.windows.get(id);
  const windowEl = win.element;

  if (!windowEl.dataset.originalHeight) {
    windowEl.dataset.originalHeight = windowEl.offsetHeight + 'px';
  }

  const isShaded = windowEl.classList.contains('shaded');

  const windowIcons = windowEl.querySelectorAll('img.window-icon');
  if (windowIcons.length <= 2) return;
  const shadeImg = windowIcons[2];

  if (isShaded) {
    windowEl.style.height = windowEl.dataset.originalHeight;
    windowEl.classList.remove('shaded');
    shadeImg.src = './icons/controls/shade_up.svg';
  } else {
    windowEl.style.height = '32px';
    windowEl.classList.add('shaded');
    shadeImg.src = './icons/controls/shade_down.svg';
  }
}

  restoreWindow(id) {
    const win = this.windows.get(id);
    win.element.style.display = 'flex';
    win.isMinimized = false;
    this.activateWindow(id);
    const windowMinimizeAudio = new Audio('./os/sound/deck_ui_side_menu_fly_in.wav');
    windowMinimizeAudio.play();
  }

  maximizeWindow(id) {
    const win = this.windows.get(id);
    const isMaximized = win.element.style.width === '100vw';
    const root = document.documentElement; 
    const windowMaximizeAudio = new Audio('./os/sound/deck_ui_into_game_detail.wav');
    windowMaximizeAudio.play();
    if (isMaximized) {
      win.element.style.width = win.prevWidth || '400px';
      win.element.style.height = win.prevHeight || '300px';
      win.element.style.left = win.prevLeft || '0px';
      win.element.style.top = win.prevTop || '0px';
      root.style.setProperty('--taskbar-scale', '1.0');
    } else {
      win.prevWidth = win.element.style.width;
      win.prevHeight = win.element.style.height;
      win.prevLeft = win.element.style.left;
      win.prevTop = win.element.style.top;

      win.element.style.width = '100vw';
      win.element.style.height = `calc(100vh - var(--taskbar-height))`;
      win.element.style.left = '0';
      win.element.style.top = '0';
      root.style.setProperty("--taskbar-scale",0.3);
    }
  }

  closeWindow(id) {
    const win = this.windows.get(id);
    //append closing to class
    win.element.classList.add('closing');
    const windowCloseAudio = new Audio('./os/sound/deck_ui_hide_modal.wav');
    windowCloseAudio.play();
    setTimeout(() => {
      win.element.remove();
      win.taskButton.remove();
      this.windows.delete(id);
    }, 300);
  }
}