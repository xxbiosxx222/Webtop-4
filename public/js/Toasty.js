// js/Toasty.js
export default class Toasty {
    /**
     * @param {string} position - "top-left" | "top-right" | "bottom-left" | "bottom-right"
     * @param {object} options
     *   basePath: string - relative path from current HTML page to project root
     */
    constructor(position = "bottom-right", { basePath = "" } = {}) {
      this.basePath = basePath; // used to resolve sounds
      this.container = document.createElement("div");
      this.container.className = "toasty-container";
      document.body.appendChild(this.container);
  
      this.setPosition(position);
  
      // Inject default styles
      const style = document.createElement("style");
      style.textContent = `
        .toasty-container {
          position: fixed;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 9999;
        }
        .toasty {
          background: rgba(0, 0, 0, 0.85);
          color: #fff;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.4s ease, fadeOut 0.4s ease 4.6s forwards;
          font-family: sans-serif;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .toasty.success { background: #28a745; }
        .toasty.error   { background: #dc3545; }
        .toasty.info    { background: #007bff; }
        .toasty.warning { background: #ffc107; color: #000; }
        .toasty.critical { background: #6610f2; }
  
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOut {
          to   { opacity: 0; transform: translateX(100%); }
        }
      `;
      document.head.appendChild(style);
  
      // Unlock AudioContext on first user gesture
      this.audioCtx = null;
      document.addEventListener("click", () => {
        if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }, { once: true });
  
      // Default sound map
      this.soundMap = {
        default: "os/sound/notification.wav",
        info: "os/sound/notification_2.wav",
        alert: "os/sound/notification_3.wav",
        warning: "os/sound/notification_4.wav",
        critical: "os/sound/notification_5.wav",
      };
    }
  
    setPosition(position) {
      const c = this.container.style;
      c.top = c.bottom = c.left = c.right = "auto";
      switch (position) {
        case "top-left":    c.top = "20px"; c.left = "20px"; break;
        case "top-right":   c.top = "20px"; c.right = "20px"; break;
        case "bottom-left": c.bottom = "20px"; c.left = "20px"; break;
        default:            c.bottom = "20px"; c.right = "20px"; // bottom-right
      }
    }
  
    playSound(src) {
      if (!this.audioCtx) return;
      const audio = new Audio(src);
      audio.play().catch(() => {});
    }
  
    /**
     * Show a toast notification
     * @param {string} message - Message text
     * @param {object} options
     *   type: "default" | "info" | "alert" | "warning" | "critical" | "custom"
     *   duration: milliseconds
     *   sound: boolean
     *   customSound: filename from os/sound (required if type==="custom")
     *   style: object for inline CSS
     */
    show(message, { type = "default", duration = 5000, sound = true, customSound = "", style = {} } = {}) {
      const toast = document.createElement("div");
      toast.className = "toasty " + (type === "custom" ? "" : type);
      toast.textContent = message;
  
      Object.assign(toast.style, style);
      this.container.appendChild(toast);
  
      if (sound) {
        let src;
        if (type === "custom" && customSound) src = `${this.basePath}os/sound/${customSound}`;
        else src = `${this.basePath}${this.soundMap[type] || this.soundMap.default}`;
        this.playSound(src);
      }
  
      setTimeout(() => toast.remove(), duration);
    }
  }
  
  