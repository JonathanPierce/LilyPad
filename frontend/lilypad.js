// Globals
var req_url = "http://localhost:2014/";
var config = {};
var pads = {};

// Bootstrap the application
window.onload = function() {
	// Add event listeners
	// $("#filesButton").click(function() {
	// 	pick(function(result) {
	// 		var paths = result.paths;
	// 		document.getElementById('filesTextArea').value = paths.join('\n');
	// 	});
	// });

	// $("#shellButton").click(function() {
	// 	launch(function(result) {
	// 		console.log(result);
	// 	});
	// });

	// $("#getJSONButton").click(function() {
	// 	getJSON(function(result) {
	// 		document.getElementById("JSONTextArea").value = JSON.stringify(result.JSON);
	// 	})
	// });

	// $("#setJSONButton").click(function() {
	// 	setJSON(function(result) {
	// 		console.log(result);
	// 	})
	// });

	$("#testingButton").click(function() {
		var currentList = ['launchPage', 'createEditPage'];

		var next = "testingPage";
		for(var i = 0; i < currentList.length; i++) {
			if(!document.querySelector('#' + currentList[i]).classList.contains('hidden')) {
				next = currentList[(i + 1) % currentList.length];
			}
		}

		switchMainScreen(next);
	});

	// Get the configuration
	getJSON("config.json", function(result) {
		config = result;

		// Now get the pads
		getJSON("pads.json", function(pad_result) {
			pads = pad_result.pads;

			// Switch to the first page
			switchMainScreen('createEditPage');

			// WE DID IT
			console.log("Lilypad is ready!");
		})
	});
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

var getJSON = function(file, callback) {
	$.getJSON(req_url + 'getjson', {file: file}).done(function(result) {
		callback(result.JSON);
	});
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

var renderLaunchPage = function() {
	var screen = document.querySelector("#launchPage");

	// Set the header subtitle
	document.querySelector("#subheader").innerHTML = "Home";

	// clear whatever is there now
	screen.innerHTML = "";

	// We'll use delagted click/hover handlers. Don't worry about individual event listeners.
	for(var i = 0; i < pads.length; i++) {
		// Create the box
		var padbox = document.createElement("DIV");
		padbox.setAttribute("class", "padbox noselect");
		padbox.style.backgroundColor = pads[i].color;

		// Give it a name
		var padboxname = document.createElement("DIV");
		padboxname.setAttribute("class", "padboxname");
		padboxname.innerHTML = pads[i].name;
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

	// ToDo: Handle the case where there are no pads!
};

var renderCreateEditPage = function() {
	var renderColorPicker = function(node) {
		for(var i = 0; i < config.colors.length; i++) {
			var colorBlob = document.createElement('DIV');
			colorBlob.setAttribute('class', 'colorBlob');
			colorBlob.style.backgroundColor = config.colors[i];
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
	document.querySelector('.editHeaderName').focus();

	// Create the body
	var body = document.createElement("DIV");
	body.setAttribute('class', 'editBody');
	renderPadContents(body, pads[0]); // Do the real work. Hardcodes to pads[0] for now.
	screen.appendChild(body);

	// Create the (floating) footer
	var footer = document.createElement("DIV");
	footer.setAttribute('class', 'editFooter');
	footer.innerHTML = '<div id="editURLWrapper"><input type="text" id="editURL" placeholder="enter a url..." /><div id="editURLGo" class="noselect" title="submit this URL"></div></div><div id="editFiles" class="noselect">choose some files</div><div id="editStandalone" class="noselect">pick an app</div>';
	screen.appendChild(footer);
};

var renderPadContents = function(node, arg) {
	var insides = "";
	for(var i = 0; i < 500; i++) {
		insides += "lorem ipsum solor si dement. Hippy hoppity ho. Der de der de der. Rated PG-13.<br/>";
	}
	node.innerHTML = insides;
};

/* 
ToDo:
- Overlay control (for picking programs, help page, etc...)
- Bottom bar passive info (conside program list, tooltips, feedback...)
- Chevron popup window
*/