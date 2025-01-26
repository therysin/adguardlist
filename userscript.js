// ==UserScript==
// @name         Black Background for Header
// @namespace    http://example.com
// @version      1.0
// @description  Changes the header background color to black on a specific website.
// @author       Your Name
// @match        https://example.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the DOM to fully load
    document.addEventListener('DOMContentLoaded', () => {
        // Target the header element by its class
        const header = document.querySelector('header.bg-themecolor');
        if (header) {
            header.style.backgroundColor = 'black'; // Change background color to black
        }
    });
})();
