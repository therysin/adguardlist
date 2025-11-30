// ==UserScript==
// @name         Manga Reader Super Optimizer
// @namespace    http://therysin.com
// @version      2.0
// @description  Aggressive optimization: 1FPS UI, 1s background timers, no popups.
// @author       Therysin
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // =========================================================
    // 1. VISUAL THROTTLE (requestAnimationFrame) -> 1 FPS
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
    // 2. LOGIC THROTTLE (setInterval / setTimeout) -> Min 1s delay
    // =========================================================
    // This stops background scripts from running wildly (e.g. ad refreshers)
    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;

    window.setInterval = function(func, delay) {
        if (delay < 1000) delay = 1000; 
        return originalSetInterval(func, delay);
    };
    
    window.setTimeout = function(func, delay) {
        if (delay < 500) delay = 500; // Slightly faster for timeouts to not break lazy loading
        return originalSetTimeout(func, delay);
    };

    // =========================================================
    // 3. POPUP & POPUNDER KILLER
    // =========================================================
    // Prevents the site from opening new windows/tabs via JS
    window.open = function() {
        return null;
    };

    // =========================================================
    // 4. SCROLL EVENT SILENCER
    // =========================================================
    // Many sites attach heavy logic to 'scroll'. Since we scroll natively in Swift,
    // we can intercept these and stop them from choking the CPU.
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'scroll' || type === 'wheel' || type === 'touchmove') {
            // Option A: Ignore them completely (Most aggressive, best performance)
            // return; 
            
            // Option B: Force them to be 'passive' (Smoother, allows functionality)
            if (typeof options === 'object') {
                options.passive = true;
            } else {
                options = { passive: true };
            }
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    // =========================================================
    // 5. DOM CLEANUP (Specific to Manga Sites)
    // =========================================================
    const header = document.querySelector('header.bg-themecolor');
    if (header) {
        header.style.backgroundColor = 'black';
    }

    // Aggressively hide common floaters (social shares, chat widgets)
    // const css = `
    //     iframe[id^="google_ads"], 
    //     #chat-widget, 
    //     .fb-customerchat, 
    //     .social-share-bar, 
    //     .float-ads { 
    //         display: none !important; 
    //         pointer-events: none !important; 
    //     }
    // `;
    // const style = document.createElement('style');
    // style.appendChild(document.createTextNode(css));
    // document.head.appendChild(style);

})();
