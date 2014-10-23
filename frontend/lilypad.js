// Globals
var req_url = "http://localhost:2014/";
var colors = ["red", "green", "blue", "orange", "purple"]; // SHOULD COME FROM CONFIG.JSON

// Bootstrap the application
window.onload = function() {
	// Add event listeners
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
		var currentList = ['testingPage', 'launchPage', 'createEditPage'];

		var next = "testingPage";
		for(var i = 0; i < currentList.length; i++) {
			if(!document.querySelector('#' + currentList[i]).classList.contains('hidden')) {
				next = currentList[(i + 1) % currentList.length];
			}
		}

		switchMainScreen(next);
	});

	// Switch to the first page
	switchMainScreen('createEditPage');

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
 
	// Initialize the testing page (if necessary)
	if(screen === 'testingPage') {
		document.querySelector("#subheader").innerHTML = "Testing";
	}

	// Initalize the edit page (if necessary)
	if(screen === 'createEditPage') {
		renderCreateEditPage();
	}

	// Initalize the launch page (if necessary)
	if(screen === 'launchPage') {
		renderLaunchPage();
	}
};

var dummyPads = [{name: "CS 233", color: "blue"},{name: "MATRIX", color: "red"},{name: "Free Time", color: "orange"}];
var renderLaunchPage = function() {
	var screen = document.querySelector("#launchPage");

	// Set the header subtitle
	document.querySelector("#subheader").innerHTML = "Home";

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

var renderCreateEditPage = function() {
	var renderColorPicker = function(node) {
		for(var i = 0; i < colors.length; i++) {
			var colorBlob = document.createElement('DIV');
			colorBlob.setAttribute('class', 'colorBlob');
			colorBlob.style.backgroundColor = colors[i];
			if(i == 0) {
				colorBlob.classList.add('activeColorBlob');
			}
			node.appendChild(colorBlob);
		}
	};

	// Update the header title
	document.querySelector("#subheader").innerHTML = "Edit Pad";

	var screen = document.querySelector('#createEditPage');
	screen.innerHTML = "";

	// Create the body header
	var bodyheader = document.createElement("DIV");
	bodyheader.setAttribute('class', 'editHeader');
	bodyheader.innerHTML = '<input type="text" class="editHeaderName" placeholder="name your pad..." maxlength="40"></input><div class="colorPickerHost" title="choose a color..."></div>';
	renderColorPicker(bodyheader.querySelector('.colorPickerHost'));
	screen.appendChild(bodyheader);

	// Create the body


	// Create the (floating) footer
};