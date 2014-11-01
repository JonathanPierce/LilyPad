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
		program: "Evince",
        //Jon's machine
		//files: ["home/jmpierc2/cs233/lab7.pdf", "home/jmpierc2/cs233/lab8.pdf"]
        //Andrew's machine
        files: ["~/research/functional_logic/Curry_report.pdf",
            "~/research/functional_logic/Hanus_Multi-paradigm_Declarative_Languages.pdf"]
	},{
		program: "Calculator",
		files: []
	},{
		program: "gVim",
        //Jon's machine
		//files: ["home/jmpierc2/lilypad/frontend/frontend.js", "home/jmpierc2/lilypad/frontend/lilylibrary.js", "home/jmpierc2/lilypad/backend/backend.py", "home/jmpierc2/lilypad/backend/config.json"]
        //Andrew's machine
		files: ["~/classes/cs465/LilyPad/frontend/frontend.js", "~/classes/cs465/LilyPad/frontend/lilylibrary.js", "~/classes/cs465/LilyPad/backend/backend.py", "~/classes/cs465/LilyPad/backend/config.json"]
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
        //Jon's machine
		//files: ["home/jmpierc2/cs473/hw4.tex", "home/jmpierc2/cs473/hw4.tex"]
        //Andrew's machine
		files: ["~/maude/maude-psl/masters/description.tex", 
        "~/maude/maude-psl/masters/thesis.tex"]
	},
	{
		program: "Terminal",
		files: []
	},
	{
		program: "Evince",
		files: ["~/maude/maude-psl/masters/thesis.pdf", 
        "~/maude/maude-npa-v2_0/maude-npa-manual-v2_0.pdf"]
	}
];
// END SAMPLE DATA

// generateShellScript
// input (Object): pad - A pad in the format of the sample one above
// output (String): A shell script in the format defined by the google doc
// author: Andrew 
var generateShellScript = function(pad) {
    scriptText = ""
    var programName;
    var programFiles;
    var fileString;
    for (var i=0; i < pad.contents.length; i++){
        programName = pad.contents[i].program;
        programFiles = pad.contents[i].files;
        var programInfo = getProgramInfo(programName, config);
        fileString = "";
        for (var j=0; j < programFiles.length; j++){
            fileString += ' "' +  programFiles[j] + '"';
        }
        scriptText += "( { " + programInfo.system_name + fileString + " ; } ) &\n";
    }
    return scriptText;
};
//console.log(generateShellScript(pad))

// insertIntoPad
// Inserts every element of the delta into the pad, keeping track of paths 
// that appear in both pad and delta, and are associated with the same program.
// input (Object): pad - What we are inserting to. A pad like the one above.
// input (Array): delta - Delta array (stuff we're adding), like the one above
// output (Array): Array of paths found in both pad and delta that are 
// associated with the same program.
// author: Lorraine
var insertIntoPad = function(pad, delta) {
	var retArr = [];
	//var retCtr = 0;
	//for each program in delta
	for(var i = 0;i<delta.length;i++){
		//see if it is already in pad contents
		var hasProg = false;
		for(var j=0;j<pad.contents.length;j++){
			//if yes then 
			if(pad.contents[j].program == delta[i].program){
				hasProg = true;
				//if there are files under that prog in delta
				if(0 != delta[i].files.length){
				  var arrEntry = new Object();
				  arrEntry.program = delta[i].program;
				  arrEntry.files = [];
				  var hasDuplicateFile = false;
				  //then for each of those files
				   for(var k = 0; k<delta[i].files.length;k++){
					var hasFile = false;
					//if in pad add to duplicates array entry
					for(var l = 0; l<pad.contents[j].files.length;l++){
					   if(pad.contents[j].files[l] == delta[i].files[k]){
						arrEntry.files.push(delta[i].files[k]);
						hasFile = true;
						hasDuplicateFile = true;
					   }
					}
					//else add to pad contents 
					if(!hasFile){
						pad.contents[j].files.push(delta[i].files[k]);
					}
				   }
				   if(hasDuplicateFile){
					retArr.push(arrEntry);
				   }
				}
				//else add to duplicates
				else{
					retArr.push(delta[i]);
				}
			}
		}
		//if not in pad then add everything
		if(!hasProg){
			pad.contents.push(delta[i]);
		}		

	}
	return retArr;
};

var getFileType = function(path){
	if(validateURL(path)) {
		return "url";
	}
	var dotIndex = path.lastIndexOf(".");
	return path.substring(dotIndex + 1);
};

var getDefaultProgram = function(fileType, config) {
	var defaults = config.defaults;
	for(i = 0; i < defaults.length; i++) {
		if(fileType === defaults[i].type) {
			return defaults[i].program;
		}
	}
	return null;
};

var createDeltaArr = function(programToPaths) {
	var deltaArr = [];	
	for(programName in programToPaths) {
		paths = programToPaths[programName];
		delta = {program: programName, files: paths};
		deltaArr.push(delta);
	}
	return deltaArr;
};

var isValidURL = function(str) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	return regexp.test(str);
}

// getDefaultPrograms
// Given an array of paths, create a delta object like the example one above.
// Match each path to the appropriate default program from config.json.
// author: John
var getDefaultPrograms = function(paths, config) {
	
	var programToPaths = {};
	var i = 0;
	for(; i < paths.length; i++) {
		var path = paths[i];
		var defaultProgram = "";

		var fileType = getFileType(path);
		defaultProgram = getDefaultProgram(fileType, config);
		if(defaultProgram === null) {
			continue; // log error?
		}

		if(!(defaultProgram in programToPaths)) {
			programToPaths[defaultProgram] = [path];
		} else {
			programToPaths[defaultProgram].push(path)
		}
	}
	return createDeltaArr(programToPaths); 
};

var getAlternativePrograms = function(type, config) {
	var altPrograms = [];
	var programs = config.programs;
	var j = 0;
	for(;j < programs.length; j++) {
		var program = programs[j];
		if($.inArray(type, program.types) !== -1){
			altPrograms.push(program.display_name);
		}
	}
	return altPrograms;
};

// getAlternativePrograms
// Depends on config.json!
// This function should have a way to detect URLs
// input (Array): A array of file/url paths
// output: A list of programs (array of display-name strings) that supports 
// every filetype in the list.
// author: John
var getAlternativeProgramsList = function(paths, config) {
	if(paths.length == 0) {
		return [];
	}

	var altProgramsList = [];
	for(var i = 0; i < paths.length; i++) {
		var path = paths[i];
		var type = getFileType(path);

		var altPrograms = getAlternativePrograms(type, config);

		altProgramsList.push(altPrograms);
	}

	var results = altProgramsList[0];
	for(var i = 1; i < altProgramsList.length; i++) {
		results = results.filter(function(n) {
			return altProgramsList[i].indexOf(n) !== -1;
		});
	}

	return results;
};

// Switches the program associated with certain paths.
// Given a pad as input and a delta , adds the program/file pairings specified 
// in delta to pad. Like insertIntoPad, this should return the list of 
// paths that appear in both pad and delta and are associated with the same
// program.
// // author: Lorraine
var switchFileToAlternative = function(pad, file, oldProgram, newProgram) {
	removeFileFromProgram(pad, file, oldProgram);
	insertIntoPad(pad, [{program: newProgram, files: [file]}]);

	// Remove 
};

// getConciseProgramList
// Returns an array mapping program display names to the number of files
// associated with said program.
// input (Object): pad - A pad like the example one above
// output (Object array): Array of {name: "program display name", count: int}
// author: Andrew 
var getConciseProgramList = function(pad) {
    var array = [];
    for (var i = 0; i < pad.contents.length; i++){
        array.push({name: pad.contents[i].program, 
                    count: pad.contents[i].files.length});
    }
    return array
};

/*
var array = getConciseProgramList(pad);
for(var i = 0; i < array.length; i++)
{
    console.log(array[i]);
}
*/

// getStandalonePrograms
// Searches the config object, returns an array of all entries that are standalone programs
// author: Lorraine
var getStandalonePrograms = function(config) {
	var progs = config.programs;
	var ctr = 0;
	var retArr = [];
	for(var i = 0; i<progs.length;i++){
		if(true == progs[i].standalone){
			//add this program to the return array
			retArr[ctr] = progs[i];
			ctr++;
		}
	}
	return retArr;

};

// Given a program name string, returns the corresponding entry from the config.
// author: John
// Yes, I wrote this for you. Don't feel bad. -Jonathan
var getProgramInfo = function(name, config){
	for(var i = 0; i < config.programs.length; i++) {
		if(config.programs[i].display_name.toLowerCase() === name.toLowerCase()) {
			return config.programs[i];
		}
	}
};

//I stole this regex without shame from one searls at:
//https://gist.github.com/searls/1033143
//which is a Javascript form of the regex discussed by one 
//John Gruber at:
//http://daringfireball.net/2010/07/improved_regex_for_matching_urls
var urlRegExp = /^((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))$/i;
//...The Internet is awesome.
//returns true if input (a string) is a valid URL.
// author: Andrew
var validateURL = function(input){
    return urlRegExp.test(input)
};

// Removes the pad with the same name from the list
var removePad = function(pad) {
	for(var i = 0; i < pads.length; i++) {
		if(pads[i].name === pad.name) {
			pads.splice(i,1);
			return;
		}
	}
};

// Removes the program from the pad
var removeProgram = function(pad, program) {
	var contents = pad.contents;
	for(var i = 0; i < contents.length; i++) {
		if(contents[i].program === program) {
			contents.splice(i,1);
			return;
		}
	}
};

var removeFileFromProgram = function(pad, file, program) {
	var contents = pad.contents;
	for(var i = 0; i < contents.length; i++) {
		if(contents[i].program === program) {
			var files = contents[i].files;
			for(var j = 0; j < files.length; j++) {
				if(files[j] === file) {
					files.splice(j,1);

					if(files.length == 0) {
						removeProgram(pad, program);
					}

					return;
				}
			}
		}
	}
};
