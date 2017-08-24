/*
    settings.js

    This file generates a new tab in the settings page on derpibooru. It contains the settings for Velvet, such as aliases and the quick tags
*/

const settingsTable = document.getElementById("js-setting-table");
const tabSelect = settingsTable.firstChild;

// ---------- Creating the tab ----------
const velvetTab = "<a id=\"velvet\" href=\"#\" data-click-tab=\"velvet\" style=\"color:darkorchid\">Velvet</a>";
tabSelect.insertAdjacentHTML("beforeend", velvetTab);

// ---------- Creating the content of the tab ----------
const content = VELVET_TAB_CONTENT;

// Inserting content so that it reacts the same as the other tabs
tabSelect.insertAdjacentHTML("afterend", content);

const form = document.querySelector("form.edit_user");
const aliases = document.getElementById("user_aliases");
const quickTags = document.getElementById("user_quick_tags");

// ---------- Saving the user's preferences on form submission ----------

form.addEventListener("submit", () => {
	chrome.storage.sync.set({
		quickTags: quickTags.value,
		aliases: aliases.value
	});
});

// ---------- Retrieving the user's preferences ----------

chrome.storage.sync.get({
	// Default values
	quickTags: DEFAULT_QUICK_TAGS,
	aliases: DEFAULT_ALIASES
}, data => {
	quickTags.value = data.quickTags;
	aliases.value = data.aliases;
});
