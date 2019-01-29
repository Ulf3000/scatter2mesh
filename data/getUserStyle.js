self.on('click', function(node) {
	var xxx = 	{
					namE: 	document.getElementById("main-header").textContent.replace("userstyles.org -","").replace(/(\r\n|\n|\r|\t)/gm,"").trim(),
					id:		location.href.replace(/.*\/\/userstyles.org\/styles\//,"").replace(/\/.*/,""),
					author: document.getElementById("style-author-info").getElementsByTagName("a")[0].textContent,
					url:	location.href,
					datE:	document.getElementById("style-author-info").querySelectorAll("td")[3].textContent,
					stylE: 	node.textContent,
					enabled: true
				};
	self.postMessage(xxx);
});