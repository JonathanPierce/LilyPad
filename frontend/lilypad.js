// Globals
var req_url = "http://localhost:2014/";

// Bootstrap the application
window.onload = function() {
	// Add events listeners
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
}