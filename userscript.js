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
    const ENABLE_DATA_SAVER = true; 
    const IMAGE_QUALITY = 55; // Quality 1-100 (60 is a good balance)

// =========================================================
// 2. DATA SAVER (No Fallback)
// =========================================================
if (ENABLE_DATA_SAVER) {

    function createProxyUrl(originalUrl, width) {
        if (!originalUrl || originalUrl.includes('wsrv.nl') || originalUrl.startsWith('data:')) return originalUrl;
        const encoded = encodeURIComponent(originalUrl);
        return `https://wsrv.nl/?url=${encoded}&w=${width}&q=${IMAGE_QUALITY}&output=webp`;
    }

    function processImage(img) {
        if (img.dataset.processed) return;

        const originalSrc = img.getAttribute('data-src') || img.src; // fix
        if (!originalSrc) return;

        img.dataset.processed = "true";

        // Nuke srcset to force our specific URL
        if (img.hasAttribute('srcset')) img.removeAttribute('srcset');

        // Compute width per image
        let displayWidth = img.clientWidth || img.width || window.innerWidth;
        if (!displayWidth || displayWidth <= 0) {
            displayWidth = window.innerWidth;
        }

        const newSrc = createProxyUrl(originalSrc, displayWidth);

        // Force the proxy URL. If this fails, the image dies.
        if (img.getAttribute('data-src')) img.setAttribute('data-src', newSrc);
        img.src = newSrc;
    }

    const imageObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;
                if (node.tagName === 'IMG') processImage(node);
                if (node.querySelectorAll) node.querySelectorAll('img').forEach(processImage);
            });
        });
    });

    imageObserver.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll('img').forEach(processImage);
}

    // =========================================================
    // 1. CPU SAVER: Throttle Animations to 1 FPS , width fixes, kill popups
    // =========================================================
    window.requestAnimationFrame = function(callback) {
        return window.setTimeout(function() {
            callback(Date.now());
        }, 1000);
    };

    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };

    window.open = function() {
        return null;
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
