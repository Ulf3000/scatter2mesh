//// written by Alexander Mehler ////
////MPL 2.0 license///
// basic setup ///////////////////////////
var	{Cc,Ci}	 			= require('chrome'),
	ss 				= require("sdk/simple-storage"),
	panel			= require("sdk/panel"),
	{ToggleButton} 	= require("sdk/ui/button/toggle"),
	pm				= require("sdk/page-mod"),
	file 			= require('sdk/io/file');
var cm = require("sdk/context-menu");
var dirService		= Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties),
	sss				= Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
	ios				= Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);

var loadedStyles 		= [];  // management array for the list of styles ToDo: change this to weakmap 
var tabs = require("sdk/tabs");

styles = [   // example styles
	{
		namE: 	"Nicer Youtube", 
		stylE: 	'@namespace url(http://www.w3.org/1999/xhtml);\n'+
				'@-moz-document domain("youtube.com"){\n'+
				'	body {background: brown !important}\n'+
				'	img, .yt-card {border-radius: 5px !important}\n'+
				'}', 
		enabled: true,
		author : "Ulf3000",
	},
	{
		namE: 	"Disable UI Animations", 
		stylE: 	'@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\n'+
				'@-moz-document url("chrome://browser/content/browser.xul"){\n'+
				'* {'+
				'	-moz-transition-property: none !important;\n'+
				'	-moz-animation: none !important;\n'+
				'}\n'+
				'}',
		enabled: true,
		author : "Ulf3000",
	}
];

////selfmade storage////
// setup storage , i encountered multiple occasions of firefox erasing simple storage so im using an additional save method which saves directly and not on browser shutdown///////////

stylesFolder = dirService.get('ProfD', Ci.nsIFile);
stylesFolder.append("stylRRR");
//console.log(stylesFolder + stylesFolder);
if (!stylesFolder.exists()){
	file.mkpath(stylesFolder.path);
};	
var dirStart = getPathForStorage();
if (dirStart && dirStart.exists()) {
	json = file.read(dirStart.path);
	styles = JSON.parse(json);
}else{	
	writeStorageForAddon();
	writeAllStyleSheets();
};
function writeAllStyleSheets(){
	for (let style of styles){
		styleWriter = dirService.get('ProfD', Ci.nsIFile);
		styleWriter.append("stylRRR");
		styleWriter.append(style.namE.replace(/[\|&;\$#%@"<>\(\)\+,\\\*?\/!\´\`:=\{\}\[\]]/g, " ").trim() + ".css");
		var stream = file.open(styleWriter.path, "w");
		try {
			stream.write(style.stylE);
		} catch (err) {
			stream.close();
		}
		stream.close();
	};
	return;
};

function writeStyleSheet(style){
		styleWriter = dirService.get('ProfD', Ci.nsIFile);
		styleWriter.append("stylRRR");
		styleWriter.append(style.namE.replace(/[\|&;\$#%@"<>\(\)\+,\\\*?\/!\´\`:=\{\}\[\]]/g, " ").trim() + ".css");
		var stream = file.open(styleWriter.path, "w");
		try {
			stream.write(style.stylE);
		} catch (err) {
			stream.close();
		}
		stream.close();
		return;
};
function deleteStyleSheet(name){
		styleWriter = dirService.get('ProfD', Ci.nsIFile);
		styleWriter.append("stylRRR");
		styleWriter.append(name.replace(/[\|&;\$#%@"<>\(\)\+,\\\*?\/!\´\`:=\{\}\[\]]/g, " ").trim() + ".css");
		file.remove(styleWriter.path);
		return;
};
function readStyleSheet(name){
		styleWriter = dirService.get('ProfD', Ci.nsIFile);
		styleWriter.append("stylRRR");
		styleWriter.append(name.replace(/[\|&;\$#%@"<>\(\)\+,\\\*?\/!\´\`:=\{\}\[\]]/g, " ").trim() + ".css");
		texT = file.read(styleWriter.path);
		return texT;
};


function getPathForStorage() {
	var dir = dirService.get('ProfD', Ci.nsIFile);
	dir.append('stylRRR');
	dir.append('stylRRR_DB.json'); // a simple json in the profile folder
	return dir;
};

function writeStorageForAddon() {
	var stream = file.open(getPathForStorage().path, "w");
	try {
		stream.write(JSON.stringify(styles));
	} catch (err) {
		stream.close();
	}
	stream.close();
};
// var styleDir = dirService.get('ProfD', Ci.nsIFile);
		// styleDir.append('stylRRR');
		// styleDir.append(style.namE + ".css");
		//styleText = file.read(styleDir.path);
////// run on startup once; load all styles//////////////////////////////////////////////////////////////////////
function registerAllStyleSheets(){
	for (let style of styles){
		if (style.enabled == true){
			var uri = ios.newURI('data:text/css;charset=utf-8,' + encodeURIComponent(style.stylE), null, null);
			sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
			loadedStyles.push(uri);
		}else{ //if disabled just preparing the entrys
			var uri = ios.newURI('data:text/css;charset=utf-8,' + encodeURIComponent(style.stylE), null, null);
			loadedStyles.push(uri);
		};
	};
};

registerAllStyleSheets();	// run once

websiteRegExp = new RegExp(".*\/\/userstyles.org\/styles\/.*\/.*");
cm.Item({
			label:				"Add StyleSheet to StylRRR!",
			//image:			"./icon-16.jpg",
			context:			[cm.URLContext(websiteRegExp),cm.SelectorContext("code")],
			contentScriptFile:	"./getUserStyle.js",
			onMessage: 			function (style) {
									let yes;
									for (i = 0; i < styles.length; i++) {
										if (styles[i].id == style.id){    // id from userstyles.org 
											yes = true;
											if(styles[i].enabled == true)
												sss.unregisterSheet(loadedStyles[i], sss.USER_SHEET);
											break;
										}else{
											yes = false;
										};
									};
									var uri = ios.newURI('data:text/css;charset=utf-8,' + encodeURIComponent(style.stylE), null, null);
									sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
									let x;
									if ( yes == false  ){
										loadedStyles.push(uri);
										styles.push(style);
										x = styles.length -1;
									}else{
										loadedStyles[i] = uri;
										styles[i] = style;
										x = i;
									};
									stylepanel.port.emit("styles", [styles,x]);
									writeStorageForAddon();
									writeStyleSheet(style);
								}
});
var optionsButton = ToggleButton ({
	id:			"StyleSheetPanel",
	label:		"StyleSheet Panel",
	icon: 		"./icon-16.gif",
	onChange:	handleClick
});

//// panel/////   todo: panel or tab ?
var stylepanel = panel.Panel({
	width:				783,
	height:				800,
	//contextMenu: 		true,
	contentURL:			"./styler2.html",
	contentScriptFile:	"./styler.js",
});
// var stylepanel;
function handleClick(state) {
	if (state.checked) {
		stylepanel.show({
			position: optionsButton
		});
	};
};
// stylepanel.on("show", function() {
	// SPO = true;
// });
stylepanel.on("hide", function() {
	optionsButton.state('window', {checked: false});
});
stylepanel.port.emit("styles", [styles, 0]); // emit once
//// change/resave existing style ////
stylepanel.port.on("openSite", function (url) {
	tabs.open(url);
});

stylepanel.port.on("save1", function ([index, style]) {
	if (styles[index].enabled == true){ // first remove the old style 
		sss.unregisterSheet(loadedStyles[index], sss.USER_SHEET);
	};
	styles[index] = style;
	var uri = ios.newURI('data:text/css;charset=utf-8,' + encodeURIComponent(style.stylE), null, null);
	if (styles[index].enabled == true){	//then add replaced style 
		sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
	};
	loadedStyles[index] = uri;
	writeStorageForAddon();
	writeStyleSheet(style);
});

//// save new style ////
stylepanel.port.on("save2", function (style) {
	var uri = ios.newURI('data:text/css;charset=utf-8,' + encodeURIComponent(style.stylE), null, null);
	sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
	loadedStyles.push(uri);
	styles.push(style);
	writeStorageForAddon();
	writeStyleSheet(style);
});

//// delete style ////
stylepanel.port.on("delete", function([index,name,isXul]){
	if (styles[index].enabled == true){
		sss.unregisterSheet(loadedStyles[index], sss.USER_SHEET);
		loadedStyles.splice(index,1);
	}else {
		loadedStyles.splice(index,1);
	};
	styles.splice(index,1);
	writeStorageForAddon();
	deleteStyleSheet(name);
});

//// disable style; enable style ////
stylepanel.port.on("disable", function(index){
	sss.unregisterSheet(loadedStyles[index], sss.USER_SHEET);
	styles[index].enabled = false;
	writeStorageForAddon();
});
stylepanel.port.on("enable", function(index){
	sss.loadAndRegisterSheet(loadedStyles[index], sss.USER_SHEET);
	styles[index].enabled = true;
	writeStorageForAddon();
});
stylepanel.port.on("openFolder", function(){
	stylesFolder.launch();
});
stylepanel.port.on("reload", function(index){
	if (styles[index].enabled == true){ // first remove the old style 
		//console.log("remove");
		sss.unregisterSheet(loadedStyles[index], sss.USER_SHEET);
	};
	texT = readStyleSheet(styles[index].namE);
	styles[index].stylE = texT ;
	let uri = ios.newURI('data:text/css;charset=utf-8,' + encodeURIComponent(texT), null, null);
	if (styles[index].enabled == true){	//then add replaced style 
		sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
	};
	loadedStyles[index] = uri;
	writeStorageForAddon();
	stylepanel.port.emit("styles", [styles,index]);
});

////stuff lol ////
exports.onUnload = function(){
	//writeStorageForAddon();
	let idx = 0;
	for (let style of styles){
		if (style.enabled == true){		
				sss.unregisterSheet(loadedStyles[idx], sss.USER_SHEET);
		};
		idx = idx + 1 ;
	};
};

