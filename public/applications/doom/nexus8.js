(function() {
    'use strict';

    function toKebabCase(str) {
      return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
    }

    function varNameToSelector(name) {
      if (name.startsWith('$')) return '#' + name.slice(1);
      if (name.startsWith('_')) return '.' + name.slice(1);
      return name;
    }

    function objectToCss(selector, obj) {
      let css = `${selector} {\n`;
      for (const key in obj) {
        css += `  ${toKebabCase(key)}: ${obj[key]};\n`;
      }
      css += `}\n`;
      return css;
    }

    function processJStyle(code) {
      const scope = new Proxy({}, {
        has(target, key) {
          return true;
        },
        get(target, key) {
          if (!(key in target)) {
            target[key] = {};
          }
          return target[key];
        },
        set(target, key, value) {
          target[key] = value;
          return true;
        }
      });

      try {
        new Function("with(this) { " + code + " }").call(scope);
      } catch (err) {
        console.error("[JStyle] Error evaluating code:", err);
        return "";
      }

      let finalCss = "";
      for (const key in scope) {
        if (typeof scope[key] === "object") {
          finalCss += objectToCss(varNameToSelector(key), scope[key]);
        }
      }
      return finalCss;
    }

    async function loadJStyle() {
      const inlineTags = document.querySelectorAll('jstyle');
      let cssOutput = "";

      inlineTags.forEach(tag => {
        cssOutput += processJStyle(tag.textContent);
        tag.remove();
      });

      if (cssOutput.trim()) {
        const styleEl = document.createElement("style");
        styleEl.textContent = cssOutput;
        document.head.appendChild(styleEl);
      }
    }

    if (document.readyState !== "loading") {
      loadJStyle();
      console.log("Thank you for using Nexus8")
    } else {
      document.addEventListener("DOMContentLoaded", loadJStyle);
    }
  })();