/*
    options.js

    This file generates a new tab in the options page on derpibooru. It contains the options for Velvet, such as aliases and the quick tags
*/

// ---------- Creating the tab ----------
var optionsTable = document.getElementById("js-setting-table");
var tab = document.createElement("a");
tab.setAttribute("data-click-tab", "velvet");
tab.setAttribute("href", "#");
tab.setAttribute("style", "color: darkorchid");
tab.innerHTML = "Velvet";
optionsTable.firstChild.appendChild(tab);

// ---------- Creating the content of the tab ----------
var content = document.createElement("div");
content.setAttribute("class", "block__tab hidden");
content.setAttribute("data-tab", "velvet");

    //quick tags
    var tempTag = document.createElement("h4");
    tempTag.innerHTML = "Quick search";
    content.appendChild(tempTag);

    var field = document.createElement("div");  //Fields are divs that are often reused to split sections into discernable zones
    field.setAttribute("class", "field");

        tempTag = document.createElement("label");
        tempTag.setAttribute("for", "quick_tags");
        tempTag.innerHTML = "Tags to add to the search in a snap <strong>(coming soon)</strong>";
        field.appendChild(tempTag);

        //TODO
        /*
        var quickTags = document.querySelector("div.fancy-tag-edit").parentNode.cloneNode(true);    //Reusing the native tag field of the website
        quickTags.replaceChild(tempTag, quickTags.firstChild);
        quickTags.innerHTML = quickTags.innerHTML.replace(/watched\_tag\_list/g, "quick_tags");
        field.appendChild(quickTags);
        */

    content.appendChild(field);

    //Aliases
    field = document.createElement("div");
    field.setAttribute("class", "field");

        tempTag = document.createElement("label");
        tempTag.setAttribute("for", "user_aliases");
        tempTag.innerHTML = "Aliases used to shorten commonly used requests by assigning an alias to multiple tags.";
        field.appendChild(tempTag);

        var aliases = document.createElement("textarea");
        aliases.setAttribute("class", "input input--wide");
        aliases.setAttribute("autocapitalize", "none");
        aliases.setAttribute("id", "user_aliases");
        aliases.setAttribute("placeholder", "alias=tags ; alias=tags ; ...");
        field.appendChild(aliases);

    content.appendChild(field);

optionsTable.insertBefore(content, optionsTable.firstChild.nextSibling);    //Inserting content so that it reacts the same as the other tabs

// ---------- Saving the user's preferences on form submission ----------

document.querySelector("form.edit_user").addEventListener("submit", function(){
    chrome.storage.sync.set({
        // TODO quickTags: ,
        aliases: document.getElementById("user_aliases").value
    }, function(){});
});

// ---------- Retrieving the user's preferences ----------

chrome.storage.sync.get({
    //Default values
    quickTags: "",
    aliases: ""
}, function(data){
    //TODO quick tags
    document.getElementById("user_aliases").value = data.aliases;
});
