/*
	Unit tests for the processQuery function
*/

/* eslint no-undef: "off" */

if (!document.getElementById("outputProcessQuery"))
	document.querySelector("body").insertAdjacentHTML("afterbegin", `<div id="outputProcessQuery"></div>`);

let output = document.getElementById("outputProcessQuery");
output.innerHTML = "<h1>processQuery()</h1>";

let aliases = [
	"smexy = glasses AND sexy",
	"cutsy = cute :: sexy",
	"asdf=smexy :: aj",
	"trollface = trollface AND op is a duck",
	"test = asdf :: explicit",
	"testFlagIn = asdf? :: explicit"
];

// Object containing queries and their expected replacement (default flag is AND)
let queries = {
	"twilight sparkle": "twilight sparkle",
	"smexy": "glasses AND sexy",
	"asdf": "glasses AND sexy AND aj",
	"trollface": "trollface",
	"asdf?": "glasses AND sexy OR aj",
	"asdf!": "glasses AND sexy AND aj",
	"test?": "glasses AND sexy AND aj OR explicit",
	"`test?": "glasses AND sexy OR aj OR explicit",
	"`testFlagIn!": "glasses AND sexy OR aj AND explicit",
	"asdf AND trollface": "glasses AND sexy AND aj AND trollface",
	"asdf? AND cutsy!": "glasses AND sexy OR aj AND cute AND sexy"
};

for (let q in queries)
{
	let outputText, result = processQuery(q, aliases, "!", "?", 2);

	if (result != queries[q])
		outputText = `<p class="fail">Query <code>${q}</code> returned <code>${result}</code> instead of <code>${queries[q]}</code>.</p>`;
	else
		outputText = `<p class="pass">Query <code>${q}</code> returned <code>${result}</code> correctly.</p>`;

	output.innerHTML += outputText;
}
