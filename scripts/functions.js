/*
    functions.js

    This file contains various function used multiple times in the code.
*/

function openSettings(alert)
{
    chrome.tabs.create({url: "https://derpibooru.org/settings"}, function(tab){
        var js = "while (!document.getElementById('velvet')); document.getElementById('velvet').click();";  //Waiting for the Velvet tab to be created

        if (alert)  //If there is some text to show to the user...
            js += "alert(\"" + alert + "\");";

        chrome.tabs.executeScript(tab.id, {code: js});
    });
}
