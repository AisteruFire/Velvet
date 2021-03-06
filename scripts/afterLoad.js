/*
    afterLoad.js

    This file contains everything that must be executed after the page is fully loaded, such as Velvet reminder.
*/

// Migrating Velvet reminder's data localy to save space
chrome.storage.local.get(null, data => {
	if(data.indicateLastSeen == undefined)
	{
		chrome.storage.sync.get({
			lastSeenIds: [],
			firstPostIds: [],
			queriesIds: [],
			tempLastSeenIds: {},
			tempFirstPostIds: {},
			ignoreList: {}
		}, dataSync => {
			chrome.storage.local.set(dataSync);
		});
	}
});

// ========== Velvet reminder ==========

// Processing the following code only if the query is ordered descendingly by date
let sorting = /sf=(created_at)?/.exec(window.location.search), order = /sd=(desc)?/.exec(window.location.search);

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
let box, mediaBoxes = document.querySelectorAll("div.media-box");

/*
	Velvet reminder is only used when the search (which can't be empty) is ordered descendingly by date, and produces results.
	If sorting is empty or is set to "date", and order is empty or set to "desc", Velvet reminder can work correctly
*/
if ((!sorting || sorting[1]) && (!order || order[1]) && query && mediaBoxes)
{
	chrome.storage.sync.get({
		indicateLastSeen: DEFAULT_INDICATE_LAST_SEEN,
		indicateFirstPost: DEFAULT_INDICATE_FIRST_POST
	}, preferences => {
		let indicateLastSeen = preferences.indicateLastSeen;
		let indicateFirstPost = preferences.indicateFirstPost;

		chrome.storage.local.get({
			lastSeenIds: [],
			firstPostIds: [],
			queriesIds: [],
			tempLastSeenIds: {},
			tempFirstPostIds: {},
			ignoreList: {}
		}, data => {
			let id, firstImage;

			// Last picture seen when browsed a query
			if (indicateLastSeen)
			{
				// If there is an image id stored and the page contains the image corresponding...
				if (data.queriesIds.indexOf(query) > -1 && (id = data.lastSeenIds[data.queriesIds.indexOf(query)]) && (firstImage = document.querySelector(`div.media-box[data-image-id="${id}"]`)))
				{
					firstImage.style.border = VELVET_REMINDER_BORDER_STYLE;
					firstImage.style.borderColor = DEFAULT_VELVET_COLOR;
					firstImage.style.borderRadius = VELVET_REMINDER_BORDER_RADIUS;
				}

				// Storing the id of the first pic for later storage as lastSeenIds
				data.tempLastSeenIds[query] = Number(mediaBoxes[0].getAttribute("data-image-id"));
				chrome.storage.local.set({ tempLastSeenIds: data.tempLastSeenIds });

				// When an image is opened or up/downvoted, it is considered seen
				for (box of mediaBoxes)
				{
					box.addEventListener("mouseup", e => {
						if (e.target.tagName === "A" || e.target.tagName === "IMG")
						{
							data.tempLastSeenIds[query] = Math.min(data.tempLastSeenIds[query], Number(e.currentTarget.getAttribute("data-image-id")));
							chrome.storage.local.set({ tempLastSeenIds: data.tempLastSeenIds });
						}
					});
				}

				// Generates link for resuming browsing
				if (data.queriesIds.indexOf(query) > -1 && data.lastSeenIds[data.queriesIds.indexOf(query)])
				{
					document.querySelector("#imagelist_container > section > div.flex__right").insertAdjacentHTML("afterbegin", `<a id="resumeBrowsing" style="color: ${DEFAULT_VELVET_COLOR}">Resume browsing</a>`);

					document.getElementById("resumeBrowsing").addEventListener("click", () => {
						var id = data.lastSeenIds[data.queriesIds.indexOf(query)];

						// Prevents a bug when the user comes back on the page without reloading it
						if (id)
						{
							queryField.value = `(${query}) AND id.lt:${id}`;
							queryField.parentNode.submit();
						}
					});
				}
			}

			// First picture of the query at the time the query was made
			if (indicateFirstPost)
			{
				// If there is an image id and the page contains an image...
				if (data.queriesIds.indexOf(query) > -1 && (id = data.firstPostIds[data.queriesIds.indexOf(query)]) && (firstImage = document.querySelector(`div.media-box[data-image-id="${id}"]`)))
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

				if (!data.tempFirstPostIds[query])
					data.tempFirstPostIds[query] = -1;

				for (box of mediaBoxes)
				{
					data.tempFirstPostIds[query] = Math.max(data.tempFirstPostIds[query], Number(box.getAttribute("data-image-id")));
				}

				chrome.storage.local.set({ tempFirstPostIds: data.tempFirstPostIds });

				// Generates link for only new posts
				if (data.queriesIds.indexOf(query) > -1 && data.firstPostIds[data.queriesIds.indexOf(query)])
				{
					document.querySelector("#imagelist_container > section > div.flex__right").insertAdjacentHTML("afterbegin", `<a id="onlyNew" style="color: ${DEFAULT_VELVET_FIRST_POST_COLOR}">Only new posts</a>`);

					document.getElementById("onlyNew").addEventListener("click", () => {
						var id = data.firstPostIds[data.queriesIds.indexOf(query)];

						// Prevents a bug when the user comes back on the page without reloading it
						if (id)
						{
							queryField.value = `(${query}) AND id.gt:${id}`;
							queryField.parentNode.submit();
						}
					});
				}
			}

			// Don't remember ids this time (in case the user wants to resume browsing another day, or if the query contains an id)
			if (indicateLastSeen || indicateFirstPost || query.match(/.*id(\..+)?:.*/))
			{
				// Toogles the checkbox's checking according to the user's choice
				let checked = data.ignoreList[query] ? "checked" : "";

				document.querySelector("#imagelist_container > section > div.flex__right").insertAdjacentHTML("afterbegin", `<label style="color: #1a7b0e; display: inline-block; cursor: pointer; font-weight: bold;">Don't remember this search<input id="ignoreCheck" type="checkbox" style="margin-left: 5px; vertical-align: middle;" ${checked} /></label>`);

				document.getElementById("ignoreCheck").addEventListener("change", e => {
					if (e.currentTarget.checked)
						data.ignoreList[query] = 1;
					else
						delete data.ignoreList[query];

					chrome.storage.local.set({ ignoreList: data.ignoreList });
				});
			}
		});
	});
}
