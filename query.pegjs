/*
	Derpibooru query grammar
*/

Query
	= Tag ((" " Operator / ",") " " Tag)*

Tag
	= $(Word (" " Word)*)

// Every word except for operators
Word
	= word:[a-zA-Z0-9]+ { return (word == "AND" || word == "OR" ? false : word); }

Operator
	= "AND" / "OR" / "&&" / "||"
