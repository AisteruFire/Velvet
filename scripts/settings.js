/*
    settings.js

    This file generates a new tab in the settings page on derpibooru. It contains the settings for Velvet, such as aliases and the quick tags
*/

const settingsTable = document.getElementById('js-setting-table');
const tabSelect = settingsTable.firstChild;

// ---------- Creating the tab ----------
const velvetTab = '<a id="velvet" href="#" data-click-tab="velvet" style="color:darkorchid">Velvet</a>';
tabSelect.insertAdjacentHTML('beforeend', velvetTab);

// ---------- Creating the content of the tab ----------
const content = `
  <div class="block__tab hidden" data-tab="velvet">
    <h4>Quick search</h4>
    <div class="field">
      <label for="quick_tags">Tags to add to the search in a snap. Aliases are allowed. Leave empty to disable Velvet's icon.</label>
      <textarea class="input input--wide" autocapitalize="none" id="user_quick_tags" placeholder="Quick tags to insert with the Velvet button"></textarea>
    </div>
    <h4>Aliases</h4>
    <div class="field">
      <label for="user_aliases">Aliases used to shorten commonly used requests by assigning an equivalent to multiple tags.</label>
      <textarea class="input input--wide" autocapitalize="none" id="user_aliases" placeholder="alias=tags ; alias=tags ; ..."></textarea>
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

// Inserting content so that it reacts the same as the other tabs
tabSelect.insertAdjacentHTML('afterend', content);

const form = document.querySelector('form.edit_user');
const aliases = document.getElementById('user_aliases');
const quickTags = document.getElementById('user_quick_tags');

// ---------- Saving the user's preferences on form submission ----------

form.addEventListener("submit", () => {
  chrome.storage.sync.set({
    quickTags: quickTags.value,
    aliases: aliases.value
  });
});

// ---------- Retrieving the user's preferences ----------

chrome.storage.sync.get({
  // Default values
  quickTags: DEFAULT_QUICK_TAGS,
  aliases: DEFAULT_ALIASES
}, data => {
  quickTags.value = data.quickTags,
  aliases.value = data.aliases
});
