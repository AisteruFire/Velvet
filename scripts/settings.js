/*
    settings.js

    This file generates a new tab in the settings page on derpibooru. It contains the settings for Velvet, such as aliases and the quick tags
*/

const settingsTable = document.getElementById("js-setting-table");
const tabSelect = settingsTable.firstChild;

// ---------- Creating the tab ----------
const velvetTab = `<a id="velvet" href="#" data-click-tab="velvet">Velvet</a>`;
tabSelect.insertAdjacentHTML("beforeend", velvetTab);

// ---------- Creating the content of the tab ----------
tabSelect.insertAdjacentHTML("afterend", VELVET_TAB_CONTENT);

// ---------- Saving the user's preferences on form submission ----------

document.querySelector("form.edit_user").addEventListener("submit", () => {
	chrome.storage.sync.set({
		quickTags: document.getElementById("user_quick_tags").value,
		aliases: document.getElementById("user_aliases").value,
		andFlag: document.getElementById("andFlag").value,
		orFlag: document.getElementById("orFlag").value,
		preferedAnd: document.getElementById("preferedAnd").value,
		preferedOr: document.getElementById("preferedOr").value,
		wrapAliases: document.getElementById("wrapAliases").checked,
		defaultOperation: document.getElementById("defaultOperation").value,
		indicateLastSeen: document.getElementById("indicateLastSeen").checked
	});
});

// ---------- Retrieving the user's preferences ----------

chrome.storage.sync.get({
	// Default values
	quickTags: DEFAULT_QUICK_TAGS,
	aliases: DEFAULT_ALIASES,
	andFlag: DEFAULT_AND_FLAG,
	orFlag: DEFAULT_OR_FLAG,
	preferedAnd: DEFAULT_PREFERED_AND,
	preferedOr: DEFAULT_PREFERED_OR,
	wrapAliases: DEFAULT_WRAP_ALIASES,
	defaultOperation: DEFAULT_OPERATION,
	indicateLastSeen: DEFAULT_INDICATE_LAST_SEEN
}, data => {
	document.getElementById("user_quick_tags").value = data.quickTags;
	document.getElementById("user_aliases").value = data.aliases;
	document.getElementById("andFlag").value = data.andFlag;
	document.getElementById("orFlag").value = data.orFlag;
	document.getElementById("preferedAnd").value = data.preferedAnd;
	document.getElementById("preferedOr").value = data.preferedOr;
	document.getElementById("wrapAliases").checked = data.wrapAliases;
	document.getElementById("defaultOperation").value = data.defaultOperation;
	document.getElementById("indicateLastSeen").checked = data.indicateLastSeen;
});

// ---------- Checking for illegal characters for flag ----------
function checkForbiddenFlags(e)
{
	if (/[a-zA-Z0-9\x80-\xFF()*,"\\~^ ]/.test(String.fromCharCode(e.keyCode)))
		e.preventDefault();
}

document.getElementById("andFlag").addEventListener("keypress", e => checkForbiddenFlags(e));
document.getElementById("orFlag").addEventListener("keypress", e => checkForbiddenFlags(e));
