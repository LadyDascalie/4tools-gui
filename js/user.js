const {shell} = require('electron')

const remote = require('electron').remote;
const app = remote.app;

const spawn = require('child_process').spawn
const path = require('path')

var fs = require('fs');
let fourTools;

function getUserInfo(url, subfolder) {
	btn = document.getElementById("dlButton")

	if (url === "") {
		return false;
	}

	if (subfolder === "") {
		fourTools = spawn('bin/4tools', ['-u', url])
	} else {
		fourTools = spawn('bin/4tools', ['-u', url, '-f', subfolder])
	}

	addSpinner()
	btn.disabled = true
	btn.innerText = "Downloading..."


	fourTools.stdout.on('data', (data) => {
		d = document.getElementById('result')
		d.innerText += data;
	});

	fourTools.stderr.on('data', (data) => {
		console.log(`error occured: ${data}`)
	});

	fourTools.on('close', (code) => {
		console.log(`child process exited with code ${code}`)
		removeSpinner()
		btn.disabled = false
		btn.innerText = 'Download'
	});
}

function showMe() {
	shell.showItemInFolder(`${app.getPath('home')}/4tools_downloads`)
}

function addSpinner() {
	p = document.getElementById("leftPane")

	s = document.createElement('div')
	s.classList += "loader"
	s.id = "spinner"

	p.appendChild(s)
}

function removeSpinner() {
	p = document.getElementById("leftPane")
	s = document.getElementById("spinner")

	p.removeChild(s)
}

function clearConsole() {
	d = document.getElementById("result")
	d.innerText = ""
}
