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
		lastSeenIds: [],
		firstPostIds: [],
		queriesIds: [],
		tempLastSeenIds: {},
		tempFirstPostIds: {},
		ignoreList: {}
	}, data => {
		chrome.tabs.query({ url: ["*://*.derpibooru.org/*", "*://*.trixiebooru.org/*", "*://derpicdn.net/*"] }, tabs => {
			if (tabs.length === 0)
			{
				// Object that will be passed to chrome.storage.sync.set to be saved
				var objectToSave = {
					queriesIds: data.queriesIds,
					tempLastSeenIds: {},
					tempFirstPostIds: {},
					ignoreList: {}
				};

				/* This code is to make the transition for versions 1.3.6+, in case the user still has data from 1.3.5 and prior */
				// If there are data stored in lastSeenIds or in firstPostIds but not in queriesIds, it means the data from 1.3.5 hasn't been transfered yet
				if ((Object.keys(data.lastSeenIds).length !== 0 || Object.keys(data.firstPostIds).length !== 0) && data.queriesIds.length === 0)
				{
					var tempIds = [];

					// Transfering lastSeenIds
					for (let query in data.lastSeenIds)
					{
						if (data.lastSeenIds.hasOwnProperty(query))
						{
							if (objectToSave.queriesIds.indexOf(query) === -1)
								objectToSave.queriesIds.push(query);

							tempIds[objectToSave.queriesIds.indexOf(query)] = data.lastSeenIds[query];
						}
					}

					data.lastSeenIds = objectToSave.lastSeenIds = tempIds;

					// Transfering firstPostIds
					for (let query in data.firstPostIds)
					{
						if (data.firstPostIds.hasOwnProperty(query))
						{
							if (objectToSave.queriesIds.indexOf(query) === -1)
								objectToSave.queriesIds.push(query);

							tempIds[objectToSave.queriesIds.indexOf(query)] = data.firstPostIds[query];
						}
					}

					data.firstPostIds = objectToSave.firstPostIds = tempIds;
				}

				if (data.indicateLastSeen)
				{
					objectToSave.lastSeenIds = data.lastSeenIds;

					for (let query in data.tempLastSeenIds)
					{
						// Don't save ignored queries
						if (!data.ignoreList[query])
						{
							if (objectToSave.queriesIds.indexOf(query) === -1)
								objectToSave.queriesIds.push(query);

							objectToSave.lastSeenIds[objectToSave.queriesIds.indexOf(query)] = data.tempLastSeenIds[query];
						}
					}
				}

				if (data.indicateFirstPost)
				{
					objectToSave.firstPostIds = data.firstPostIds;

					for (let query in data.tempFirstPostIds)
					{
						// Don't save ignored queries
						if (!data.ignoreList[query])
						{
							if (objectToSave.queriesIds.indexOf(query) === -1)
								objectToSave.queriesIds.push(query);

							objectToSave.firstPostIds[objectToSave.queriesIds.indexOf(query)] = data.tempFirstPostIds[query];
						}
					}
				}

				chrome.storage.sync.set(objectToSave);
			}
		});
	});
});
