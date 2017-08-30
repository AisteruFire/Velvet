/*
    background.js

    This file contains the Javascript that needs to be executed in the background.
*/

// After installation...
chrome.runtime.onInstalled.addListener(details => {
	if (details.reason == "install") openSettings(WELCOME_MESSAGE);
});

// When the extension's icon is clicked...
chrome.browserAction.onClicked.addListener(() => {
	openSettings();
});

// When a tab is closed, checks if Derpibooru is still open. If it isn't, save all Velvet reminder id
chrome.tabs.onRemoved.addListener(() => {
	chrome.storage.sync.get({
		indicateLastSeen: DEFAULT_INDICATE_LAST_SEEN,
		lastSeenIds: {},
		tempIds: {}
	}, data => {
		if (data.indicateLastSeen)
		{
			chrome.tabs.query({ url: ["*://*.derpibooru.org/*", "*://*.trixiebooru.org/*"] }, tabs => {
				if (tabs.length === 0)
				{
					chrome.storage.sync.set({
						lastSeenIds: data.tempIds,
						tempIds: {}
					});
				}
			});
		}
	});
});
