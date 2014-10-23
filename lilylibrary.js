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
// A pad delta. Eessentially a "contents" array liek the one from above.
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
var generateShellScript = function(pad) {

};

// insertIntoPad
// Inserts every element of the delta into the pad, keeping track of duplicates
// input (Object): pad - What we are inserting to. A pad like the one above.
// input (Array): delta - Delta array, like the one above
// output (Array): Array of duplicates found in the same format as the delta
var insertIntoPad = function(pad, delta) {

};

// getDefaultPrograms
// Given an array of paths, create a delta object like the example one above.
// Match each path to the appropriate default program from config.json.
var getDefaultPrograms = function(paths) {

};

// getAlternativePrograms
// Depends on config.json!
// This function should have a way to detect URLs
// input (Array): A array of file/url paths
// output: A list of programs (array of display-name strings) that supports every filetype in the list
var getAlternativePrograms = function(paths) {

};

// switchToAlternative
// Switches the program associated with certain paths.
// Given a pad as input and a delta, removes members of the delta from the current pad,
// and then adds them again using insertIntoPad().
var switchToAlternative = function(pad, delta) {

};

// getConsiseProgramList
// Returns an array matching program display names to associated files counts
// input (Object): pad - A pad like the example one above
// output (Object array): Array of {name: "program display name", count: int}
var getConsiseProgramList = function(pad) {

};