export class ContentLoader {
  constructor(cacheName = "webtop-cache-v1", progressEl, logEl, setupEl, lockEl, desktopEl) {
    this.cacheName = cacheName;
    this.progressEl = progressEl;
    this.logEl = logEl;
    this.setupEl = setupEl;   // #setup-screen
    this.lockEl = lockEl;     // #wt9-lock
    this.desktopEl = desktopEl; // #desktop

    this.username = localStorage.getItem("webtop-username") || "";
    this.pin = localStorage.getItem("webtop-pin") || "";
    this.selectedWallpaper = localStorage.getItem("webtopWallpaper") || null;
    this.selectedAccent = localStorage.getItem("webtopAccent") || null;

    // preload sounds
    this.typingSound = new Audio('./os/sound/deck_ui_typing.wav');
    this.typingSound.volume = 0.5;

    this.slideAudio = './os/sound/deck_ui_side_menu_fly_in.wav';
    this.welcomeAudio = './os/sound/welcome_back.wav';
    this.errorAudio = './os/sound/confirmation_negative.wav';
  }

  async loadAssets(manifestUrl = "/assets.json") {
    const cache = await caches.open(this.cacheName);
    const res = await fetch(manifestUrl);
    const files = await res.json();
    let loaded = 0;

    for (const file of files) {
      const match = await cache.match(file);
      if (!match) {
        try {
          const response = await fetch(file);
          if (response.ok) {
            await cache.put(file, response.clone());
            this.updateUI(++loaded, files.length, file);
          }
        } catch (err) {
          console.error(`Error caching ${file}`, err);
        }
      } else {
        this.updateUI(++loaded, files.length, file, true);
      }
    }

    this.finishCacheUI();
  }

  updateUI(loaded, total, file, cached = false) {
    if (this.progressEl) {
      const pct = Math.floor((loaded / total) * 100);
      this.progressEl.value = pct;
      this.progressEl.textContent = `${pct}%`;
    }
    if (this.logEl) {
      this.logEl.textContent = cached
        ? `Cached already: ${file}`
        : `Caching: ${file} (${loaded}/${total})`;
    }
  }

  finishCacheUI() {
    if (this.logEl) this.logEl.textContent = "All assets cached!";
    setTimeout(() => {

      document.getElementById("cacher").style.display = "none";
      const username = localStorage.getItem('webtop-username');
      const pin = localStorage.getItem('webtop-pin');
  
      if (username) {
        if (pin) {
          // username + pin → show lock screen
          this.initLockScreen();
        } else {
          // username only → skip lock, go straight to desktop
          this.showDesktop();
        }
      } else {
        // first-time → setup wizard
        this.setupEl.classList.add('fade-in');
        this.setupEl.style.display = 'flex';
        this.initSetupWizard();
      }
    }, 800);
  }
  

  // ------------------- Setup Wizard -------------------
  initSetupWizard() {
    const steps = Array.from(this.setupEl.querySelectorAll(".step"));
    let current = 0;

    // attach typing sounds
    this.attachTypingSound('#username, #password');

    const showStep = (index) => {
      new Audio(this.slideAudio).play();
      if (index === current) return;
      const outgoing = steps[current];
      const incoming = steps[index];

      outgoing.classList.remove("active");
      outgoing.classList.add("prev");

      const cleanup = () => {
        outgoing.classList.remove("prev");
        outgoing.removeEventListener("animationend", cleanup);
      };
      outgoing.addEventListener("animationend", cleanup);

      incoming.classList.add("active");
      incoming.scrollTop = 0;
      current = index;
    };

    // next buttons
    this.setupEl.querySelectorAll("[data-next]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (current === 0) {
          const usernameInput = document.getElementById("username");
          if (!usernameInput.value.trim()) {
            alert("Please enter a username!");
            return;
          }
          this.username = usernameInput.value.trim();
        }
        if (current === 1) {
          const pinInput = document.getElementById("password");
          this.pin = pinInput.value.trim();
        }

        const idx = parseInt(btn.dataset.next, 10) - 1;
        if (!isNaN(idx)) showStep(idx);
      });
    });

    // finish button
    this.setupEl.querySelector("#finishBtn")?.addEventListener("click", () => {
      localStorage.setItem("webtop-username", this.username);
      localStorage.setItem("webtop-pin", this.pin);
      if (this.selectedWallpaper) localStorage.setItem("webtopWallpaper", this.selectedWallpaper);
      if (this.selectedAccent) localStorage.setItem("webtopAccent", this.selectedAccent);

      // show desktop
      this.showDesktop();

      // fade out wizard & play welcome
      this.setupEl.classList.add("fade-out");
      setTimeout(() => {
        this.setupEl.style.display = "none";
        new Audio(this.welcomeAudio).play();
        document.getElementById("loader-screen").style.display = "none";
      }, 500);
    });
  }

  // ------------------- Lock Screen -------------------
  initLockScreen() {
    if (!this.lockEl) return;
    const passInput = this.lockEl.querySelector('#passcode');
    const storedPin = localStorage.getItem('webtop-pin');

    this.lockEl.style.display = 'flex';
    this.lockEl.classList.add('wt9-panel-loadfade');

    // attach typing sound
    this.attachTypingSound('#passcode');

    passInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const entered = passInput.value.trim();
        if (!storedPin || storedPin === entered) {
          // correct pin or no pin set
          this.lockEl.classList.remove('wt9-panel-loadfade');
          this.lockEl.classList.add('wt9-panel-fadeout');

          new Audio(this.welcomeAudio).play();

          setTimeout(() => {
            this.lockEl.style.display = 'none';
            this.showDesktop();
          }, 300); // fadeout matches CSS
        } else {
          new Audio(this.errorAudio).play();
          passInput.value = '';
        }
      }
    });
  }

  // ------------------- Desktop -------------------
  showDesktop() {
    document.getElementById("loader-screen").style.display = "none";
    if (!this.desktopEl) return;
    this.desktopEl.style.display = 'flex';

    const wallpaper = localStorage.getItem('webtopWallpaper');
    if (wallpaper) this.desktopEl.style.backgroundImage = `url('${wallpaper}')`;

    const accent = localStorage.getItem('webtopAccent');
    if (accent) document.documentElement.style.setProperty('--accent-color', accent);
  }

  // ------------------- Typing Sound -------------------
  attachTypingSound(inputSelector) {
    const inputs = document.querySelectorAll(inputSelector);
    inputs.forEach(input => {
      input.addEventListener('keydown', () => {
        const soundClone = this.typingSound.cloneNode();
        soundClone.play().catch(e => console.warn("Audio play blocked", e));
      });
    });
  }
}
