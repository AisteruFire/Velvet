/*
    background.js

    This file contains the Javascript that needs to be executed in the background.html page.
*/

//After installation...
chrome.runtime.onInstalled.addListener(details => {
    if (details.reason == "install")
        openSettings(WELCOME_MESSAGE);
});

//When the extension's icon is clicked...
chrome.browserAction.onClicked.addListener(tab => { openSettings(); });
