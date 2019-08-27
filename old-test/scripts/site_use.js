var mavenUrls = {
	"installer": "https://maven.fabricmc.net/net/fabricmc/fabric-installer/maven-metadata.xml",
	"yarn": "https://maven.fabricmc.net/net/fabricmc/yarn/maven-metadata.xml",
	"loader": "https://maven.fabricmc.net/net/fabricmc/fabric-loader/maven-metadata.xml"
};
var mavenUrlData = {};

var loaderPath = "https://maven.fabricmc.net/net/fabricmc/fabric-loader/";
var installerPath = "https://maven.fabricmc.net/net/fabricmc/fabric-installer/";
var mavenUrlIds = ["yarn", "loader", "installer"];
var parser = new DOMParser();

function copyToClipboard(text) {
	var tad = document.createElement("textarea");
	tad.value = text;
	document.body.appendChild(tad);
	tad.select();
	document.execCommand("copy");
	document.body.removeChild(tad);
}

function isExpertMode() {
	return document.getElementById("checkbox-show-expert").checked;
}
function isSnapshotMode() {
	return document.getElementById("checkbox-show-snapshot").checked;
}

function setVisible(el, cond) {
	if (cond) el.classList.remove("hidden");
	else el.classList.add("hidden");
}

function refreshExpert() {
	var c = document.getElementsByClassName("show-expert");
	var isEx = isExpertMode();
	for (var j = 0; j < c.length; j++) {
		setVisible(c[j], isEx);
	}
}

function refreshLaunchers(addHandlers) {
	var launcherBar = document.getElementById("button-bar-launcher");
	for (var i = 0; i < launcherBar.children.length; i++) {
		var launcherButton = launcherBar.children[i];
		var launcherId = launcherButton.id.replace("button-launcher-", "");
		if (launcherButton.classList.contains("button-active")) {
			var c = document.getElementsByClassName("show-launcher");
			for (var j = 0; j < c.length; j++) {
				setVisible(c[j], c[j].classList.contains("show-launcher-" + launcherId));
			}
		}
		if (addHandlers) {
			launcherButton.addEventListener("click", function(e) {
				if (!this.classList.contains("button-active")) {
					for (var i = 0; i < launcherBar.children.length; i++) {
						launcherBar.children[i].classList.remove("button-active");
					}
					this.classList.add("button-active");
					refreshLaunchers(false);
				}
				return true;
			});
		}
	}
}

refreshLaunchers(true);
refreshExpert();

window.addEventListener("load", function() {
	loadUrl(0);

	document.getElementById("checkbox-show-expert").addEventListener("click", function(e) {
		for (var i = 0; i < mavenUrlIds.length; i++) {
			refreshMavenData(mavenUrlIds[i]);
		}
		refreshExpert();
	});
	document.getElementById("checkbox-show-snapshot").addEventListener("click", function(e) {
		for (var i = 0; i < mavenUrlIds.length; i++) {
			refreshMavenData(mavenUrlIds[i]);
		}
	});
	document.getElementById("downloadMultiMC").addEventListener("click", function(e) {
		window.location.href = getDownloadUrl("multimc");
	});
	document.getElementById("downloadMultiMCJson").addEventListener("click", function(e) {
		window.location.href = getDownloadUrl("multimc") + "&format=patchJson";
	});
	document.getElementById("downloadTechnicJson").addEventListener("click", function(e) {
		window.location.href = getDownloadUrl("technic");
	});
	document.getElementById("copyMultiMC").addEventListener("click", function(e) {
		copyToClipboard(getDownloadUrl("multimc"));
	});
	document.getElementById("downloadLoader").addEventListener("click", function(e) {
		window.location.href = getDownloadUrl("loader");
	});
	document.getElementById("copyLoader").addEventListener("click", function(e) {
		copyToClipboard(getDownloadUrl("loader"));
	});
	document.getElementById("copyMCUpdater").addEventListener("click", function(e) {
		copyToClipboard(getDownloadUrl("mcupdater"));
	});
	document.getElementById("downloadInstaller").addEventListener("click", function(e) {
		window.location.href = getDownloadUrl("installer");
	});
	document.getElementById("downloadInstallerExe").addEventListener("click", function(e) {
		window.location.href = getDownloadUrl("installer_exe");
	});
});

function getDownloadUrl(downloaderType) {
	if (downloaderType == "loader") {
		var el = document.getElementById("loaderVersion");
		var elv = el.options[el.selectedIndex].value;
		return loaderPath + elv + "/fabric-loader-" + elv + ".jar";
	}

	if (downloaderType == "installer") {
		var el = document.getElementById("installerVersion");
		var elv = el.options[el.selectedIndex].value;
		return installerPath + elv + "/fabric-installer-" + elv + ".jar";
	}

	if (downloaderType == "installer_exe") {
		var el = document.getElementById("installerVersion");
		var elv = el.options[el.selectedIndex].value;
		return installerPath + elv + "/fabric-installer-" + elv + ".exe";
	}

	var url = "https://fabricmc.net/download/" + downloaderType;
	for (var i = 0; i < mavenUrlIds.length; i++) {
		if (mavenUrlIds[i] == "installer") {
			continue;
		}

		var el = document.getElementById(mavenUrlIds[i] + "Version");
		var vl = el.options[el.selectedIndex].value;

		if (i == 0) url += "?";
		else {
			if (downloaderType == "mcupdater") url += "&amp;";
			else url += "&";
		}
		url += mavenUrlIds[i] + "=" + vl.replace("+", "%2B");
	}

	if (downloaderType == "mcupdater") {
		return "<Import url=\"" + url + "\">fabric</Import>";
	}
	return url;
}

function refreshMavenData(objKey) {
	var obj = document.getElementById(objKey + "Version"); 

	// remove existing options
	for (var i = obj.options.length-1; i>=0; i--) obj.remove(i);

	// add new options
	var metaFile = mavenUrlData[objKey];
	var versions = metaFile.getElementsByTagName("version");
	var options = [];
	for (var i = 0; i < versions.length; i++) {
		var v = versions[i].textContent;
		var o = document.createElement("option");

		if (objKey == "yarn") {
			if (!isSnapshotMode()) {
				if (v.indexOf("Pre-Release") > 0 || v.indexOf("w") == 2) { continue; }
				if (v.indexOf("-pre") > 0) { continue; }
			}
		}
//		if (!isExpertMode() && v.indexOf("+") > 0) continue;
		o.value = v;
		if (objKey == "loader") {
			v = v.split("-");
			v = v[v.length - 1];
		}
		o.text = v;
		options.unshift(o);
	}
	for (var i = 0; i < options.length; i++) {
		obj.add(options[i]);
	}
}

function loadUrl(id) {
	var request = new XMLHttpRequest();
	var objKey = mavenUrlIds[id];
	var reqUrl = mavenUrls[objKey] + "?" + (new Date().getTime());
	request.open("GET", reqUrl);
	request.onreadystatechange = function(e) {
		if (request.readyState == 4 && request.status == 200) {
			var metaFile = parser.parseFromString(request.responseText, "text/xml");
			mavenUrlData[objKey] = metaFile;
			refreshMavenData(objKey);
			if ((id + 1) < mavenUrlIds.length) {
				loadUrl(id + 1);
			}
		}
	};
	request.send(null);
}
