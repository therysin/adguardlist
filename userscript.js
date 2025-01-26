// ==UserScript==
// @name         Test User Script
// @namespace    http://example.com
// @version      1.0
// @description  A simple script to test WKWebView user script functionality.
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Change the background color of the webpage
    document.body.style.backgroundColor = "lightgray";
    // Create a message element
    const messageDiv = document.createElement("div");
    messageDiv.textContent = "This is a test user script running on this webpage!";
    messageDiv.style.position = "fixed";
    messageDiv.style.top = "0";
    messageDiv.style.left = "0";
    messageDiv.style.width = "100%";
    messageDiv.style.backgroundColor = "black";
    messageDiv.style.color = "white";
    messageDiv.style.padding = "10px";
    messageDiv.style.zIndex = "9999";
    messageDiv.style.textAlign = "center";
    // Append the message to the body
    document.body.appendChild(messageDiv);
    const header = document.querySelector('header.bg-themecolor');
    if (header) {
            header.style.backgroundColor = 'black'; // Change background color to black
    }
    
})();
