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

let filePath = `${app.getPath('home')}/${folderName}`;

// Make this shit recurse later when I'm not busy!
fs.readdir(filePath, (err, files) => {
	for (let i = 0; i < files.length; i++) {
        fs.lstat(`${filePath}/${files[i]}`, (e, f) => {
			if (f.isDirectory()) {
				console.log(f);
			}
		});
	}
});

function scrollToBotton() {
	let res = document.getElementById('result');
	res.scrollTop = res.scrollHeight;
}

function generateRandomKey() {
	rank = spawn('bin/rank');
	let res = document.getElementById("result");

	rank.stdout.on('data', (data) => {
		res.innerText += data;
		scrollToBotton();
	});
}

function clearConsole() {
	let res = document.getElementById('result');
	res.innerHTML = '';
}

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
		let d = document.getElementById('result');
		let b = document.getElementById('main');

		let s = String(data);

		b.style.backgroundImage = `url(${s})`;

		d.innerText += data;
		scrollToBotton();
	});

	fourTools.stderr.on('data', (data) => {
		console.log(`error occured: ${data}`)
	});

	fourTools.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
		removeSpinner();
		btn.disabled = false;
		btn.innerText = 'Download';
	});
}

function showMe() {
	shell.showItemInFolder(`${app.getPath('home')}/${folderName}`);
}

function addSpinner() {
	var p = document.getElementById("leftPane");

	var s = document.createElement('div');
	s.classList += "loader";
	s.id = "spinner";

	p.appendChild(s)
}

function removeSpinner() {
	p = document.getElementById("leftPane");
	s = document.getElementById("spinner");

	p.removeChild(s)
}

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
