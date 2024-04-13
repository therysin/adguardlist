Skip to content
 
Search…
All gists
Back to GitHub
@therysin
therysin/PWA2024.js
Last active now
Code
Revisions
2
Clone this repository at &lt;script src=&quot;https://gist.github.com/therysin/41a95294e55b67f1536a53d6ef6a633a.js&quot;&gt;&lt;/script&gt;
<script src="https://gist.github.com/therysin/41a95294e55b67f1536a53d6ef6a633a.js"></script>
PWA2024 Userscript
PWA2024.js
// ==UserScript==
// @name      PWA2024
// @author    Therysin
// @version   1.0
// @match     *://*/*
// @grant     none
// @run-at    document-idle
// @noframes
// ==/UserScript==

const webManifest = {
  "name": "",
  "short_name": "",
  "theme_color": "#0000",
  "background_color": "#0000",
  "display": "standalone"
};


let existingMetaTag1 = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
let existingMetaTag2 = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
let asuramenu = document.querySelector('.mm');

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

if (asuramenu) {
  asuramenu.setAttribute('style', 'background-color:black')
}
@therysin
Comment
 
Leave a comment
 
Footer
© 2024 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Docs
Contact
Manage cookies
Do not share my personal information
