const {shell} = require('electron');

const remote = require('electron').remote;
const {dialog} = require('electron').remote;
const app = remote.app;

const spawn = require('child_process').spawn;
const path = require('path');

let fs = require('fs');
let folderName = '4tools_downloads';

let fourTools;
let rank;

// // let form = document.getElementById("form");
// let res = document.getElementById("result");

// let filePath = `${app.getPath('home')}/${folderName}`;

// Make this shit recurse later when I'm not busy!
// fs.readdir(filePath, (err, files) => {
// 	for (let i = 0; i < files.length; i++) {
//         fs.lstat(`${filePath}/${files[i]}`, (e, f) => {
// 			if (f.isDirectory()) {
// 				console.log(f);
// 			}
// 		});
// 	}
// });

/**
 * Scroll down to the bottom of the console view
 */
function scrollToBotton() {
	res.scrollTop = res.scrollHeight;
}

/**
 * Run rank, not useful, only there for testing
 */
function generateRandomKey() {
	rank = spawn('bin/rank');

	rank.stdout.on('data', (data) => {
		res.innerText += data;
		scrollToBotton();
	});
}

/**
 * Clears the console pane
 */
function clearConsole() {
	res.innerHTML = '';
}

/**
 * Retrieve the thread url and sub folder name provided by the user
 * @param url
 * @param subfolder
 * @returns {boolean}
 */
function getUserInfo(url, subfolder) {
	var btn = document.getElementById("dlButton");

	if (url === "") {
		return false;
	}

	if (subfolder === "") {
		fourTools = spawn('bin/4tools', ['-u', url]);
	} else {
		fourTools = spawn('bin/4tools', ['-u', url, '-f', subfolder]);
	}

	addSpinner();
	btn.disabled = true;
	btn.innerText = "Downloading...";

	fourTools.stdout.on('data', (data) => {
		// let b = document.getElementById('main');
		// // res.innerText += data;
		// scrollToBotton();
	});

	fourTools.stderr.on('data', (data) => {
		console.log(`error occured: ${data}`)
	});

	fourTools.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
		removeSpinner();
		btn.disabled = false;
		btn.innerText = 'Download';
        addSuccess();
	});
}

/**
 * Open the download folder
 */
function openDownloadFolder() {
	shell.showItemInFolder(`${app.getPath('home')}/${folderName}`);
}

/**
 * Adds a success button once the download is complete
 */
function addSuccess() {
    let form = document.getElementById("form");

	let el = document.createElement('div');
	el.classList = "button success";
	el.id = "success";
	el.innerText = "Done!";

	form.appendChild(el);
}

/**
 * Adds the spinner while download is underway
 */
function addSpinner() {
	let wrapper = document.getElementById("spinnerWrapper");

	var s = document.createElement('div');
	s.classList += "loader";
	s.id = "spinner";

    wrapper.style.display = "block";
	wrapper.appendChild(s)
}

/**
 * Remove the spinner once download is complete
 */
function removeSpinner() {
	let wrapper = document.getElementById("spinnerWrapper");
	let s = document.getElementById("spinner");

	wrapper.removeChild(s);
	wrapper.style.display = "none";
}

/**
 * Open the file picker view on the default download path
 */
function pickFile() {
	var sub = document.getElementById("subFolderName");

	dialog.showOpenDialog({"properties": ['openFile', 'openDirectory', 'createDirectory'], "defaultPath": `${app.getPath('home')}/${folderName}`}, function(file) {
        if (file == undefined) {
			return false;
		}

		var f = file[0];
		var f = f.split("/");
		var lastMember = f.length-1;

        sub.value = f[lastMember];
	});
}
