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
    const IMAGE_QUALITY = 10; // Quality 1-100 (60 is a good balance)
    const FORCE_PROXY = true;

// =========================================================
// 2. DATA SAVER (No Fallback)
// =========================================================
if (ENABLE_DATA_SAVER) {
    function createProxyUrl(originalUrl, width) {
        if (
            !originalUrl ||
            originalUrl.startsWith('data:') ||
            originalUrl.includes('statically.io')
        ) {
            return originalUrl;
        }

        // Normalize to absolute URL if needed
        let src = originalUrl;

        // Protocol-relative URLs: //cdn.example.com/img.jpg
        if (src.startsWith('//')) {
            src = window.location.protocol + src;
        }
        // Root-relative URLs: /images/img.jpg
        else if (src.startsWith('/')) {
            src = window.location.origin + src;
        }

        // Strip protocol for Statically
        const cleanUrl = src.replace(/^https?:\/\//, '');

        // Construct Statically URL
        return `https://cdn.statically.io/img/${cleanUrl}?w=${width}&quality=${IMAGE_QUALITY}&f=webp`;
    }

    function processImage(img) {
        // Prevent double processing
        if (img.dataset.processed === 'true') return;

        const originalSrc = img.getAttribute('data-src') || img.src;
        if (!originalSrc || originalSrc.includes('statically.io')) return;

        // Filter out tiny icons or tracking pixels if we actually know the size
        const w = img.clientWidth || img.naturalWidth || img.width || 0;
        if (w > 0 && w < 50) return;

        img.dataset.original = originalSrc;
        img.dataset.processed = 'true';

        // Nuke srcset
        if (img.hasAttribute('srcset')) img.removeAttribute('srcset');

        // Compute per-image width, fallback to viewport width
        let displayWidth = img.clientWidth;
        if (!displayWidth || displayWidth <= 0) {
            displayWidth = window.innerWidth;
        }

        const newSrc = createProxyUrl(originalSrc, displayWidth);

        if (!FORCE_PROXY) {
            img.onerror = function () {
                this.onerror = null;
                this.src = this.dataset.original;
            };
        }

        // Apply URL
        img.src = newSrc;
        if (img.getAttribute('data-src')) {
            img.setAttribute('data-src', newSrc);
        }
    }

    // =========================================================
    // UPDATED OBSERVER (Crucial for Manga Sites)
    // =========================================================
    const imageObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // 1. Handle NEW images added to the DOM
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== Node.ELEMENT_NODE) return;

                    if (node.tagName === 'IMG') processImage(node);
                    if (node.querySelectorAll) {
                        node.querySelectorAll('img').forEach(processImage);
                    }
                });
            }

            // 2. Handle EXISTING images changing their src/data-src (Lazy Loading)
            if (mutation.type === 'attributes') {
                const node = mutation.target;
                if (
                    node.nodeType === Node.ELEMENT_NODE &&
                    node.tagName === 'IMG'
                ) {
                    const src = node.getAttribute('src') || '';
                    const dataSrc = node.getAttribute('data-src') || '';

                    // Only re-process if the site changed away from our proxy
                    if (
                        !src.includes('statically.io') &&
                        !dataSrc.includes('statically.io')
                    ) {
                        node.dataset.processed = 'false';
                        processImage(node);
                    }
                }
            }
        });
    });

    // Watch for child additions AND attribute changes
    imageObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'data-src'],
    });

    // Initial run
    document.querySelectorAll('img').forEach(processImage);
}

})();

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
