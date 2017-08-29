/*
    constants.js

    This file contains all constants the extension needs to work properly and consistently. They are not initialised as constants because they may be injected mor than once per page.
*/

// ========== Default parameters ==========

const DEFAULT_QUICK_TAGS = "cute AND fluffy",
	DEFAULT_ALIASES = "";

// Characters used for the ditto operator
const DEFAULT_AND_FLAG = "!", DEFAULT_OR_FLAG = "?";

// Operators used by default when replacing ditto operator by AND or OR. Can be 'AND' or '&&' or ',' ; 'OR' or '||'
const DEFAULT_PREFERED_AND = "AND", DEFAULT_PREFERED_OR = "OR";

// Whether the aliases should be wrapped with parenthesis or not
const DEFAULT_WRAP_ALIASES = false;

// Which operator should be used for the ditto operator in case the user doesn't give a flag
const DEFAULT_OPERATION = "AND";

// Whether Velvet should show which was the last image seen when searching for this query
const DEFAULT_INDICATE_LAST_SEEN = false;

// ========== Labels ==========

// Message to display upon Velvet's installation. Backslashes are doubled, because it is processed a second time so it must be escaped twice.
const WELCOME_MESSAGE = "Thank you for installing Velvet ! <3 Here are some explanations :\\n\\n-> Quick tags are tags you often use and would like to insert in your requests more easily. In order to do that, type your favorite tags as if you were searching them. To insert them, you'll only have to press the Velvet icon near the search bar, and they'll magically appear.\\n\\n-> Aliases are useful if you want to reduce long requests to a single expression, like turning 'pegasus AND cute AND chest fluff AND safe' to just 'pegacute'. Be careful, for if you choose an alias that is already an existing tag, you won't be able to search it properly.\\n\\nFinally, if you need to access to those settings, you can either go to derpibooru's settings or click on Velvet's icon.\\n\\nIf you want to contact me, feel free to send a private message to fandechimie on derpibooru. See ya !";

// Title of the quick tags button
const QUICK_TAGS_BUTTON_TITLE = "Velvet quick search";

// Content of the Velvet tab
const VELVET_TAB_CONTENT = `
<div class="block__tab hidden" data-tab="velvet">
	<h4>Quick search</h4>
	<div class="field">
		<label for="quick_tags">Tags to add to the search in a snap. Aliases are allowed. Leave empty to disable Velvet's icon.</label>
		<textarea class="input input--wide" autocapitalize="none" id="user_quick_tags" placeholder="Quick tags to insert with the Velvet button"></textarea>
	</div>

	<h4>Aliases</h4>
	<div class="field">
		<label for="user_aliases">Aliases used to shorten commonly used requests by assigning a short name to multiple tags. Place one alias per line. Aliases containing themselves will be ignored.</label>
		<textarea class="input input--wide" autocapitalize="none" id="user_aliases" placeholder="alias = tags\nalias = tags\n..."></textarea>
		<label for="wrapAliases">Wrap aliases with parenthesis</label><input type="checkbox" id="wrapAliases" class="checkbox" />
		<div class="fieldlabel">
			<i>This can help avoiding operator priority-based issues.</i>
		</div>
	</div>

	<h4>Ditto operator</h4>
	<div class="field">
		<p>There is a polymorphous operator available : the <em>ditto</em>, represented by <code>::</code>, which can be either an AND or an OR. In order to choose its role, you simply have to add the appropriate flag to your alias tag.</p>
		<p>For example, if your alias is <code>smexy = glasses :: sexy :: cute</code>, your AND flag <code>!</code> and your OR flag <code>?</code>, searching for <code>smexy!</code> will search for <code>glasses AND sexy AND cute</code>, whereas <code>smexy?</code> will search for <code>glasses OR sexy OR cute</code>.</p>
		<p>There also is a special flag <code>\`</code> which allows you to use a certain flag for all sub-aliases in a query which aren't coupled with a flag themselves. For example, if you have an alias <code>abc</code> replaced by <code>def :: safe</code> and <code>def</code> replaced by <code>aj :: cute</code>, <code>\`abc?</code> will be transformed into <code>def? OR safe</code>, then into <code>aj OR cute OR safe</code>, whatever may be the default operator to use. If <code>abc</code> were replaced by <code>def! :: safe</code>, searching for <code>\`abc?</code> would produce <code>aj AND cute OR safe</code> because of the <code>!</code> after <code>def</code>.</p>
		<p>Allowed flags : .-;:_{}[]'?+@#%&/|=</p>

		<table id="dittoTable">
			<tr>
				<td><label for="andFlag">AND flag</label><input type="text" maxlength="1" id="andFlag" class="input" /></td>

				<td><label for="orFlag">OR flag</label><input type="text" maxlength="1" id="orFlag" class="input" /></td>

				<td>
					<label for="preferedAnd">Prefered AND form</label>
					<select id="preferedAnd" class="input">
						<option value="AND">AND</option>
						<option value="&&">&&</option>
						<option value=",">,</option>
					</select>
				</td>

				<td>
					<label for="preferedOr">Prefered OR form</label>
					<select id="preferedOr" class="input">
						<option value="OR">OR</option>
						<option value="||">||</option>
					</select>
				</td>
			</tr>
		</table>
		<label for="defaultOperation">In the case where no flag is given with a ditto alias, use the following operator by default : </label>
		<select id="defaultOperation" class="input">
			<option value="AND">AND</option>
			<option value="OR">OR</option>
		</select>
	</div>

	<h4>Velvet reminder (soon)</h4>
	<div class="field">
		<p>Have you ever roamed on Derpibooru, admiring an artist's beautiful designs or spending time searching for the best Twilight x Flash Sentry picture ever, and when you come back next time, there's a gazillion new pictures and you can't remember where you were ? Well, not anymore ! Velvet can tell you which picture was the last post in the page you were on your last visit !</p>
		<label for="indicateLastSeen">Ask Velvet to remind you which picture was the last post on searches</label><input type="checkbox" id="indicateLastSeen" class="checkbox" />
		<div class="fieldlabel">
			<i>If this setting is activated, the last picture seen the last time you made a search will be bordered with a soothing color.</i>
		</div>
	</div>

	<h4>Sorting tags</h4>
	<div class="field">
		<p>The following tags are added by Velvet to ease searches. They are used as any other normal tag:</p>
		<ul>
			<li><strong>DESC</strong>: sort results in descending order (default).</li>
			<li><strong>ASC</strong>: sort results in ascending order.</li>
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
