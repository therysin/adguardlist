// ==UserScript==
// @name      PWA2024
// @author    Therysin
// @version   1.0
// @match     *://*/*
// @grant     none
// @run-at    document-idle
// @noframes
// ==/UserScript==

const domain = window.location.hostname; // Get the current domain from the URL
const faviconUrl = `https://www.google.com/s2/favicons?sz=256&domain=${domain}`; 

const webManifest = {
//  "name": "",
//  "short_name": "",
//  "theme_color": "#0000",
//  "background_color": "#0000",
  "display": "standalone",
  "icons": [
    {
      "src": faviconUrl, // Use the dynamically generated favicon URL
      "sizes": "256x256", // Adjust the size as needed
      "type": "image/png"
    }
  ]
};


let existingMetaTag1 = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
let existingMetaTag2 = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');

// Create the link element for the manifest
const manifestElem = document.createElement('link');
manifestElem.setAttribute('rel', 'manifest');
manifestElem.setAttribute('href', 'data:application/manifest+json;base64,' + btoa(JSON.stringify(webManifest)));
document.head.prepend(manifestElem);


// Check if the meta tag exists
if (existingMetaTag1) {
    // Update the content attribute to "yes"
    existingMetaTag1.setAttribute('content', 'yes');
} else {
    // Create a new meta tag and add it to the document head
    let newMetaTag1 = document.createElement('meta');
    newMetaTag1.setAttribute('name', 'apple-mobile-web-app-capable');
    newMetaTag1.setAttribute('content', 'yes');
    document.head.appendChild(newMetaTag1);
}

// Check if the meta tag exists
if (existingMetaTag2) {
    // Update the content attribute to "black-translucent"
    existingMetaTag2.setAttribute('content', 'black-translucent');
} else {
    // Create a new meta tag and add it to the document head
    let newMetaTag2 = document.createElement('meta');
    newMetaTag2.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
    newMetaTag2.setAttribute('content', 'black-translucent');
    document.head.appendChild(newMetaTag2);
}
