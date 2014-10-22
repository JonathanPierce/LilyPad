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

	$("#testingButton").click(function() {
		if(document.querySelector('#testingPage').classList.contains('hidden')) {
			switchMainScreen('testingPage');
		} else {
			switchMainScreen('launchPage');
		}
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

var switchMainScreen = function(screen, args) {
	// Hide all main pages
	var mainsections = document.querySelectorAll('.mainsection');
	mainsection = mainsections || []; // handle null case
	for(var i = 0; i < mainsections.length; i++) {
		if(!mainsections[i].classList.contains('hidden')) {
			mainsections[i].classList.add('hidden');
		}
	}

	// Show the one we want to show
	var toshow = document.querySelector('#' + screen);
	if(toshow) {
		toshow.classList.remove('hidden');
	}
 
	// Initalize the edit page (if necessary)
	if(screen === 'editPage') {
		// do stuff
	}

	// Initalize the launch page (if necessary)
	if(screen === 'launchPage') {
		renderLaunchPage();
	}
};

var dummyPads = [{name: "CS 233", color: "blue"},{name: "MATRIX", color: "red"},{name: "Free Time", color: "orange"}];
var renderLaunchPage = function() {
	var screen = document.querySelector("#launchPage");

	// clear whatever is there now
	screen.innerHTML = "";

	// We'll use delagted click/hover handlers. Don't worry about individual event listeners.
	for(var i = 0; i < dummyPads.length; i++) {
		// Create the box
		var padbox = document.createElement("DIV");
		padbox.setAttribute("class", "padbox noselect");
		padbox.style.backgroundColor = dummyPads[i].color;

		// Give it a name
		var padboxname = document.createElement("DIV");
		padboxname.setAttribute("class", "padboxname");
		padboxname.innerHTML = dummyPads[i].name;
		padbox.appendChild(padboxname);

		// Handle the play and edit buttons
		var playbutton = document.createElement("DIV");
		playbutton.setAttribute("class", "padboxplaybutton");
		playbutton.setAttribute("title", "Launch Pad");
		playbutton.innerHTML = "";
		padbox.appendChild(playbutton);
		var editbutton = document.createElement("DIV");
		editbutton.setAttribute("class", "padboxeditbutton");
		editbutton.setAttribute("title", "Edit Pad");
		editbutton.innerHTML = "";
		padbox.appendChild(editbutton);
		var buttonlabels = document.createElement("DIV");
		buttonlabels.setAttribute("class", "padboxlabels");
		buttonlabels.innerHTML = "<div style='float:left;'>Edit Pad</div><div style='float:right;''>Launch Pad</div>";
		padbox.appendChild(buttonlabels);

		// Add it to the page
		screen.appendChild(padbox);
	}
};