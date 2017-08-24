/*
    beforeSubmit.js

    This file contains everything that is executed before the form is sent to the server, such as aliases replacements and Velvet quick tags
*/

// Since sync.get is asynchronous, everything is done after retrieving the user's preferences
chrome.storage.sync.get({
	quickTags: DEFAULT_QUICK_TAGS,
	aliases: DEFAULT_ALIASES,
	andFlag: DEFAULT_AND_FLAG,
	orFlag: DEFAULT_OR_FLAG,
	preferedAnd: DEFAULT_PREFERED_AND,
	preferedOr: DEFAULT_PREFERED_OR,
	wrapAliases: DEFAULT_WRAP_ALIASES
}, function(data){
	// ---------- Quick tags button ----------
	data.quickTags = data.quickTags.trim();

	if (data.quickTags)
	{
		var searchBar = document.querySelector("form.header__search");
		searchBar.insertAdjacentHTML("beforeend", "<button title=\"" + QUICK_TAGS_BUTTON_TITLE + "\" class=\"header__search__button\" type=\"submit\" style=\"line-height: 0\">");

		var quickButton = document.querySelector("button[title=\"" + QUICK_TAGS_BUTTON_TITLE + "\"]");
		var searchField = document.getElementById("q");

		quickButton.addEventListener("click", function(){
			if (!searchField.value)   // If the search field is empty, we just add the quick tags
				searchField.value = data.quickTags;
			else if (!~searchField.value.indexOf(data.quickTags)) // Adding the quick tags only if they're not already there. Surrounding it with brackets to respect operator priority
				searchField.value = "(" + searchField.value + ") AND (" + data.quickTags + ")";
		});

		// Adding the button's image
		quickButton.insertAdjacentHTML("beforeend", "<img style=\"height: 21px;\" src=\"" + chrome.runtime.getURL("../icons/velvetIcon.png") +"\" />");
	}

	// ---------- Parsing the aliases ----------
	if (data.aliases)
	{
		var aliases = [];
		var split = data.aliases.split("\n");

		for (var alias of split)
		{
			if (alias.split("=").length == 2)
			{
				aliases.push(alias.trim());
			}
		}

		// ---------- Replacing the aliases ----------
		searchBar.addEventListener("submit", () => {
			for (var alias of aliases)
			{
				var toBeReplaced = alias.split("=")[0].trim(), replacement = alias.split("=")[1].trim();

				if (data.wrapAliases)
					replacement = "(" + replacement + ")";

				// If the alias contains a ditto operator
				if (~replacement.indexOf("::"))
				{
					// Replacing with correct operator according to the flag following the alias. The double backslash is in case the flag is a special character in Regexp such as ?
					searchField.value = searchField.value.replace(new RegExp("\\b" + toBeReplaced + "\\" + data.andFlag, "ig"), replacement).replace("::", data.preferedAnd);
					searchField.value = searchField.value.replace(new RegExp("\\b" + toBeReplaced + "\\" + data.orFlag, "ig"), replacement).replace("::", data.preferedOr);
				}
				else
				{
					searchField.value = searchField.value.replace(new RegExp("\\b" + toBeReplaced + "\\b", "ig"), replacement);
				}
			}
		});
	}
});
