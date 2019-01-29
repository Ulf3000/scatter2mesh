var namebox1 = document.getElementById("name-box1");
var domainbox1 = document.getElementById("domain-box1");
var editbox1 = document.getElementById("edit-box1");
var saveBtn1 = document.getElementById("saveBtn1");
var delBtn1 = document.getElementById("delBtn1");
var enabled = document.getElementById("enabled");
var urlbox1 = document.getElementById("url1");
var namebox2 = document.getElementById("name-box2");
var domainbox2 = document.getElementById("domain-box2");
var editbox2 = document.getElementById("edit-box2");
var urlbox2 = document.getElementById("url2");
var saveBtn2 = document.getElementById("saveBtn2");

var error2 = document.getElementById("error2");
var openFolder = document.getElementById("openFolder");

openFolder.onclick = function(){
	self.port.emit("openFolder");
};
var reload = document.getElementById("reload");

reload.onclick = function(){
	if (namebox1.selectedIndex != -1)
	self.port.emit("reload", namebox1.selectedIndex);
	namebox1.selectedIndex = -1;
};

var li1 = document.getElementById("tabitem1");
var li2 = document.getElementById("tabitem2");

li1.onclick = function(){
	li1.style.color = "#000000";
	li2.style.color = "#c8c8c8";
};
li2.onclick = function(){
	li2.style.color = "#000000";
	li1.style.color = "#c8c8c8";
};
urlbox1.onclick = function(){
	self.port.emit("openSite", urlbox1.textContent);
};
var styleS = [];
//rebuild panel entrys
self.port.on("styles", function([styles,index]) {
	while(namebox1.options.length > 0){                
		namebox1.remove(0);
	};
	styleS = styles;
	for (let style of styleS){
		namebox1.appendChild(new Option(style.namE));
	};
	namebox1.selectedIndex = index;
	let ooo = namebox1.selectedIndex;
	domainbox1.value = styleS[ooo].author;
	urlbox1.textContent = styleS[ooo].url;
	editbox1.value = styleS[ooo].stylE;
	enabled.checked = styleS[ooo].enabled;
});

namebox1.onchange = function(){
	let ooo = namebox1.selectedIndex;
	domainbox1.value = styleS[ooo].author;
	urlbox1.textContent = styleS[ooo].url;
	editbox1.value = styleS[ooo].stylE;
	console.log(styleS[ooo].enabled);
	enabled.checked = styleS[ooo].enabled;
	console.log(styleS[ooo].enabled);
};
// resave changed file
saveBtn1.onclick = function(){
	let xxx = 	{
					namE: namebox1.value,
					id:		styleS[namebox1.selectedIndex].id,
					author: domainbox1.value,
					url:	styleS[namebox1.selectedIndex].url,
					stylE: editbox1.value,
					enabled: enabled.checked
				};
	self.port.emit("save1", [namebox1.selectedIndex,xxx]);
	styleS[namebox1.selectedIndex].stylE = editbox1.value;
};

delBtn1.onclick = function(){
	if (namebox1.selectedIndex !== -1){
		domainbox1.value = "";
		editbox1.value = "";
		urlbox1.textContent = "";
		enabled.checked = false;
		self.port.emit("delete", [namebox1.selectedIndex,namebox1.value]);
		styleS.splice(namebox1.selectedIndex,1);
		namebox1.remove(namebox1.selectedIndex);
		namebox1.selectedIndex = "-1";
	};
};
enabled.onclick = function(){
	if (enabled.checked == false){
		if (namebox1.selectedIndex !== -1){
			styleS[namebox1.selectedIndex].enabled = false;
			self.port.emit("disable", namebox1.selectedIndex);
		};
	}else{
		if (namebox1.selectedIndex !== -1){
			styleS[namebox1.selectedIndex].enabled = true;
			self.port.emit("enable", namebox1.selectedIndex);
		};
	};
};
//save new style
saveBtn2.onclick = function(){
	for (let style of styleS){
		if (namebox2.value == style.namE){
			alert("Name already exists");
			return;
		};
	};
	let xxx = 	{
					namE: namebox2.value,
					id:		"",
					author: domainbox1.value,
					url:	urlbox2.value,
					stylE: 	editbox2.value,
					enabled: true
				};
	self.port.emit("save2", xxx);
	namebox1.appendChild(new Option(xxx.namE));
	styleS.push(xxx);
	namebox1.selectedIndex = "-1";
};

clearBtn.onclick = function(){
	namebox2.value = "";
	domainbox2.value = "";
	editbox2.value = "";
	urlbox2.textContent = "";
};