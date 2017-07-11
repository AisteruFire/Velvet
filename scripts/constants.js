/*
    constants.js

    This file contains all constants the extension needs to work properly and consistently. They are not initialised as constants because they may be injected mor than once per page.
*/

var DEFAULT_QUICK_TAGS = "cute", DEFAULT_ALIASES = "";

//Message to display upon Velvet's installation. Backslashes are doubled, because it is processed a second time so it must be escaped twice.
var WELCOME_MESSAGE = "Thank you for installing Velvet ! <3 Here are some explanations :\\n\\n-> Quick tags are tags you often use and would like to insert in your requests more easily. In order to do that, type your favorite tags as if you were searching them. To insert them, you'll only have to press the Velvet icon near the search bar, and they'll magically appear.\\n\\n-> Aliases are useful if you want to reduce long requests to a single expression, like turning 'pegasus AND cute AND chest fluff AND safe' to just 'pegacute'. Be careful, for if you choose an alias that is already an existing tag, you won't be able to search it properly.\\n\\nFinally, if you need to access to those settings, you can either go to derpibooru's settings or click on Velvet's icon.\\n\\nIf you want to contact me, feel free to send a private message to fandechimie on derpibooru. See ya !";

//Title of the quick tags button
var QUICK_TAGS_BUTTON_TITLE = "Velvet quick search";
