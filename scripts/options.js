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

    //Quick tags
    var tempTag = document.createElement("h4");
    tempTag.innerHTML = "Quick search";
    content.appendChild(tempTag);

    var field = document.createElement("div");  //Fields are divs that are often reused to split sections into discernable zones
    field.setAttribute("class", "field");

        tempTag = document.createElement("label");
        tempTag.setAttribute("for", "quick_tags");
        tempTag.innerHTML = "Tags to add to the search in a snap. Aliases are allowed.";
        field.appendChild(tempTag);

        var quickTags = document.createElement("textarea");
        quickTags.setAttribute("class", "input input--wide");
        quickTags.setAttribute("autocapitalize", "none");
        quickTags.setAttribute("id", "user_quick_tags");
        quickTags.setAttribute("placeholder", "Quick tags to insert with the Velvet button");
        field.appendChild(quickTags);

    content.appendChild(field);

    //Aliases
    tempTag = document.createElement("h4");
    tempTag.innerHTML = "Aliases";
    content.appendChild(tempTag);

    field = document.createElement("div");
    field.setAttribute("class", "field");

        tempTag = document.createElement("label");
        tempTag.setAttribute("for", "user_aliases");
        tempTag.innerHTML = "Aliases used to shorten commonly used requests by assigning an equivalent to multiple tags.";
        field.appendChild(tempTag);

        var aliases = document.createElement("textarea");
        aliases.setAttribute("class", "input input--wide");
        aliases.setAttribute("autocapitalize", "none");
        aliases.setAttribute("id", "user_aliases");
        aliases.setAttribute("placeholder", "alias=tags ; alias=tags ; ...");
        field.appendChild(aliases);

    content.appendChild(field);

optionsTable.insertBefore(content, optionsTable.firstChild.nextSibling);    //Inserting content so that it reacts the same as the other tabs

    //Additional tags
    tempTag = document.createElement("h4");
    tempTag.innerHTML = "Sorting tags";
    content.appendChild(tempTag);

    field = document.createElement("div");
    field.setAttribute("class", "field");

        tempTag = document.createElement("p");
        tempTag.innerHTML = "The following tags are added by Velvet to ease searches. They are used as any other normal tag :";
        field.appendChild(tempTag);

        var list = document.createElement("ul");

            tempTag = document.createElement("li");
            tempTag.innerHTML = "<strong>DESC</strong> : sort results descending (default). Has to be used in conjunction with a sorting type below.";
            list.appendChild(tempTag);

            tempTag = document.createElement("li");
            tempTag.innerHTML = "<strong>ASC</strong> : sort results ascending. Has to be used in conjunction with a sorting type below.";
            list.appendChild(tempTag);

            list.appendChild(document.createElement("br"));

            tempTag = document.createElement("li");
            tempTag.innerHTML = "<strong>DATE</strong> : sort results by creation date (default)";
            list.appendChild(tempTag);

            tempTag = document.createElement("li");
            tempTag.innerHTML = "<strong>SCORE</strong> : sort results by score";
            list.appendChild(tempTag);

            tempTag = document.createElement("li");
            tempTag.innerHTML = "<strong>RELEVANCE</strong> : sort results by relevance";
            list.appendChild(tempTag);

            tempTag = document.createElement("li");
            tempTag.innerHTML = "<strong>WIDTH</strong> : sort results by width";
            list.appendChild(tempTag);

            tempTag = document.createElement("li");
            tempTag.innerHTML = "<strong>HEIGHT</strong> : sort results by height";
            list.appendChild(tempTag);

            tempTag = document.createElement("li");
            tempTag.innerHTML = "<strong>COMMENTS</strong> : sort results by number of comments";
            list.appendChild(tempTag);

            tempTag = document.createElement("li");
            tempTag.innerHTML = "<strong>RANDOM</strong> : sort results randomly";
            list.appendChild(tempTag);

        field.appendChild(list);

    content.appendChild(field);

// ---------- Saving the user's preferences on form submission ----------

document.querySelector("form.edit_user").addEventListener("submit", function(){
    chrome.storage.sync.set({
        quickTags: document.getElementById("user_quick_tags").value,
        aliases: document.getElementById("user_aliases").value
    }, function(){});
});

// ---------- Retrieving the user's preferences ----------

chrome.storage.sync.get({
    //Default values
    quickTags: "",
    aliases: ""
}, function(data){
    document.getElementById("user_quick_tags").value = data.quickTags;
    document.getElementById("user_aliases").value = data.aliases;
});
