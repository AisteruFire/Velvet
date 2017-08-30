/*
    afterLoad.js

    This file contains everything that must be executed after the page is fully loaded, such as Velvet reminder.
*/

// ========== Velvet reminder ==========

// Retrieving the user's query
var query = document.getElementById("q").value;

chrome.storage.sync.get({
	indicateLastSeen: DEFAULT_INDICATE_LAST_SEEN,
	lastSeenIds: {},
	tempIds: {}
}, data => {
	if (data.indicateLastSeen)
	{
		let div, id;

		if ((id = data.lastSeenIds[query]) && (div = document.querySelector(`div.media-box[data-image-id="${id}"]`)))
		{
			div.style.border = VELVET_REMINDER_BORDER;
			div.style.borderRadius = VELVET_REMINDER_BORDER_RADIUS;
		}

		// Storing the id of the first pic in the page locally for later storage as lastSeenIds
		data.tempIds[query] = document.querySelector("div.media-box").getAttribute("data-image-id");
		chrome.storage.sync.set({ tempIds: data.tempIds });
	}
});
