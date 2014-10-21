// Globals
var req_url = "http://localhost:2014/";

// Bootstrap the application
window.onload = function() {
	// Add eventt listeners
	$("#filesButton").click(function() {
		pick(function(result) {
			var paths = result.paths;
			document.getElementById('filesTextArea').value = paths.join('\n');
		});
	});

	$("#shellButton").click(function() {
		launch(function(result) {
			console.log(result);
		});
	});

	$("#getJSONButton").click(function() {
		getJSON(function(result) {
			document.getElementById("JSONTextArea").value = JSON.stringify(result.JSON);
		})
	});

	$("#setJSONButton").click(function() {
		setJSON(function(result) {
			console.log(result);
		})
	});

	console.log("Lilypad is ready!");
};

var log = function(input) {
	input = input || "log: No input found.";
	console.log(input);
};

var pick = function(callback) {
	$.getJSON(req_url + 'pick').done(callback);
};

var launch = function(callback) {
	var text = document.getElementById("shellTextArea").value;
	$.getJSON(req_url + 'launch', {script: text}).done(callback);
};

var getJSON = function(callback) {
	var file = document.getElementById("JSONFileName").value;
	$.getJSON(req_url + 'getjson', {file: file}).done(callback);
};

var setJSON = function(callback) {
	var file = document.getElementById("JSONFileName").value;
	var data = document.getElementById("JSONTextArea").value;
	$.getJSON(req_url + 'setjson', {file: file, data: data}).done(callback);
};