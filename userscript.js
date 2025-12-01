// ==UserScript==
// @name         Manga Reader Optimizer & Throttler (Battery Saver)
// @namespace    https://github.com/therysin
// @version      1.2
// @description  Sets background to black, kills CSS animations, and throttles JS timers to save battery.
// @author       Therysin
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // =========================================================
    // 1. CPU SAVER: Throttle Animations to 1 FPS , width fixes
    // =========================================================
    window.requestAnimationFrame = function(callback) {
        return window.setTimeout(function() {
            callback(Date.now());
        }, 1000);
    };

    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };

    

    // =========================================================
    // 2. CPU SAVER: Clamp High-Frequency Timers
    // =========================================================
    // Many ads and trackers run loops every 10-50ms. 
    // This forces them to wait at least 1 second (1000ms).
    const originalSetInterval = window.setInterval;
    window.setInterval = function(func, delay, ...args) {
        if (delay < 1000) {
            delay = 1000;
        }
        return originalSetInterval(func, delay, ...args);
    };

    // =========================================================
    // 3. FIT WIDTH & AUTO-ZOOM 
    // =========================================================
 
    // A. Force the browser to render as a mobile device (width=device-width)
    // This stops the page from loading as a giant "Desktop" site.
    // let viewport = document.querySelector("meta[name=viewport]");
    // if (!viewport) {
    //     viewport = document.createElement("meta");
    //     viewport.name = "viewport";
    //     document.head.appendChild(viewport);
    // }
    // "width=device-width" aligns page width to screen width.
    // "initial-scale=1.0" ensures it starts at 100% zoom (no zoom in/out).
    // viewport.content = "width=device-width, initial-scale=0.98, maximum-scale=5.0, user-scalable=yes";

    // =========================================================
    // 4. GPU SAVER: Global CSS Injection
    // =========================================================
    // Instead of using a MutationObserver (which costs CPU), 
    // we inject CSS rules that the browser applies automatically.
    
    const css = `     
        /* STOP ALL CSS ANIMATIONS */
        /* This stops spinning loaders, flashing ads, and transitions */
        *, *::before, *::after {
            animation: none !important;
            transition: none !important;
        }
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    
    // Append to head (or body if head doesn't exist yet)
    (document.head || document.documentElement).appendChild(style);

})();
