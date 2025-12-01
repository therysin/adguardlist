// ==UserScript==
// @name         Manga Reader Optimizer & Throttler
// @namespace    https://github.com/therysin
// @version      1.1
// @description  Sets background to black and throttles animations to 1FPS to save battery.
// @author       Therysin
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================
    // 1. CPU SAVER: Throttle Animations to 1 FPS
    // =========================================================
    // This overrides the browser's animation engine.
    // Instead of refreshing 60 times a second, it waits 1000ms (1 second).
    
    window.requestAnimationFrame = function(callback) {
        return window.setTimeout(function() {
            callback(Date.now());
        }, 1000);
    };

    // We also need to override the cancel function to map to clearTimeout
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };

    console.log("MangaReader: Animations throttled to 1 FPS.");


    // =========================================================
    // 2. STYLING FIXES (Your existing code)
    // =========================================================
    
    // Attempt to change header immediately
    const header = document.querySelector('header.bg-themecolor');
    if (header) {
        header.style.backgroundColor = 'black';
    }

    // Optional: Observer to catch the header if it loads late (AJAX/SPA sites)
    const observer = new MutationObserver((mutations) => {
        const headerLate = document.querySelector('header.bg-themecolor');
        if (headerLate && headerLate.style.backgroundColor !== 'black') {
            headerLate.style.backgroundColor = 'black';
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

})();
