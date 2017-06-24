/*
    onInstall.js

    This file contains the functions performed when the app is installed, for example to show the options page to the new user.
*/

chrome.runtime.onInstalled.addListener(function(details){
    if (details.reason == "install")
    {
        chrome.tabs.create({url: "https://derpibooru.org/settings"}, function(tab){
            var js = "while (!document.getElementById('velvet')); document.getElementById('velvet').click();";  //Waiting for the Velvet tab to be created
            chrome.tabs.executeScript(tab.id, {code: js});
        });
    }
});
