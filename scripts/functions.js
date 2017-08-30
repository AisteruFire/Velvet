/*
    functions.js

    This file contains various function used multiple times in the code.
*/

function openSettings(alert)
{
	chrome.tabs.create({url: "https://derpibooru.org/settings"}, tab => {
		let js = "while (!document.getElementById('velvet')); document.getElementById('velvet').click();";  // Waiting for the Velvet tab to be created

		if (alert)  // If there is some text to show to the user...
			js += `alert("${alert}");`;

		chrome.tabs.executeScript(tab.id, {code: js});
	});
}

/*
	Replaces all aliases in a query.

	query - The query to process
	aliases - An array containing all the aliases structured like this : alias = replacement
	andFlag - The character used as the AND flag
	orFlag - The character used as the OR flag
	defaultFlagValue - The flag to use by default (2 for AND, 1 for OR)
	flagValue - The flag that was used in conjunction with the query in a potential previous call of the function (2 for AND, 1 for OR)
	backtick - Boolean indicating whether or not the query (or a parent alias) was preceded by a backtick

	Returns the query with its aliases replaced.
*/
function processQuery(query, aliases, andFlag, orFlag, defaultFlagValue, flagValue, backtick)
{
	// If no backtick is given, it is by default false
	backtick = backtick || false;

	let regExpDitto = / ?:: ?/g;

	for (let line of aliases)
	{
		let alias = line.split("=")[0].trim(), replacement = line.split("=")[1].trim();
		let regExpAlias = new RegExp("(\\b|`)(" + alias + ")(\\" + andFlag + "|\\" + orFlag + "|\\b)", "ig");

		// Ignoring aliases containing themselves
		if (regExpAlias.test(replacement))
			continue;

		// If the query contains the alias
		if (regExpAlias.test(query))
		{
			let match;

			regExpAlias.lastIndex = 0;

			/*
				Browsing every occurence of this alias in the query.

				Returned array :
					[0] Full match
					[1] Backtick
					[2] Alias
					[3] Flag
					[index] Index of matching string
					[input] Full query
			*/
			while ((match = regExpAlias.exec(query)))
			{
				let aliasFlagValue = match[3] == andFlag ? 2 : match[3] == orFlag ? 1 : backtick ? flagValue : defaultFlagValue;

				// Replacing the alias with the query it represents
				query = query.replace(regExpAlias, processQuery(
					replacement,
					aliases,
					andFlag,
					orFlag,
					defaultFlagValue,
					aliasFlagValue,
					backtick && match[3] != "" || match[1] != ""	// Either there was a backtick on a parent alias and there is no new flag for this alias, or there is a backtick on this alias
				));
			}
		}
	}

	// If the query contains ditto operators
	if (regExpDitto.test(query))
		query = query.replace(regExpDitto, flagValue == 2 ? " AND " : flagValue == 1 ? " OR " : " ");

	return query;
}
