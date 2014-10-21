// Globals
var req_url = "http://localhost:2014/";

// Bootstrap the application
window.onload = function() {
	// Add events listeners
	$("#filesButton").click(pick);

	console.log("Lilypad is ready!");
};

var log = function(input) {
	input = input || "log: No input found.";
	console.log(input);
};

var pick = function(callback) {
	var derp = function(response) {
		console.log('response received!');
		console.log(response);
	};

	$.getJSON(req_url + 'pick').done(derp);
};