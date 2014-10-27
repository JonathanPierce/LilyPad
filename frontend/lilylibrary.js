// SAMPLE DATA (Can be used for testing!)
// A sample pad
var pad = {
	name: 'Sample Pad',
	color: 'red',
	contents: [
	{
		program: "Firefox",
		files: ["http://www.illinois.edu", "http://www.cnn.com", "http://www.piazza.com"]
	},{
		program: "Adobe Reader",
		files: ["home/jmpierc2/cs233/lab7.pdf", "home/jmpierc2/cs233/lab8.pdf"]
	},{
		program: "Calculator",
		files: []
	},{
		program: "Sublime Text",
		files: ["home/jmpierc2/lilypad/frontend/frontend.js", "home/jmpierc2/lilypad/frontend/lilylibrary.js", "home/jmpierc2/lilypad/backend/backend.py", "home/jmpierc2/lilypad/backend/config.json"]
	}
	]
};
// A pad delta. Essentially a "contents" array like the one from above.
var paddelta = [
	{
		program: "Firefox",
		files: ["http://www.cnn.com", "http://www.twitter.com", "http://www.facebook.com"]
	},
	{
		program: "Kile",
		files: ["home/jmpierc2/cs473/hw4.tex", "home/jmpierc2/cs473/hw4.tex"]
	},
	{
		program: "Terminal",
		files: []
	},
	{
		program: "Adobe Reader",
		files: ["home/jmpierc2/cs233/lab9.pdf", "home/jmpierc2/cs233/lab7.pdf"]
	}
];
// END SAMPLE DATA

// generateShellScript
// input (Object): pad - A pad in the format of the sample one above
// output (String): A shell script in the format defined by the google doc
// author: Andrew 
var generateShellScript = function(pad) {

};

// insertIntoPad
// Inserts every element of the delta into the pad, keeping track of paths 
// that appear in both pad and delta, and are associated with the same program.
// input (Object): pad - What we are inserting to. A pad like the one above.
// input (Array): delta - Delta array (stuff we're adding), like the one above
// output (Array): Array of paths found in both pad and delta that are 
// associated with the same program.
// author: Lorraine
var insertIntoPad = function(pad, delta) {
	//for each program in delta
		//see if it is already in pad contents
			//if not then add everything
			//if yes then 
				//if there are files under that prog in delta
				  //then for each of those files
					//if in pad add to duplicates array
					//else add to pad
				//else add to duplicates
};

// getDefaultPrograms
// Given an array of paths, create a delta object like the example one above.
// Match each path to the appropriate default program from config.json.
// author: John
var getDefaultPrograms = function(paths, config) {

};

// getAlternativePrograms
// Depends on config.json!
// This function should have a way to detect URLs
// input (Array): A array of file/url paths
// output: A list of programs (array of display-name strings) that supports 
// every filetype in the list.
// author: John
var getAlternativePrograms = function(paths, config) {

};

// switchToAlternative
// Switches the program associated with certain paths.
// Given a pad as input and a delta , adds the program/file pairings specified 
// in delta to pad. Like insertIntoPad, this should return the list of 
// paths that appear in both pad and delta and are associated with the same
// program.
// // author: Lorraine
var switchToAlternative = function(pad, delta) {

};

// getConciseProgramList
// Returns an array mapping program display names to the number of files
// associated with said program.
// input (Object): pad - A pad like the example one above
// output (Object array): Array of {name: "program display name", count: int}
// author: Andrew 
var getConciseProgramList = function(pad) {

};

// getStandalonePrograms
// Searches the config object, returns an array of all entries that are standalone programs
// author: Lorraine
var getStandalonePrograms = function() {

};

// Given a program name string, returns the corresponding entry from the config.
// author: John
var getProgramInfo = function(name, config){

};

//returns true if input is a valid URL.
// author: Andrew
var validateURL = function(input){

};
