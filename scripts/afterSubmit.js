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
                newLink = newLink.replace(/sf=(.*)\&?/, SORT_TAGS[Object.keys(SORT_TAGS)[i]]);
            else
                newLink += "&sf=" + SORT_TAGS[Object.keys(SORT_TAGS)[i]];
        }

        newLink = newLink.replace(new RegExp("\(AND|OR|\\,|\\&\\&|\\|\\|\)?\(\\+\)?" + Object.keys(SORT_TAGS)[i], "g"), ""); //Removing from the query
    }
}

// ---------- ASC/DESC ----------
if (~newLink.indexOf("ASC"))
{
    newLink = newLink.replace(/(AND|OR|\,|\&\&|\|\|)?(\+)?ASC/g, "");    //Removing from the query

    if (~newLink.indexOf("&sd="))
        newLink = newLink.replace(/sd=desc/, "sd=asc"); //If the sorting is desc, changing it to asc
    else
        newLink += "&sd=asc";
}
else if (~newLink.indexOf("DESC"))
{
    newLink = newLink.replace(/(AND|OR|\,|\&\&|\|\|)?(\+)?DESC/g, "");   //Removing from the query

    if (~newLink.indexOf("&sd="))
        newLink = newLink.replace(/sd=asc/, "sd=desc"); //If the sorting is asc, changing it to desc
    else
        newLink += "&sd=desc";
}

//Cleaning the query from unnecessary characters
newLink = newLink.replace(/\+{2,}/g, "+"); //Unnecessary plusses

//If the query is empty, we put the * wildcard
if (newLink.match(/\?q=\+*$/) || newLink.match(/\?q=\+*\&/))
    newLink = newLink.replace(/\?q=\+*/, "?q=*");

if (newLink !== oldLink)
    window.location.replace(newLink);
