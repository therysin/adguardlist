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
    // 1. CONFIGURATION (Forced ON for testing)
    // =========================================================

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
    // 2b. Clamp high-frequency setTimeout
    // =========================================================
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function (fn, delay, ...args) {
        if (typeof delay !== 'number' || delay < 1000) {
            delay = 1000; // minimum 1s
        }
        return originalSetTimeout(fn, delay, ...args);
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

    // =========================================================
    // 5. POPUP / NEW TAB BLOCKER (AGGRESSIVE — NO WHITELIST)
    // =========================================================
    
    // 1. Block window.open()
    const originalWindowOpen = window.open;
    window.open = function (url, target, features) {
        console.log('[MangaScript] Blocked popup:', url);
        return null; // return "failed"
    };
    
    // 2. Block target="_blank" links
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[target="_blank"]');
        if (!link) return;
    
        e.preventDefault();
        e.stopImmediatePropagation();
        console.log('[MangaScript] Blocked link new-tab:', link.href);
    }, true);  // capture so we beat site JS
    
    // 3. Block JS attempting to change link targets dynamically
    document.addEventListener('mousedown', e => {
        const link = e.target.closest('a');
        if (link && link.target === '_blank') {
            link.target = '_self';
        }
    }, true);
    
    // 4. Block "forced" popups via dispatch events (common on manga sites)
    ['mouseup', 'touchend'].forEach(evt => {
        document.addEventListener(evt, function (e) {
            // If the site tries to open a tab AFTER the click
            // (common trick in ad scripts)
            setTimeout(() => {
                // Override just in case another script restored window.open
                window.open = function () { return null; };
            }, 0);
        }, true);
    });
    
    // 5. Prevent scripts from re-hooking window.open
    Object.defineProperty(window, 'open', {
        configurable: false,
        writable: false
    });

})();
