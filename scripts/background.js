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
	chrome.tabs.query({ url: ["*://*.derpibooru.org/*", "*://*.trixiebooru.org/*", "*://derpicdn.net/*"] }, tabs => {
		if (tabs.length === 0)
		{
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
				/* This code is to make the transition for versions 1.3.6+, in case the user still has data from 1.3.5 and prior
				* If there is data stored in lastSeenIds or in firstPostIds but not in queriesIds, it means the data from 1.3.5 hasn't been transfered yet */
				if ((Object.keys(data.lastSeenIds).length !== 0 || Object.keys(data.firstPostIds).length !== 0) && data.queriesIds.length === 0)
				{
					var tempIds = [];

					// Transfering lastSeenIds
					for (let query in data.lastSeenIds)
					{
						if (data.lastSeenIds.hasOwnProperty(query))
						{
							if (data.queriesIds.indexOf(query) === -1)
								data.queriesIds.push(query);

							tempIds[data.queriesIds.indexOf(query)] = data.lastSeenIds[query];
						}
					}

					data.lastSeenIds = tempIds;

					tempIds = [];

					// Transfering firstPostIds
					for (let query in data.firstPostIds)
					{
						if (data.firstPostIds.hasOwnProperty(query))
						{
							if (data.queriesIds.indexOf(query) === -1)
								data.queriesIds.push(query);

							tempIds[data.queriesIds.indexOf(query)] = data.firstPostIds[query];
						}
					}

					data.firstPostIds = tempIds;
				}
				// Transfer end

				if (data.indicateLastSeen)
				{
					for (let query in data.tempLastSeenIds)
					{
						// Don't save ignored queries
						if (data.tempLastSeenIds.hasOwnProperty(query) && !data.ignoreList[query])
						{
							if (data.queriesIds.indexOf(query) === -1)
								data.queriesIds.push(query);

							data.lastSeenIds[data.queriesIds.indexOf(query)] = data.tempLastSeenIds[query];
						}
					}
				}

				if (data.indicateFirstPost)
				{
					for (let query in data.tempFirstPostIds)
					{
						// Don't save ignored queries
						if (data.tempFirstPostIds.hasOwnProperty(query) && !data.ignoreList[query])
						{
							if (data.queriesIds.indexOf(query) === -1)
								data.queriesIds.push(query);

							data.firstPostIds[data.queriesIds.indexOf(query)] = data.tempFirstPostIds[query];
						}
					}
				}

				/* I noticed that my lists of ids contain some entries that are at null or contain the same number as the entry's index for some reason.
				* This cleans them to free some space */
				for (let i = 0; i < data.lastSeenIds.length; i++)
				{
					if (data.lastSeenIds[i] === null || data.lastSeenIds[i] === String(i))
					{
						data.lastSeenIds.splice(i, 1);
					}
				}

				for (let i = 0; i < data.firstPostIds.length; i++)
				{
					if (data.firstPostIds[i] === null || data.firstPostIds[i] === String(i))
					{
						data.firstPostIds.splice(i, 1);
					}
				}

				data.tempLastSeenIds = {};
				data.tempFirstPostIds = {};
				data.ignoreList = {};

				chrome.storage.sync.set(data);
			});
		}
	});
});
