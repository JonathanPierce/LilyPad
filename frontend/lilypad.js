// Globals
var req_url = "http://localhost:2014/";
var config = {};
var pads = {};

// Bootstrap the application
window.onload = function() {
	// Show the help page
	$("#headerHelpButton").click(function() {
		var help = document.createElement("DIV");
		help.innerHTML = "Don't forget about me! :(";
		showOverlay(help);
	});

	// Allow a pad to be edited
	$("#launchPage").delegate('.padboxeditbutton', 'click', function(e) {
		var target = e.target.parentNode;
		var pad = target.pad;

		switchMainScreen('createEditPage', pad);
	});

	// Handle the footer buttons
	$(".lilyfooter").delegate('.lilyfooterbutton', 'click', function(e) {
		var id = e.target.getAttribute('id');
		var handled = false;

		if(id == 'savePadButton') {
			// TEMP!!!!!!!!!!!!!!!!!!
			handled = true;
			switchMainScreen('launchPage');
		}

		if(id == 'newPadButton') {
			handled = true;
			switchMainScreen('createEditPage', null);
		}

		if(!handled) {
			alert("Error: Button " + id + " not handled!");
		}
	});

	// Handle the color picker
	$('#createEditPage').delegate('.colorBlob', 'click', function(e) {
		document.querySelector('.activeColorBlob').classList.remove("activeColorBlob");

		e.target.classList.add('activeColorBlob');
	});

	// START SEQUENCE
	// Get the configuration
	getJSON("config.json", function(result) {
		config = result;

		// Now get the pads
		getJSON("pads.json", function(pad_result) {
			pads = pad_result.pads;

			// Switch to the first page
			switchMainScreen('launchPage');

			// WE DID IT
			showPassive("Lilypad is ready!");
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

var launch = function(sh, callback) {
	$.getJSON(req_url + 'launch', {script: sh}).done(callback);
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
			mainsections[i].classList.remove('doMainAnimation');
		}
	}

	// Hide all footer buttons and the edit footer
	var buttons = document.querySelectorAll('.lilyfooterbutton')
	for(var i = 0; i < buttons.length; i++) {
		buttons[i].classList.add("hidden");
		if(buttons[i].classList.contains(screen + "Button")) {
			buttons[i].classList.remove("hidden");
		}
	}
	document.querySelector('.editFooter').classList.add('hidden');

	// Show the one we want to show
	var toshow = document.querySelector('#' + screen);
	if(toshow) {
		toshow.classList.remove('hidden');
		toshow.offsetWidth = toshow.offsetWidth; // Force DOM reflow for animation
		toshow.classList.add('doMainAnimation');
	}
 
	// Initialize the testing page (if necessary)
	if(screen === 'testingPage') {
		document.querySelector("#subheader").innerHTML = "Testing";
	}

	// Initalize the edit page (if necessary)
	if(screen === 'createEditPage') {
		renderCreateEditPage(args);
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

		// Leave a reference
		padbox.pad = pads[i];

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

	// Handle the case where there are no pads!
	if(pads.length == 0) {
		var welcome = document.createElement('DIV');
		welcome.setAttribute('class', 'launchPageWelcome');
		welcome.innerHTML = '<h1 id="launchPageWelcomeHeader">Welcome to Lilypad!</h1><div>Click on the \'new pad\' button in the lower right-hand corner to get started. :)</div>';
		screen.appendChild(welcome);
	}
};

var renderCreateEditPage = function(current) {
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
	document.querySelector("#subheader").innerHTML = current ? "Edit Pad" : "New Pad";

	var screen = document.querySelector('#createEditPage');
	screen.innerHTML = "";

	// Create the body header
	var bodyheader = document.createElement("DIV");
	bodyheader.setAttribute('class', 'editHeader');
	bodyheader.innerHTML = '<input type="text" class="editHeaderName" placeholder="name your pad..." maxlength="40"></input><div class="colorPickerHost" title="choose a color..."></div>';
	renderColorPicker(bodyheader.querySelector('.colorPickerHost'));
	screen.appendChild(bodyheader);

	if(!current) {
		// only focus if the pad is new
		document.querySelector('.editHeaderName').focus();
	}
	// Set the title
	document.querySelector('.editHeaderName').value = current ? current.name : "";
	// TODO: Set the correct color!!!

	// Create the body
	var body = document.createElement("DIV");
	body.setAttribute('class', 'editBody');
	renderPadContents(body, current); // Do the real work.
	screen.appendChild(body);

	// Show the footer
	document.querySelector('.editFooter').classList.remove('hidden');
};

var renderPadContents = function(node, arg) {
	// If arg is null, the pad is new
	if(arg && arg.contents.length > 0) {
		var contents = arg.contents;
		for(var i = 0; i < contents.length; i++) {
			var entry = document.createElement("DIV");
			entry.setAttribute('class', 'padEntry');

			var entryHeader = document.createElement('DIV');
			entryHeader.setAttribute('class', 'padEntryHeader');
			entryHeader.classList.add('noselect');
			entryHeader.innerHTML = '<div class="padEntryHeaderLeft"><img src="icons/google_chrome.png" class="padEntryLogo" /><div class="padEntryTitle">Chrome</div><div class="padEntryIcon padEntryTitleChevron noselect" title="choose a different program for these files"></div></div><div class="padEntryIcon padEntryRight noselect" title="remove this program and all its files"></div>';
			// Give it the correct name and logo
			var program = getProgramInfo(contents[i].program,config);
			entryHeader.querySelector('.padEntryTitle').innerHTML = program.display_name;
			entryHeader.querySelector('.padEntryLogo').src = program.icon_path;
			entry.appendChild(entryHeader);

			var entryBody = document.createElement('DIV');
			entryBody.setAttribute('class', 'padEntryBody');
			for(var j = 0; j < contents[i].files.length; j++) {
				var file = document.createElement('DIV');
				file.setAttribute('class', 'padEntryFile');
				file.innerHTML = '<div class="padEntryFileName">' + contents[i].files[j] + '</div><div class="padEntryFileButtons"><div class="padEntryFileIcon padEntryFileChevron noselect" title="choose a different program for this file"></div><div class="padEntryFileIcon noselect" title="remove this file"></div></div>';
				entryBody.appendChild(file);
			}
			entry.appendChild(entryBody);

			node.appendChild(entry);
		}
	} else {
		var welcome = document.createElement('DIV');
		welcome.setAttribute('class', 'editPageWelcome');
		welcome.innerHTML = '<h1 id="editPageWelcomeHeader">Let\'s add some stuff!</h1><div>Use the three buttons below to add websites, files, and standalone programs to this pad.<br/><br/>Be sure to choose a name and color for your pad. Then, when you are done editing your pad, simply click \'Done\'!</div>';
		node.appendChild(welcome);
	}
};

var showOverlay = function(content) {
	var overlay = document.createElement('DIV');
	overlay.setAttribute('class', 'overlay');
	overlay.appendChild(content);

	var clickeater = document.createElement('DIV');
	clickeater.setAttribute('title', 'click to close the pop-up');
	clickeater.setAttribute('class', 'clickeater');
	// remove when clicked
	clickeater.addEventListener('click', closeOverlay);

	document.body.appendChild(clickeater);
	document.body.appendChild(overlay);

	//begin animation
	overlay.classList.add('overlayforward');
};

var closeOverlay = function () {
	var overlay = document.querySelector('.overlay');

	if(overlay) {
		document.querySelector('.overlay').classList.remove('overlayforward');
		document.querySelector('.overlay').offsetWidth = document.querySelector('.overlay').offsetWidth; // trigger HTML reflow
		document.querySelector('.overlay').classList.add('overlayreverse');
		setTimeout(function() {
			var toremove = document.querySelector('.overlay');
			toremove.parentNode.removeChild(toremove);
			var toremove = document.querySelector('.clickeater');
			toremove.parentNode.removeChild(toremove);
		}, 300);
	}
};

var showPassive = function(message) {
	var passive = document.querySelector('.passive');
	passive.innerHTML = message;

	if(!passive.classList.contains('passiveShow')) {
		passive.classList.remove('passiveHide');
		passive.classList.add('passiveShow');

		setTimeout(function() {
			var passive = document.querySelector('.passive');
			passive.classList.remove('passiveShow');
			passive.classList.add('passiveHide');
		}, 2500)
	}
};
