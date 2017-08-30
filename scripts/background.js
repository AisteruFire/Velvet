/*
    background.js

    This file contains the Javascript that needs to be executed in the background.
*/

// After installation...
chrome.runtime.onInstalled.addListener(details => {
	if (details.reason === "install") openSettings(WELCOME_MESSAGE);
});

// When the extension's icon is clicked...
chrome.browserAction.onClicked.addListener(() => {
	openSettings();
});

// When a tab is closed, checks if Derpibooru is still open. If it isn't, save all Velvet reminder id
chrome.tabs.onRemoved.addListener(() => {
	chrome.storage.sync.get({
		indicateLastSeen: DEFAULT_INDICATE_LAST_SEEN,
		indicateFirstPost: DEFAULT_INDICATE_FIRST_POST,
		lastSeenIds: {},
		firstPostIds: {},
		tempLastSeenIds: {},
		tempFirstPostIds: {}
	}, data => {
		chrome.tabs.query({ url: ["*://*.derpibooru.org/*", "*://*.trixiebooru.org/*", "*://derpicdn.net/*"] }, tabs => {
			if (tabs.length === 0)
			{
				// Object that will be passed to chrome.storage.sync.set to be saved
				var objectToSave = {
					tempLastSeenIds: {},
					tempFirstPostIds: {}
				};

				if (data.indicateLastSeen)
					objectToSave.lastSeenIds = data.tempLastSeenIds;

				if (data.indicateFirstPost)
					objectToSave.firstPostIds = data.tempFirstPostIds;

				chrome.storage.sync.set(objectToSave);
			}
		});
	});
});
