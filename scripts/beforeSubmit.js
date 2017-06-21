/*
    beforeSubmit.js

    This file contains everything that is executed before the form is sent to the server, such as aliases replacements
*/

//Since sync.get is asynchronous, everything is done after retrieving the user's preferences
chrome.storage.sync.get({
    quickTags: "",
    aliases: ""
}, function(data){
    // ---------- Lewd button ----------

    if (data.quickTags)
    {
        var quickButton = document.createElement("button");
        quickButton.setAttribute("title", "Velvet quick search");
        quickButton.setAttribute("class", "header__search__button");
        quickButton.setAttribute("type", "submit");
        quickButton.setAttribute("style", "line-height: 0");
        quickButton.addEventListener("click", function(){
            var field = document.getElementById("q");

            if (document.getElementById("q").value)
                document.getElementById("q").value += " AND (" + data.quickTags.trim() + ")";
            else
                document.getElementById("q").value = data.quickTags.trim();
        });

            //Without icon
            /*
            var i = document.createElement("i");
            i.setAttribute("style", "font-weight: bold; font-style: normal; font-size: 130%");
            i.innerHTML = "V";
            quickButton.appendChild(i);
            */

            var image = document.createElement("img");
            image.setAttribute("style", "height: 21px;");
            image.src = chrome.runtime.getURL("../icons/velvetIcon.png");
            quickButton.appendChild(image);

        document.querySelector("form.header__search").appendChild(quickButton);
    }

    // ---------- Parsing the aliases ----------
    if (data.aliases)
    {
        var aliases = [];
        var split = data.aliases.split(";");

        for (var alias of split)
        {
            if (alias.split("=").length == 2)
            {
                aliases.push(alias.trim());
            }
        }

        // ---------- Replacing the aliases ----------
        document.querySelector("form.header__search").addEventListener("submit", function(){
            for (var alias of aliases)
            {
                document.getElementById("q").value = document.getElementById("q").value.replace(new RegExp("\\(?" + alias.split("=")[0].trim() + "\\)?", "ig"), "(" + alias.split("=")[1].trim() + ")");
            }
        });
    }
});
