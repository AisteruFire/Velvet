/*
    afterLoad.js

    This file contains everything that must be executed after the page is fully loaded, such as Velvet reminder.
*/

chrome.storage.sync.get({
	indicateLastSeen: DEFAULT_INDICATE_LAST_SEEN,
	// TODO stocker dernier ID sans écraser l'ancien
}, data => {

});
