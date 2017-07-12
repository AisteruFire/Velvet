/*
    afterSubmit.js

    This file contains everything that is executed after the form is sent to the server, such as the ordering tags
*/

//Tags to replace for sorting
const SORT_TAGS = {"DATE": "created_at", "SCORE": "score", "RELEVANCE": "relevance", "WIDTH": "width", "HEIGHT": "height", "COMMENTS": "comments", "RANDOM": "random:" + Math.round(Math.random() * 10000000) };

//Remembering the link in order to know if a reload is necessary
var oldLink = window.location.search, newLink = oldLink;
//Flag used to only apply the first encountered type of sorting in case of multiple occurences
var sortingTypeFound = false;

// ---------- Sorting ----------
for (var i = 0; i < Object.keys(SORT_TAGS).length; i++)
{
    if(~newLink.indexOf(Object.keys(SORT_TAGS)[i]))
    {
        if (!sortingTypeFound)
        {
            sortingTypeFound = true;

            if (~newLink.indexOf("&sf="))
                newLink = newLink.replace(/sf=.*&?/, "sf=" + SORT_TAGS[Object.keys(SORT_TAGS)[i]]);
            else
                newLink += "&sf=" + SORT_TAGS[Object.keys(SORT_TAGS)[i]];
        }

        newLink = newLink.replace(new RegExp("(\\+)*(AND|OR|\\,|\\&\\&|\\|\\|)?(\\+)*" + Object.keys(SORT_TAGS)[i], "g"), ""); //Removing from the query
    }
}

// ---------- ASC/DESC ----------
//newSort will contain the string corresponding to the method of sorting asked by the user, oldSort will contain the other one in order to remove it from the URL
var newSort = null, oldSort = null;

if (~newLink.indexOf("ASC"))
{
    newSort = "asc";
    oldSort = "desc";
}
else if (~newLink.indexOf("DESC"))
{
    newSort = "desc";
    oldSort = "asc";
}

if (newSort)
{
    if (~newLink.indexOf("&sd="))   //If there is already an instruction for sorting in the URL...
        newLink = newLink.replace(new RegExp("sd=" + oldSort, "i"), "sd=" + newSort);
    else
        newLink += "&sd=" + newSort;
}

newLink = newLink.replace(/(\+)*(AND|OR|,|&&|\|\|)?(\+)*(ASC|DESC)/g, "");  //Removing ASC or DESC from the query

//Cleaning the query from unnecessary characters
newLink = newLink.replace(/\+{2,}/g, "+");  //Unnecessary plusses
newLink = newLink.replace(/=\+*/, "=").replace(/\+*&/g, "&");   //Plusses remaining at the beginning or the end of the query

//If the query is empty, we put the * wildcard
if (newLink.match(/\?q=\+*$/) || newLink.match(/\?q=\+*&/))
    newLink = newLink.replace(/\?q=\+*/, "?q=*");

if (newLink !== oldLink)
    window.location.replace(newLink);

