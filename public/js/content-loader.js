export class ContentLoader {
  constructor(cacheName = "webtop-cache-v1", progressEl, logEl, setupEl, lockEl, desktopEl, downloadBarEl) {
    this.cacheName = cacheName;
    this.progressEl = progressEl;
    this.logEl = logEl;
    this.setupEl = setupEl;   // #setup-screen
    this.lockEl = lockEl;     // #wt9-lock
    this.desktopEl = desktopEl; // #desktop
    this.downloadBarEl = downloadBarEl; // This is where the individual file download progress will go!
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
          if (this.downloadBarEl) {
            this.downloadBarEl.style.display = 'block';
            this.downloadBarEl.textContent = `Downloading ${file}...`;
            this.downloadBarEl.value = 0;
            this.downloadBarEl.max = 100; // Assume a percentage scale
          }

          const response = await fetch(file);
          if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

          // --- Begin streaming progress implementation ---
          const reader = response.body.getReader();
          const contentLength = response.headers.get('content-length');
          const total = parseInt(contentLength, 10);
          let bytesDownloaded = 0;
          const chunks = [];

          // Display the individual file's download bar
          if (this.downloadBarEl) {
            this.downloadBarEl.textContent = `Downloading ${file}...`;
            this.downloadBarEl.value = 0;
            if (total) this.downloadBarEl.max = total; // Set max value if content-length is available
            else this.downloadBarEl.removeAttribute('value'); // indeterminate progress bar
          }

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break; // File download is complete
            }
            chunks.push(value);
            bytesDownloaded += value.length;
            
            // Update the individual file's progress bar dynamically
            if (this.downloadBarEl && total) {
              this.downloadBarEl.value = bytesDownloaded;
            }
          }

          const responseData = new Blob(chunks);
          await cache.put(file, new Response(responseData));
          // --- End streaming progress implementation ---
          
          this.updateUI(++loaded, files.length, file);

        } catch (err) {
          console.error(`Error caching ${file}`, err);
          if (this.downloadBarEl) {
            this.downloadBarEl.textContent = `Failed to download ${file}`;
            setTimeout(() => { this.downloadBarEl.style.display = 'none'; }, 2000);
          }
        } finally {
          // Hide the download bar once the file is processed
          if (this.downloadBarEl) {
            this.downloadBarEl.style.display = 'none';
          }
        }
      } else {
        this.updateUI(++loaded, files.length, file, true);
        if (this.downloadBarEl) {
            this.downloadBarEl.style.display = 'none';
        }
      }
    }

    this.finishCacheUI();
    if (this.downloadBarEl) {
        this.downloadBarEl.style.display = 'none';
    }
  }


  updateUI(loaded, total, file, cached = false) {
    if (this.progressEl) {
      const pct = Math.floor((loaded / total) * 100);
      this.progressEl.value = pct;
      this.progressEl.textContent = `${pct}%`; // Assuming progressEl is a <progress> tag or similar
    }
    if (this.logEl) {
      this.logEl.textContent = cached
        ? `Cached already: ${file}`
        : `Caching: ${file} (${loaded}/${total})`;
    }
    // The downloadBarEl would ideally be updated *during* the fetch for a specific file.
    // For now, we'll ensure it's hidden or shows a completion message here.
    if (this.downloadBarEl && !cached) {
        // If downloadBarEl is meant for individual file progress, it would be managed
        // directly in the `loadAssets` loop for the active file.
        // Once a file is successfully cached, we should hide or reset it.
        this.downloadBarEl.style.display = 'none'; // Hide after a file is successfully cached
    }
  }

  finishCacheUI() {
    if (this.logEl) this.logEl.textContent = "All assets cached!";
    // Ensure download bar is definitively hidden at the end of all caching
    if (this.downloadBarEl) {
        this.downloadBarEl.style.display = 'none';
    }
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
