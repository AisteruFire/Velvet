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
	wrapAliases: DEFAULT_WRAP_ALIASES,
	defaultOperation: DEFAULT_OPERATION
}, data => {
	// ---------- Quick tags button ----------
	data.quickTags = data.quickTags.trim();

	if (data.quickTags)
	{
		var searchBar = document.querySelector("form.header__search");
		searchBar.insertAdjacentHTML("beforeend", `<button class="header__search__button" title="` + QUICK_TAGS_BUTTON_TITLE + `" type="submit" style="vertical-align: middle;">`);

		var quickButton = document.querySelector(`button[title="` + QUICK_TAGS_BUTTON_TITLE + `"]`);
		var searchField = document.getElementById("q");

		quickButton.addEventListener("click", function(){
			if (!searchField.value)   // If the search field is empty, we just add the quick tags
				searchField.value = data.quickTags;
			else if (!~searchField.value.indexOf(data.quickTags)) // Adding the quick tags only if they're not already there. Surrounding it with brackets to respect operator priority
				searchField.value = "(" + searchField.value + ") AND (" + data.quickTags + ")";
		});

		// Adding the button's image
		quickButton.insertAdjacentHTML("beforeend", `<img style="height: 21px;" src="` + chrome.runtime.getURL("../icons/velvetIcon.png") + `" />`);
	}

	// ---------- Parsing the aliases ----------
	if (data.aliases)
	{
		var aliases = [];
		var split = data.aliases.split("\n");

		for (var alias of split)
		{
			if (alias.split("=").length === 2)
			{
				aliases.push(alias.trim());
			}
		}

		// ---------- Replacing the aliases ----------
		searchBar.addEventListener("submit", () => {
			searchField.value = processQuery(
				searchField.value,
				aliases,
				data.andFlag,
				data.orFlag,
				data.defaultOperation === "AND" ? 2 : 1
			);
		});
	}
});
