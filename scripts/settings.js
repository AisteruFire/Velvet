/*
    settings.js

    This file generates a new tab in the settings page on derpibooru. It contains the settings for Velvet, such as aliases and the quick tags
*/

const settingsTable = document.getElementById("js-setting-table");
const tabSelect = settingsTable.firstChild;

let andFlag, orFlag, preferedAnd, preferedOr;

// ---------- Creating the tab ----------
const velvetTab = `<a id="velvet" href="#" style="color: ${DEFAULT_VELVET_COLOR}" data-click-tab="velvet">Velvet</a>`;
tabSelect.insertAdjacentHTML("beforeend", velvetTab);

// ---------- Creating the content of the tab ----------
tabSelect.insertAdjacentHTML("afterend", VELVET_TAB_CONTENT);

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
	indicateLastSeen: DEFAULT_INDICATE_LAST_SEEN,
	indicateFirstPost: DEFAULT_INDICATE_FIRST_POST
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
	document.getElementById("indicateFirstPost").checked = data.indicateFirstPost;

	andFlag = data.andFlag;
	orFlag = data.orFlag;
	preferedAnd = data.preferedAnd;
	preferedOr = data.preferedOr;
});

// ---------- Checking for illegal characters for flag ----------
function checkForbiddenFlags(e)
{
	if (FORBIDDEN_FLAGS.test(String.fromCharCode(e.keyCode)))
		e.preventDefault();
}

document.getElementById("andFlag").addEventListener("keypress", e => checkForbiddenFlags(e));
document.getElementById("orFlag").addEventListener("keypress", e => checkForbiddenFlags(e));

// ---------- Saving the user's preferences on form submission ----------
document.querySelector("form.edit_user").addEventListener("submit", () => {
	var quickTags = document.getElementById("user_quick_tags").value;
	var aliases = document.getElementById("user_aliases").value;
	var newAndFlag = document.getElementById("andFlag").value;
	var newOrFlag = document.getElementById("orFlag").value;
	var newPreferedAnd = document.getElementById("preferedAnd").value;
	var newPreferedOr = document.getElementById("preferedOr").value;

	// Replacing all flags and operators in quick tags and aliases in case the flags' symbols and operators preferences have been changed
	quickTags = quickTags.replace(andFlag, newAndFlag).replace(orFlag, newOrFlag).replace(preferedAnd, newPreferedAnd).replace(preferedOr, newPreferedOr);
	aliases = aliases.replace(andFlag, newAndFlag).replace(orFlag, newOrFlag).replace(preferedAnd, newPreferedAnd).replace(preferedOr, newPreferedOr);

	chrome.storage.sync.set({
		quickTags: quickTags,
		aliases: aliases,
		andFlag: newAndFlag,
		orFlag: newOrFlag,
		preferedAnd: newPreferedAnd,
		preferedOr: newPreferedOr,
		wrapAliases: document.getElementById("wrapAliases").checked,
		defaultOperation: document.getElementById("defaultOperation").value,
		indicateLastSeen: document.getElementById("indicateLastSeen").checked,
		indicateFirstPost: document.getElementById("indicateFirstPost").checked
	});
});
