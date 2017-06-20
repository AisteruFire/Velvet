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
