/*
    afterLoad.js

    This file contains everything that must be executed after the page is fully loaded, such as Velvet reminder.
*/

// ========== Velvet reminder ==========

// Processing the following code only if the query is ordered descendingly by date
let search = window.location.search, sorting = /sf=(date)?/.exec(search), order = /sd=(desc)?/.exec(search);

let query = document.getElementById("q").value;

/*
	Velvet reminder is only used when the search (which can't be empty) is ordered descendingly by date.
	If sorting is empty or is set to "date", and order is empty or set to "desc", Velvet reminder can work correctly
*/
if ((!sorting || sorting[1]) && (!order || order[1]) && query.length > 0)
{
	chrome.storage.sync.get({
		indicateLastSeen: DEFAULT_INDICATE_LAST_SEEN,
		indicateFirstPost: DEFAULT_INDICATE_FIRST_POST,
		lastSeenIds: {},
		firstPostIds: {},
		tempLastSeenIds: {},
		tempFirstPostIds: {}
	}, data => {
		var id, firstImage;

		if (data.indicateFirstPost)
		{
			// If there is an image id and the page contains an image...
			if ((id = data.firstPostIds[query]) && (firstImage = document.querySelector(`div.media-box[data-image-id="${id}"]`)))
			{
				firstImage.style.border = VELVET_REMINDER_BORDER_STYLE;
				firstImage.style.borderColor = "orange";
				firstImage.style.borderRadius = VELVET_REMINDER_BORDER_RADIUS;
			}

			// Storing the id of the first pic in the page locally for later storage as firstPostIds
			let divs = document.querySelectorAll("div.media-box");

			// If no id is set, it's set to -1
			if (!data.tempFirstPostIds[query])
				data.tempFirstPostIds[query] = -1;

			for (var div of divs)
			{
				data.tempFirstPostIds[query] = Math.max(data.tempFirstPostIds[query], Number(div.getAttribute("data-image-id")));
			}

			chrome.storage.sync.set({ tempFirstPostIds: data.tempFirstPostIds });
		}

		if (data.indicateLastSeen)
		{
			// If there is an image id and the page contains an image...
			if ((id = data.lastSeenIds[query]) && (firstImage = document.querySelector(`div.media-box[data-image-id="${id}"]`)))
			{
				// If the first image is already bordered in orange...
				if (firstImage.style.borderColor === "orange")
				{
					firstImage.style.borderColor = `orange ${DEFAULT_VELVET_COLOR}` ;
				}
				else
				{
					firstImage.style.border = VELVET_REMINDER_BORDER_STYLE;
					firstImage.style.borderColor = DEFAULT_VELVET_COLOR;
					firstImage.style.borderRadius = VELVET_REMINDER_BORDER_RADIUS;
				}
			}

			// Storing the id of the first pic in the page locally for later storage as lastSeenIds
			data.tempLastSeenIds[query] = document.querySelector("div.media-box").getAttribute("data-image-id");
			chrome.storage.sync.set({ tempLastSeenIds: data.tempLastSeenIds });
		}
	});
}
