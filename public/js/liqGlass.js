/**
 * LiqGlass - Beautiful Glass Morphism Library
 * A comprehensive JavaScript library for creating stunning glass effects
 * 
 * @version 1.0.0
 * @author LiqGlass Library
 * @license MIT
 */

(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      // CommonJS
      module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
      // AMD
      define(factory);
    } else {
      // Browser globals
      global.LiqGlass = factory();
    }
  }(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
    'use strict';
  
    /**
     * @typedef {Object} GlassConfig
     * @property {number} [blur=12] - Blur intensity in pixels
     * @property {number} [opacity=0.1] - Background opacity
     * @property {number} [borderRadius=16] - Border radius in pixels
     * @property {number} [borderWidth=1] - Border width in pixels
     * @property {number} [borderOpacity=0.2] - Border opacity
     * @property {'none'|'light'|'medium'|'heavy'} [shadowIntensity='medium'] - Shadow intensity
     * @property {boolean} [gradient=false] - Enable gradient background
     * @property {string} [gradientFrom='rgba(255,255,255,0.1)'] - Gradient start color
     * @property {string} [gradientTo='rgba(255,255,255,0.05)'] - Gradient end color
     * @property {boolean} [animated=false] - Enable animations
     * @property {boolean} [hoverEffect=false] - Enable hover effects
     * @property {string} [element='div'] - HTML element type to create
     * @property {string} [className=''] - CSS class name to apply
     */
  
    /**
     * @typedef {Object} GlassPreset
     * @property {string} name - Preset name
     * @property {GlassConfig} config - Preset configuration
     */
  
    /**
     * @typedef {Object} ColorPreset
     * @property {string} name - Color preset name
     * @property {string} gradientFrom - Gradient start color
     * @property {string} gradientTo - Gradient end color
     */
  
    /**
     * LiqGlass - Main library class
     * @class
     */
    class LiqGlass {
      constructor() {
        this.version = '1.0.0';
        this.presets = new Map();
        this.colorPresets = new Map();
        this.svgFilters = new Map();
        this.generatedStyles = new Set();
        this.styleElement = null;
        
        this.initializeDefaultPresets();
        this.initializeColorPresets();
        
        // Initialize CSS if we're in a browser environment
        if (typeof window !== 'undefined') {
          this.initializeCSS();
        }
      }
  
      /**
       * Singleton pattern - ensures only one instance of LiqGlass exists
       * @returns {LiqGlass} The singleton instance
       */
      static getInstance() {
        if (!LiqGlass.instance) {
          LiqGlass.instance = new LiqGlass();
        }
        return LiqGlass.instance;
      }
  
      /**
       * Initialize default glass presets
       * @private
       */
      initializeDefaultPresets() {
        this.presets.set('light', {
          blur: 8,
          opacity: 0.05,
          borderRadius: 12,
          borderWidth: 1,
          borderOpacity: 0.1,
          shadowIntensity: 'light'
        });
  
        this.presets.set('medium', {
          blur: 12,
          opacity: 0.1,
          borderRadius: 16,
          borderWidth: 1,
          borderOpacity: 0.2,
          shadowIntensity: 'medium'
        });
  
        this.presets.set('heavy', {
          blur: 16,
          opacity: 0.15,
          borderRadius: 20,
          borderWidth: 1,
          borderOpacity: 0.3,
          shadowIntensity: 'heavy'
        });
  
        this.presets.set('frosted', {
          blur: 20,
          opacity: 0.2,
          borderRadius: 24,
          borderWidth: 2,
          borderOpacity: 0.4,
          shadowIntensity: 'heavy',
          gradient: true,
          gradientFrom: 'rgba(255,255,255,0.25)',
          gradientTo: 'rgba(255,255,255,0.1)'
        });
  
        this.presets.set('crystal', {
          blur: 24,
          opacity: 0.08,
          borderRadius: 16,
          borderWidth: 1,
          borderOpacity: 0.5,
          shadowIntensity: 'heavy',
          gradient: true,
          gradientFrom: 'rgba(255,255,255,0.2)',
          gradientTo: 'rgba(255,255,255,0.05)'
        });
  
        this.presets.set('bubble', {
          blur: 15,
          opacity: 0.12,
          borderRadius: 50,
          borderWidth: 2,
          borderOpacity: 0.25,
          shadowIntensity: 'medium',
          gradient: true,
          gradientFrom: 'rgba(255,255,255,0.3)',
          gradientTo: 'rgba(255,255,255,0.1)'
        });

        this.presets.set('refraction', {
            filterId: 'lg-dist',
            svg: `
              <svg style="display: none">
                <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
                  <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
                  <feDisplacementMap in="SourceGraphic" in2="blurred" scale="70" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </svg>
            `
          });
          
          this.presets.set('distortion', {
            filterId: 'glass-distortion',
            svg: `
              <svg style="display: none">
                <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
                  <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="1" seed="5" result="turbulence" />
                  <feComponentTransfer in="turbulence" result="mapped">
                    <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
                    <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
                    <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
                  </feComponentTransfer>
                  <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
                  <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lighting-color="white" result="specLight">
                    <fePointLight x="-200" y="-200" z="300" />
                  </feSpecularLighting>
                  <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
                  <feDisplacementMap in="SourceGraphic" in2="softMap" scale="150" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </svg>
            `
          });
          
      }
  
      /**
       * Initialize color presets
       * @private
       */
      initializeColorPresets() {
        const colors = {
          blue: ['rgba(59, 130, 246, 0.2)', 'rgba(37, 99, 235, 0.1)'],
          purple: ['rgba(147, 51, 234, 0.2)', 'rgba(126, 34, 206, 0.1)'],
          green: ['rgba(34, 197, 94, 0.2)', 'rgba(22, 163, 74, 0.1)'],
          pink: ['rgba(236, 72, 153, 0.2)', 'rgba(219, 39, 119, 0.1)'],
          orange: ['rgba(249, 115, 22, 0.2)', 'rgba(234, 88, 12, 0.1)'],
          red: ['rgba(239, 68, 68, 0.2)', 'rgba(220, 38, 38, 0.1)'],
          yellow: ['rgba(251, 191, 36, 0.2)', 'rgba(245, 158, 11, 0.1)'],
          teal: ['rgba(20, 184, 166, 0.2)', 'rgba(13, 148, 136, 0.1)']
        };
  
        Object.entries(colors).forEach(([name, [from, to]]) => {
          this.colorPresets.set(name, { name, gradientFrom: from, gradientTo: to });
        });
      }
  
      /**
       * Initialize CSS styles in the DOM
       * @private
       */
      initializeCSS() {
        if (typeof document === 'undefined') return;
  
        this.styleElement = document.createElement('style');
        this.styleElement.id = 'liqglass-styles';
        this.styleElement.textContent = this.generateBaseCSS();
        document.head.appendChild(this.styleElement);
      }
  
      /**
       * Generate base CSS for the library
       * @returns {string} Base CSS styles
       */
      generateBaseCSS() {
        return `
  /* LiqGlass Library - Base Styles */
  .liqglass-base {
    position: relative;
    overflow: hidden;
    backdrop-filter: var(--liqglass-blur, blur(12px));
    -webkit-backdrop-filter: var(--liqglass-blur, blur(12px));
    background: var(--liqglass-background, rgba(255, 255, 255, 0.1));
    border: var(--liqglass-border-width, 1px) solid var(--liqglass-border-color, rgba(255, 255, 255, 0.2));
    border-radius: var(--liqglass-border-radius, 16px);
    box-shadow: var(--liqglass-shadow, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05));
  }
  
  .liqglass-animated {
    transition: all 0.3s ease-in-out;
  }
  
  .liqglass-hover:hover {
    transform: scale(1.05);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  .liqglass-button {
    cursor: pointer;
    user-select: none;
    transition: transform 0.15s ease-in-out;
    display: inline-block;
    text-align: center;
  }
  
  .liqglass-button:active {
    transform: scale(0.95);
  }
  
  .liqglass-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Utility Classes */
  .liqglass-sm { padding: 0.375rem 0.75rem; font-size: 0.875rem; border-radius: 8px; }
  .liqglass-md { padding: 0.5rem 1rem; border-radius: 12px; }
  .liqglass-lg { padding: 0.75rem 1.5rem; font-size: 1.125rem; border-radius: 20px; }
  
  .liqglass-card { padding: 1.5rem; }
  
  .liqglass-rounded-none { border-radius: 0; }
  .liqglass-rounded-sm { border-radius: 4px; }
  .liqglass-rounded-lg { border-radius: 24px; }
  .liqglass-rounded-xl { border-radius: 32px; }
  .liqglass-rounded-full { border-radius: 9999px; }
  
  .liqglass-no-shadow { box-shadow: none; }
  `;
      }
  
      /**
       * Create a glass element with specified configuration
       * @param {GlassConfig} [config={}] - Glass configuration options
       * @returns {HTMLElement} The created glass element
       * @throws {Error} When not in browser environment
       */
      createGlassElement(config = {}) {
        if (typeof document === 'undefined') {
          throw new Error('createGlassElement can only be used in browser environment');
        }
  
        const element = document.createElement(config.element || 'div');
        this.applyGlassStyles(element, config);
        
        if (config.className) {
          element.className = config.className;
        }
  
        return element;
      }
  
      /**
       * Apply glass styles to an existing element
       * @param {HTMLElement} element - The element to apply styles to
       * @param {GlassConfig} [config={}] - Glass configuration options
       */
      applyGlassStyles(element, config = {}) {
        const styles = this.generateInlineStyles(config);
                // Handle SVG filter presets
        if (config.preset) {
            const preset = this.presets.get(config.preset);
            if (preset && preset.filterId && preset.svg) {
            // Inject SVG if not already in DOM
            if (!this.svgFilters.has(preset.filterId)) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = preset.svg.trim();
                const svg = wrapper.firstChild;
                document.body.appendChild(svg);
                this.svgFilters.set(preset.filterId, svg);
            }
            // Apply the filter
            element.style.filter = `url(#${preset.filterId})`;
        
            // Auto-cleanup if removed
            const observer = new MutationObserver(() => {
                if (!document.body.contains(element)) {
                this.cleanupFilter(preset.filterId);
                observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            }
        }
  
        Object.assign(element.style, styles);
        
        // Add base class
        element.classList.add('liqglass-base');
        
        // Add optional classes
        if (config.animated) {
          element.classList.add('liqglass-animated');
        }
        
        if (config.hoverEffect) {
          element.classList.add('liqglass-hover');
        }
      }
  
      /**
       * Generate inline styles for a glass configuration
       * @param {GlassConfig} [config={}] - Glass configuration options
       * @returns {Object} CSS style object
       */
      generateInlineStyles(config = {}) {
        const {
          blur = 12,
          opacity = 0.1,
          borderRadius = 16,
          borderWidth = 1,
          borderOpacity = 0.2,
          shadowIntensity = 'medium',
          gradient = false,
          gradientFrom = 'rgba(255,255,255,0.1)',
          gradientTo = 'rgba(255,255,255,0.05)',
        } = config;
  
        const shadowMap = {
          none: 'none',
          light: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          medium: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          heavy: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        };
  
        return {
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          background: gradient 
            ? `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
            : `rgba(255, 255, 255, ${opacity})`,
          border: `${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity})`,
          borderRadius: `${borderRadius}px`,
          boxShadow: shadowMap[shadowIntensity],
          position: 'relative',
          overflow: 'hidden',
        };
      }

      cleanupFilter(filterId) {
        // If no elements are using this filter, remove it
        const stillUsed = [...document.querySelectorAll('*')]
          .some(el => el.style.filter.includes(filterId));
        if (!stillUsed && this.svgFilters.has(filterId)) {
          this.svgFilters.get(filterId).remove();
          this.svgFilters.delete(filterId);
        }
      }

      
      /**
       * Generate CSS class for a glass configuration
       * @param {string} className - CSS class name
       * @param {GlassConfig} [config={}] - Glass configuration options
       * @returns {string} CSS class definition
       */
      generateCSSClass(className, config = {}) {
        const styles = this.generateInlineStyles(config);
        const cssProperties = Object.entries(styles)
          .map(([prop, value]) => {
            const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `  ${kebabProp}: ${value};`;
          })
          .join('\n');
  
        return `.${className} {
  ${cssProperties}
    position: relative;
    overflow: hidden;${config.animated ? '\n  transition: all 0.3s ease-in-out;' : ''}
  }${config.hoverEffect ? `
  
  .${className}:hover {
    transform: scale(1.05);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }` : ''}`;
      }
  
      /**
       * Generate complete CSS for vanilla HTML usage
       * @returns {string} Complete CSS stylesheet
       */
      generateVanillaCSS() {
        let css = this.generateBaseCSS();
  
        // Add preset classes
        for (const [name, config] of this.presets) {
          css += `\n\n${this.generateCSSClass(`liqglass-${name}`, config)}`;
        }
  
        // Add color classes
        for (const [name, colorConfig] of this.colorPresets) {
          css += `\n\n.liqglass-${name} {
    background: linear-gradient(135deg, ${colorConfig.gradientFrom}, ${colorConfig.gradientTo});
  }`;
        }
  
        return css;
      }
  
      /**
       * Add a custom preset
       * @param {string} name - Preset name
       * @param {GlassConfig} config - Glass configuration
       */
      addPreset(name, config) {
        this.presets.set(name, config);
      }
  
      /**
       * Get a preset configuration
       * @param {string} name - Preset name
       * @returns {GlassConfig|undefined} Preset configuration
       */
      getPreset(name) {
        return this.presets.get(name);
      }
  
      /**
       * Get all available presets
       * @returns {Map<string, GlassConfig>} All presets
       */
      getPresets() {
        return new Map(this.presets);
      }
  
      /**
       * Add a custom color preset
       * @param {string} name - Color preset name
       * @param {string} gradientFrom - Gradient start color
       * @param {string} gradientTo - Gradient end color
       */
      addColorPreset(name, gradientFrom, gradientTo) {
        this.colorPresets.set(name, { name, gradientFrom, gradientTo });
      }
  
      /**
       * Get a color preset
       * @param {string} name - Color preset name
       * @returns {ColorPreset|undefined} Color preset
       */
      getColorPreset(name) {
        return this.colorPresets.get(name);
      }
  
      /**
       * Get all available color presets
       * @returns {Map<string, ColorPreset>} All color presets
       */
      getColorPresets() {
        return new Map(this.colorPresets);
      }
  
      /**
       * Update CSS in the DOM (for dynamic changes)
       */
      updateCSS() {
        if (this.styleElement && typeof document !== 'undefined') {
          this.styleElement.textContent = this.generateBaseCSS();
        }
      }
  
      /**
       * Generate HTML template with glass effects
       * @param {string} [title='LiqGlass Demo'] - Page title
       * @returns {string} Complete HTML template
       */
      generateHTMLTemplate(title = 'LiqGlass Demo') {
        return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
          body {
              margin: 0;
              padding: 40px 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              color: white;
          }
          
          .container {
              max-width: 1200px;
              margin: 0 auto;
          }
          
          .grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 2rem;
              margin: 2rem 0;
          }
  
          ${this.generateVanillaCSS()}
      </style>
  </head>
  <body>
      <div class="container">
          <header class="liqglass-base liqglass-frosted liqglass-card liqglass-animated" style="text-align: center; margin-bottom: 3rem;">
              <h1 style="margin: 0 0 1rem 0; font-size: 3rem;">LiqGlass</h1>
              <p style="margin: 0; font-size: 1.2rem; opacity: 0.9;">Beautiful glass morphism effects</p>
          </header>
  
          <div class="grid">
              <div class="liqglass-base liqglass-light liqglass-card liqglass-animated liqglass-hover">
                  <h3>Light Glass</h3>
                  <p>Subtle glass effect with minimal blur.</p>
              </div>
  
              <div class="liqglass-base liqglass-medium liqglass-card liqglass-animated liqglass-hover">
                  <h3>Medium Glass</h3>
                  <p>Balanced glass effect for most use cases.</p>
              </div>
  
              <div class="liqglass-base liqglass-heavy liqglass-card liqglass-animated liqglass-hover">
                  <h3>Heavy Glass</h3>
                  <p>Strong glass effect with intense blur.</p>
              </div>
  
              <div class="liqglass-base liqglass-blue liqglass-card liqglass-animated liqglass-hover">
                  <h3>Colored Glass</h3>
                  <p>Beautiful gradients with color presets.</p>
              </div>
          </div>
      </div>
  
      <script>
          // Initialize LiqGlass library
          const liqGlass = new LiqGlass();
          console.log('LiqGlass v' + liqGlass.getVersion() + ' initialized');
  
          // Example: Create a dynamic glass element
          const dynamicGlass = liqGlass.createGlassElement({
              blur: 18,
              opacity: 0.2,
              borderRadius: 25,
              gradient: true,
              gradientFrom: 'rgba(147, 51, 234, 0.3)',
              gradientTo: 'rgba(79, 70, 229, 0.1)',
              animated: true,
              hoverEffect: true,
              className: 'liqglass-card'
          });
  
          dynamicGlass.innerHTML = '<h3>Dynamic Glass</h3><p>Created with JavaScript!</p>';
          dynamicGlass.style.marginTop = '2rem';
          document.querySelector('.container').appendChild(dynamicGlass);
      </script>
  </body>
  </html>`;
      }
  
      /**
       * Get library version
       * @returns {string} Library version
       */
      getVersion() {
        return this.version;
      }
  
      /**
       * Get library info
       * @returns {Object} Library information
       */
      getInfo() {
        return {
          name: 'LiqGlass',
          version: this.version,
          description: 'Beautiful glass morphism effects for web applications',
          presets: Array.from(this.presets.keys()),
          colorPresets: Array.from(this.colorPresets.keys()),
        };
      }
  
      /**
       * Destroy the library instance (cleanup)
       */
      destroy() {
        if (this.styleElement && typeof document !== 'undefined') {
          document.head.removeChild(this.styleElement);
          this.styleElement = null;
        }
        this.presets.clear();
        this.colorPresets.clear();
        this.generatedStyles.clear();
      }
    }
  
    // Static property for singleton
    LiqGlass.instance = null;
  
    // Export singleton instance and class
    const liqGlass = LiqGlass.getInstance();
  
    // Export for different module systems
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = LiqGlass;
      module.exports.default = liqGlass;
      module.exports.LiqGlass = LiqGlass;
      module.exports.liqGlass = liqGlass;
    }
  
    // Browser global
    if (typeof window !== 'undefined') {
      window.LiqGlass = LiqGlass;
      window.liqGlass = liqGlass;
    }
  
    return LiqGlass;
  }));
  
  /**
   * Usage Examples:
   * 
   * // Basic usage
   * const glass = new LiqGlass();
   * const element = glass.createGlassElement({
   *   blur: 15,
   *   opacity: 0.2,
   *   borderRadius: 20
   * });
   * 
   * // Using singleton
   * const glassSingleton = LiqGlass.getInstance();
   * glassSingleton.applyGlassStyles(document.getElementById('myDiv'), {
   *   preset: 'frosted'
   * });
   * 
   * // Generate CSS
   * const css = glass.generateVanillaCSS();
   * 
   * // Create custom presets
   * glass.addPreset('custom', {
   *   blur: 25,
   *   opacity: 0.3,
   *   gradient: true,
   *   gradientFrom: 'rgba(255, 0, 0, 0.2)',
   *   gradientTo: 'rgba(255, 100, 100, 0.1)'
   * });
   */
  