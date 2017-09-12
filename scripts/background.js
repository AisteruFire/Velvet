/*
    background.js

    This file contains the Javascript that needs to be executed in the background.
*/

// After installation, open settings with a welcome message
chrome.runtime.onInstalled.addListener(details => {
	if (details.reason === "install") openSettings(WELCOME_MESSAGE);
});

// When the extension's icon is clicked, open settings
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
		tempFirstPostIds: {},
		ignoreList: {}
	}, data => {
		chrome.tabs.query({ url: ["*://*.derpibooru.org/*", "*://*.trixiebooru.org/*", "*://derpicdn.net/*"] }, tabs => {
			if (tabs.length === 0)
			{
				// Object that will be passed to chrome.storage.sync.set to be saved
				var objectToSave = {
					tempLastSeenIds: {},
					tempFirstPostIds: {},
					ignoreList: {}
				};

				if (data.indicateLastSeen)
				{
					objectToSave.lastSeenIds = data.lastSeenIds;

					for (let query in data.tempLastSeenIds)
					{
						// Don't save ignored queries
						if (!data.ignoreList[query])
							objectToSave.lastSeenIds[query] = data.tempLastSeenIds[query];
					}
				}

				if (data.indicateFirstPost)
				{
					objectToSave.firstPostIds = data.firstPostIds;

					for (let query in data.tempFirstPostIds)
					{
						if (!data.ignoreList[query])
							objectToSave.firstPostIds[query] = data.tempFirstPostIds[query];
					}
				}

				chrome.storage.sync.set(objectToSave);
			}
		});
	});
});
