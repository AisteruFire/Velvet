/*
    beforeSubmit.js

    This file contains everything that is executed before the form is sent to the server, such as aliases replacements
*/

//Since sync.get is asynchronous, everything is done after retrieving the user's preferences
chrome.storage.sync.get({
    lewdTags: "lewd pwny",
    aliases: ""
}, function(data){
    // ---------- Lewd button ----------

    if (data.lewdTags)
    {
        var lewdButton = document.createElement("button");
        lewdButton.setAttribute("title", "Lewd that for me please >//<");
        lewdButton.setAttribute("class", "header__search__button");
        lewdButton.setAttribute("type", "submit");
        lewdButton.addEventListener("click", function(){
            var field = document.getElementById("q");

            if (document.getElementById("q").value)
                document.getElementById("q").value += " AND (" + data.lewdTags.trim() + ")";
            else
                document.getElementById("q").value = data.lewdTags.trim();
        });

            var i = document.createElement("i");
            i.setAttribute("style", "font-weight: bold; font-style: normal; font-size: 130%");
            i.innerHTML = "L";
            lewdButton.appendChild(i);

            //Waiting for an appropriate icon
            /*
            var image = document.createElement("img");
            image.setAttribute("style", "height: 16px;");
            image.src = chrome.runtime.getURL("../icons/lewdIcon.png");
            lewdButton.appendChild(image);
            */
        document.querySelector("form.header__search").appendChild(lewdButton);
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
                document.getElementById("q").value = document.getElementById("q").value.replace(new RegExp(alias.split("=")[0].trim(), "ig"), alias.split("=")[1].trim());
            }
        });
    }
});
