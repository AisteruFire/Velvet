/*
    constants.js

    This file contains all constants the extension needs to work properly and consistently. They are not initialised as constants because they may be injected mor than once per page.
*/

var DEFAULT_QUICK_TAGS = "cute",
	DEFAULT_ALIASES = "";

// Characters used for the ditto operator
var DEFAULT_AND_FLAG = "!", DEFAULT_OR_FLAG = "?";

// Operators used by default when replacing ditto operator by AND or OR. Can be 'AND' or '&&' or ',' ; 'OR' or '||'
var DEFAULT_PREFERED_AND = "AND", DEFAULT_PREFERED_OR = "OR";

// Wether the aliases should be wrapped with parenthesis or not
var DEFAULT_WRAP_ALIASES = true;

// Message to display upon Velvet's installation. Backslashes are doubled, because it is processed a second time so it must be escaped twice.
var WELCOME_MESSAGE = "Thank you for installing Velvet ! <3 Here are some explanations :\\n\\n-> Quick tags are tags you often use and would like to insert in your requests more easily. In order to do that, type your favorite tags as if you were searching them. To insert them, you'll only have to press the Velvet icon near the search bar, and they'll magically appear.\\n\\n-> Aliases are useful if you want to reduce long requests to a single expression, like turning 'pegasus AND cute AND chest fluff AND safe' to just 'pegacute'. Be careful, for if you choose an alias that is already an existing tag, you won't be able to search it properly.\\n\\nFinally, if you need to access to those settings, you can either go to derpibooru's settings or click on Velvet's icon.\\n\\nIf you want to contact me, feel free to send a private message to fandechimie on derpibooru. See ya !";

// Title of the quick tags button
var QUICK_TAGS_BUTTON_TITLE = "Velvet quick search";

// Content of the Velvet tab
var VELVET_TAB_CONTENT = `
<div class="block__tab hidden" data-tab="velvet">
	<h4>Quick search</h4>
	<div class="field">
		<label for="quick_tags">Tags to add to the search in a snap. Aliases are allowed. Leave empty to disable Velvet's icon.</label>
		<textarea class="input input--wide" autocapitalize="none" id="user_quick_tags" placeholder="Quick tags to insert with the Velvet button"></textarea>
	</div>
	<h4>Aliases</h4>
	<div class="field">
		<label for="user_aliases">Aliases used to shorten commonly used requests by assigning an equivalent to multiple tags.</label>
		<textarea class="input input--wide" autocapitalize="none" id="user_aliases" placeholder="alias = tags\nalias = tags\n..."></textarea>
	</div>
	<h4>Sorting tags</h4>
	<div class="field">
		<p>The following tags are added by Velvet to ease searches. They are used as any other normal tag:</p>
		<ul>
			<li><strong>DESC</strong>: sort results descending (default). Has to be used in conjunction with a sorting type below.</li>
			<li><strong>ASC</strong>: sort results ascending. Has to be used in conjunction with a sorting type below.</li>
			<br />
			<li><strong>DATE</strong>: sort results by creation date (default)</li>
			<li><strong>SCORE</strong>: sort results by score</li>
			<li><strong>RELEVANCE</strong>: sort results by relevance</li>
			<li><strong>WIDTH</strong>: sort results by width</li>
			<li><strong>HEIGHT</strong>: sort results by height</li>
			<li><strong>COMMENTS</strong>: sort results by number of comments</li>
			<li><strong>RANDOM</strong>: sort results randomly</li>
		</ul>
	</div>
	<h4>Credits</h4>
	<div class="field">
		<p>Velvet&apos;s head: <a href="http://jeatz-axl.deviantart.com/art/Twilight-Velvet-442111330">http://jeatz-axl.deviantart.com/art/Twilight-Velvet-442111330</a></p>
		<p>Velvet&apos;s cutie mark: <a href="http://greywander87.deviantart.com/art/Cutie-Mark-Twilight-Velvet-357204132">http://greywander87.deviantart.com/art/Cutie-Mark-Twilight-Velvet-357204132</a></p>
	</div>
</div>
`;
