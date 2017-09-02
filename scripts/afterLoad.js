/*
    afterLoad.js

    This file contains everything that must be executed after the page is fully loaded, such as Velvet reminder.
*/

// ========== Velvet reminder ==========

// Processing the following code only if the query is ordered descendingly by date
let sorting = /sf=(date)?/.exec(window.location.search), order = /sd=(desc)?/.exec(window.location.search);

/*
	The URL is used for the query, as it can be changed in the queryField without being submitted (which can falsify results).
	As the URL doesn't have any parameters when the user watches the first page of a tag, the query is retrieved differently in this case.
*/
var urlQuery = /q=([^&]*)/.exec(unescapeString(window.location.search)), urlTag = /tags\/([^?]+)/.exec(unescapeString(window.location.pathname));
let query;

if (urlQuery)
	query = decodeURI(urlQuery[1]);
else if (urlTag)
	query = decodeURI(urlTag[1]);

let queryField = document.getElementById("q");
let mediaBoxes = document.querySelectorAll("div.media-box");

/*
	Velvet reminder is only used when the search (which can't be empty) is ordered descendingly by date, and produces results.
	If sorting is empty or is set to "date", and order is empty or set to "desc", Velvet reminder can work correctly
*/
if ((!sorting || sorting[1]) && (!order || order[1]) && query && mediaBoxes)
{
	chrome.storage.sync.get({
		indicateLastSeen: DEFAULT_INDICATE_LAST_SEEN,
		indicateFirstPost: DEFAULT_INDICATE_FIRST_POST,
		lastSeenIds: {},
		firstPostIds: {},
		tempLastSeenIds: {},
		tempFirstPostIds: {}
	}, data => {
		let id, firstImage;

		if (data.indicateLastSeen)
		{
			// If there is an image id stored and the page contains the image corresponding...
			if ((id = data.lastSeenIds[query]) && (firstImage = document.querySelector(`div.media-box[data-image-id="${id}"]`)))
			{
				firstImage.style.border = VELVET_REMINDER_BORDER_STYLE;
				firstImage.style.borderColor = DEFAULT_VELVET_COLOR;
				firstImage.style.borderRadius = VELVET_REMINDER_BORDER_RADIUS;
			}

			// Storing the id of the first pic for later storage as lastSeenIds
			data.tempLastSeenIds[query] = Number(mediaBoxes[0].getAttribute("data-image-id"));
			chrome.storage.sync.set({ tempLastSeenIds: data.tempLastSeenIds });

			// Generates link for resuming browsing
			if (data.lastSeenIds[query])
			{
				document.querySelector("#imagelist_container > section > div.flex__right").insertAdjacentHTML("afterbegin", `<a id="resumeBrowsing" style="color: ${DEFAULT_VELVET_COLOR}">Resume browsing</a>`);

				document.getElementById("resumeBrowsing").addEventListener("click", () => {
					queryField.value = `(${query}) AND id.lt:${data.lastSeenIds[query]}`;
					queryField.parentNode.submit();
				});
			}
		}

		if (data.indicateFirstPost)
		{
			// If there is an image id and the page contains an image...
			if ((id = data.firstPostIds[query]) && (firstImage = document.querySelector(`div.media-box[data-image-id="${id}"]`)))
			{
				// If the first image is already bordered...
				if (firstImage.style.borderColor === DEFAULT_VELVET_COLOR)
				{
					firstImage.style.borderColor = DEFAULT_VELVET_FIRST_POST_COLOR + " " + DEFAULT_VELVET_COLOR;
				}
				else
				{
					firstImage.style.border = VELVET_REMINDER_BORDER_STYLE;
					firstImage.style.borderColor = DEFAULT_VELVET_FIRST_POST_COLOR;
					firstImage.style.borderRadius = VELVET_REMINDER_BORDER_RADIUS;
				}
			}


			// If no id is set, it's set to -1
			if (!data.tempFirstPostIds[query])
				data.tempFirstPostIds[query] = -1;

			for (var div of mediaBoxes)
			{
				data.tempFirstPostIds[query] = Math.max(data.tempFirstPostIds[query], Number(div.getAttribute("data-image-id")));
			}

			chrome.storage.sync.set({ tempFirstPostIds: data.tempFirstPostIds });

			// Generates link for only new posts
			if (data.firstPostIds[query])
			{
				document.querySelector("#imagelist_container > section > div.flex__right").insertAdjacentHTML("afterbegin", `<a id="onlyNew" style="color: ${DEFAULT_VELVET_FIRST_POST_COLOR}">Only new posts</a>`);

				document.getElementById("onlyNew").addEventListener("click", () => {
					queryField.value = `(${query}) AND id.gt:${data.firstPostIds[query]}`;
					queryField.parentNode.submit();
				});
			}
		}
	});
}
