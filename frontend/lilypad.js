// Globals
var req_url = "http://localhost:2014/";
var config = {};
var pads = {};
var editing = null;

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

		// Set editing properly
		editing = pad;

		// Remove this pad from pads
		removePad(pad);

		// Start editing
		switchMainScreen('createEditPage', pad);
	});

	// Allow a pad to be launched
	var launchRateLimited = false;
	$("#launchPage").delegate('.padboxplaybutton', 'click', function(e) {
		var target = e.target.parentNode;
		var pad = target.pad;

		if(!launchRateLimited) {
			launchRateLimited = true;
			launch(generateShellScript(pad), function(result) {
				if(result.success) {
					showPassive('Launched ' + pad.name + '!');
				} else {
					showPassive('Something went wrong. :(');
				}

				setTimeout(function() {
					launchRateLimited = false;
				}, 5000);
			});
		}
	});

	// Handle the footer buttons
	$(".lilyfooter").delegate('.lilyfooterbutton', 'click', function(e) {
		var id = e.target.getAttribute('id');
		var handled = false;

		if(id == 'savePadButton') {
			handled = true;

			// Construct the new pad
			editing.name = document.querySelector('.editHeaderName').value;
			editing.color = document.querySelector('.activeColorBlob').style.backgroundColor;

			// Do we have a name?
			var hasName = editing.name !== "";

			// Is it unique?
			var unique = true;
			for(var i = 0; i < pads.length; i++) {
				if(editing.name === pads[i].name) {
					unique = false;
				}
			}

			// If no name AND no contents, just switch to launch
			if(!hasName && editing.contents.length === 0) {
				switchMainScreen('launchPage');
				return;
			}

			// Otherwise, put up a fight
			if(!hasName) {
				showPassive("Give your pad a name first!");
				return;
			}

			if(!unique) {
				showPassive("Please choose a different name.");
				return;
			}

			// Save the pad
			pads.push(editing);
			editing = null;

			// TODO: Set JSON

			// We're saved! Return home.
			switchMainScreen('launchPage');
		}

		if(id == 'newPadButton') {
			handled = true;
			switchMainScreen('createEditPage', null);
			editing = {name: "", color: "red", contents: []};
		}

		if(id == 'deletePadButton') {
			handled = true;

			showPassive("Deleted pad '" + (editing.name ? editing.name : 'untitled') + "'");

			// TODO: CONFIRMATION DIALOG!
			// TODO: SetJSON
			switchMainScreen('launchPage');
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

	// Handle the URL bar
	document.querySelector("#editURL").addEventListener('keydown', function(e) {
		if(e.keyCode === 13) { // enter
			handleURLBar();
		}
	});
	document.querySelector("#editURLGo").addEventListener('click', handleURLBar);

	// Handle the files button
	document.querySelector("#editFiles").addEventListener('click', function() {
		pick(function(files) {
			files = files.paths;
			if(files.length > 0) {
				// Match to defaults
				var delta = getDefaultPrograms(files, config);

				// Insert into pad
				insertIntoPad(editing, delta);

				// Render
				showPassive('Added ' + files.length + " file" + ((files.length > 1) ? "s" : "") + " to pad!");
				redrawEditingPad();
			}
		});
	});

	// Handle the standalone program button
	document.querySelector('#editStandalone').addEventListener('click', handleStandalone);

	// handle deleting an entire program
	$('#createEditPage').delegate('.padEntryDelete', 'click', function(e) {
		var name = e.target.parentNode.querySelector('.padEntryTitle').innerHTML;
		removeProgram(editing,name);
		redrawEditingPad();
		showPassive('Removed ' + name + ' from pad.');
	});

	// handle deleting some files
	$('#createEditPage').delegate('.padFileEntryDelete', 'click', function(e) {
		var name = e.target.parentNode.parentNode.parentNode.parentNode.querySelector('.padEntryTitle').innerHTML;
		var file = e.target.parentNode.parentNode.querySelector('.padEntryFileName').innerHTML;

		// Do the remove
		removeFileFromProgram(editing, file, name);

		// Remove the program if there are no files left
		var files = e.target.parentNode.parentNode.parentNode.querySelectorAll('.padEntryFile');

		redrawEditingPad();
		showPassive('File removed from ' + name + '.');
	});

	// handle a single file chevron
	$('#createEditPage').delegate('.padEntryFileChevron', 'click', function(e) {
		var name = e.target.parentNode.parentNode.parentNode.parentNode.querySelector('.padEntryTitle').innerHTML;
		var file = e.target.parentNode.parentNode.querySelector('.padEntryFileName').innerHTML;

		var callback = function(alt) {
			// Do the switch
			switchFileToAlternative(editing, file, name, alt);

			// Draw the result
			redrawEditingPad();
			closeOverlay();
			showPassive('Switched programs!');
		};

		var alts = getAlternativePrograms(getFileType(file), config);
		var programs = [];
		for(var i =0; i < alts.length; i++) {
			if(alts[i] !== name) {
				programs.push(getProgramInfo(alts[i], config));
			}
		}

		// render the page
		var node = renderOverlay("Choose a different program for this file...", programs, callback);
		showOverlay(node);
	});

	// handle a program chevron
	$('#createEditPage').delegate('.padEntryTitleChevron', 'click', function(e) {
		var name = e.target.parentNode.querySelector('.padEntryTitle').innerHTML;
		var files = null;
		for(var i = 0; i < editing.contents.length; i++) {
			if(editing.contents[i].program === name) {
				files = editing.contents[i].files;
			}
		}

		var callback = function(alt) {
			var clone = JSON.parse(JSON.stringify({files: files})).files;

			for(var i = 0; i < clone.length; i++) {
				switchFileToAlternative(editing, clone[i], name, alt);
			}

			// Draw the result
			redrawEditingPad();
			closeOverlay();
			showPassive('Switched programs!');
		};

		var alts = getAlternativeProgramsList(files, config);
		console.log(alts);
		var programs = [];
		for(var i =0; i < alts.length; i++) {
			if(alts[i] !== name) {
				programs.push(getProgramInfo(alts[i], config));
			}
		}

		// render the page
		var node = renderOverlay("Change the program for these files...", programs, callback);
		showOverlay(node);
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

var redrawEditingPad = function() {
	renderPadContents(document.querySelector('.editBody'), editing);
}

var handleURLBar = function() {
	var bar = document.querySelector('#editURL');

	if(bar.value === "") {
		showPassive('enter a URL first...');
		return;
	}

	var urls = bar.value.split(';');
	var valid = [];
	var guessed = false;
	for(var i = 0; i < urls.length; i++) {
		if(isValidURL(urls[i])) {
			valid.push(urls[i]);
		} else {
			if(isValidURL("http://" + urls[i])) {
				guessed = true;
				valid.push("http://" + urls[i]);
			}
		}
	}

	if(valid.length == 0) {
		showPassive("That URL doesn't work. :(");
	} else {
		var delta = getDefaultPrograms(valid, config);
		insertIntoPad(editing, delta);
		showPassive('Website added to pad!');
		bar.value = "";
		redrawEditingPad();
	}
};

var handleStandalone = function() {
	// handle the results
	var callback = function(name) {
		var dups = insertIntoPad(editing, [{program: name, files: []}]);
		closeOverlay();
		if(dups.length == 0) {
			showPassive('Added ' + name + ' to pad!');
			redrawEditingPad();
		} else {
			showPassive('You already added ' + name + '!');
		}
	};

	// Draw the overlay
	var programs = getStandalonePrograms(config);
	var node = renderOverlay("Add a Standalone Program", programs, callback);

	// Show the overlay
	showOverlay(node);
}

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

var setJSON = function(data, callback) {
	var file = "pads.json";
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

var renderOverlay = function(title, programs, callback) {
	var standalone = document.createElement("DIV");
	standalone.classList.add('noselect');
	standalone.innerHTML = "<div class='overlayHeader'>" + title + "</div><div class='overlayProgramList'></div>"; 
	var body = standalone.querySelector('.overlayProgramList');
	for(var i = 0; i < programs.length; i++) {
		var child = document.createElement('IMG');
		child.src = programs[i].icon_path;
		child.setAttribute('title', programs[i].display_name);
		child.addEventListener('click', function(e) {
			callback(e.target.getAttribute('title'));
		});
		body.appendChild(child);
	}
	return standalone;
}

var renderLaunchPage = function() {
	var screen = document.querySelector("#launchPage");

	// Set the header subtitle
	document.querySelector("#subheader").innerHTML = "Home";

	// clear whatever is there now
	screen.innerHTML = "";

	// TODO: Sort the pads in some way

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
	// Select the correct color
	if(current) {
		bodyheader.querySelector('.activeColorBlob').classList.remove('activeColorBlob');
		var blobs = bodyheader.querySelectorAll('.colorBlob');
		for(var i = 0; i < blobs.length; i++) {
			if(blobs[i].style.backgroundColor === current.color) {
				blobs[i].classList.add('activeColorBlob');
			}
		}
	}

	// Create the body
	var body = document.createElement("DIV");
	body.setAttribute('class', 'editBody');
	renderPadContents(body, current); // Do the real work.
	screen.appendChild(body);

	// Show the footer
	document.querySelector('.editFooter').classList.remove('hidden');
};

var renderPadContents = function(node, arg) {
	node.innerHTML = "";

	// If arg is null, the pad is new
	if(arg && arg.contents.length > 0) {
		var contents = arg.contents;
		for(var i = 0; i < contents.length; i++) {
			var entry = document.createElement("DIV");
			entry.setAttribute('class', 'padEntry');

			var entryHeader = document.createElement('DIV');
			entryHeader.setAttribute('class', 'padEntryHeader');
			entryHeader.classList.add('noselect');
			entryHeader.innerHTML = '<div class="padEntryHeaderLeft"><img src="icons/google_chrome.png" class="padEntryLogo" /><div class="padEntryTitle">Chrome</div><div class="padEntryIcon padEntryTitleChevron noselect" title="choose a different program for these files"></div></div><div class="padEntryIcon padEntryDelete noselect" title="remove this program and all its files"></div>';
			// Give it the correct name and logo
			var program = getProgramInfo(contents[i].program,config);
			entryHeader.querySelector('.padEntryTitle').innerHTML = program.display_name;
			entryHeader.querySelector('.padEntryLogo').src = program.icon_path;
			entry.appendChild(entryHeader);
			// Hide the title chevron if there are no alternative programs
			// Or, if the program is standalone.
			var alternatives = getAlternativeProgramsList(contents[i].files, config);
			if(program.standalone || alternatives.length <= 1) {
				entryHeader.querySelector('.padEntryTitleChevron').classList.add('hidden');
			}

			var entryBody = document.createElement('DIV');
			entryBody.setAttribute('class', 'padEntryBody');
			for(var j = 0; j < contents[i].files.length; j++) {
				var file = document.createElement('DIV');
				file.setAttribute('class', 'padEntryFile');
				file.innerHTML = '<div class="padEntryFileName">' + contents[i].files[j] + '</div><div class="padEntryFileButtons"><div class="padEntryFileIcon padEntryFileChevron noselect" title="choose a different program for this file"></div><div class="padEntryFileIcon padFileEntryDelete noselect" title="remove this file"></div></div>';
				entryBody.appendChild(file);

				// Hide the chevron if needed
				var alternative = getAlternativePrograms(getFileType(contents[i].files[j]),config);
				if(alternative.length <= 1) {
					file.querySelector('.padEntryFileChevron').classList.add('hidden');
				}
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

var passiveTimeout = null;
var showPassive = function(message) {
	var passive = document.querySelector('.passive');
	passive.innerHTML = message;

	var timeoutFun = function() {
		var passive = document.querySelector('.passive');
		passive.classList.remove('passiveShow');
		passive.classList.add('passiveHide');
	};

	if(!passive.classList.contains('passiveShow')) {
		passive.classList.remove('passiveHide');
		passive.classList.add('passiveShow');

		passiveTimeout = setTimeout(timeoutFun, 2500);
	} else {
		clearTimeout(passiveTimeout);
		passiveTimeout = setTimeout(timeoutFun, 2500);
	}
};
