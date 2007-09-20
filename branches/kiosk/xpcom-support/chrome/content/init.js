var contentBrowser = null;
var allowURLs = new Array();
allowURLs[0] = "about:blank";
var currentURL = "about:blank";

var httpRequestObserver =
{
	observe: function(subject, topic, data) 
	{
		if (topic == "http-on-modify-request"){
			//these should provide a way to stop it before the request is sent,
			//but the problem is if any content is brought in from elsewhere,
			//it denies access to the whole page
			//var httpChannel = subject.QueryInterface(Components.interfaces.nsIHttpChannel);
			//requestURI = httpChannel.getRequestHeader("host");
			//alert(httpChannel.getRequestHeader("host"));
			onLoading();
		}
	},
	
	get observerService() {
		return Components.classes["@mozilla.org/observer-service;1"]
			.getService(Components.interfaces.nsIObserverService);
	},
	
	register: function(){
		this.observerService.addObserver(this, "http-on-modify-request", false);
	},
	
	unregister: function(){
	this.observerService.removeObserver(this, "http-on-modify-request");
	}
};

//register our request listener
httpRequestObserver.register();

function init(){
	contentBrowser = document.getElementById("contentBrowser");
	setTimeout(init2, 0);

	//load list of allowed URLs
	loadAllowedURLs();

	// save URL for onLoading
	currentURL = contentBrowser.contentDocument.URL;
}

function init2(){
	fullScreen = true;
	//init locking component
	var cls = Components.classes["@osuosl.org/OSLock"];
	var oslockapi = cls.createInstance().QueryInterface(Components.interfaces.iOSLock);
	oslockapi.lock();
}


function destroy(){
	//remove locking
	var cls = Components.classes["@osuosl.org/OSLock"];
	var oslockapi = cls.createInstance().QueryInterface(Components.interfaces.iOSLock);
	oslockapi.unlock();
}

function loadAllowedURLs(){
	try{
	var i = 0;
	var file = Components.classes["@mozilla.org/file/directory_service;1"]
		.getService(Components.interfaces.nsIProperties)
		.get("resource:app", Components.interfaces.nsIFile);
	file.append("chrome");
	file.append("content");
	file.append("urlmatch.txt");

	var istream = Components.classes["@mozilla.org/network/file-input-stream;1"]
		.createInstance(Components.interfaces.nsIFileInputStream);
	istream.init(file, 0x01, 0444, 0);
	istream.QueryInterface(Components.interfaces.nsILineInputStream);
	
	// read lines into allowURLs
	var line = {}, hasmore;
	do {
		hasmore = istream.readLine(line);
		allowURLs.push(line.value); 
	} while(hasmore);
	
	istream.close();
	}
	catch(e){
	alert("exception in loadAllowedURLs: " + e);
	}
}

function onLoading(){
	loadingURL = contentBrowser.contentDocument.URL;
	if(loadingURL != currentURL){
		allowed = false;
		for (i in allowURLs){
			if(loadingURL.match(allowURLs[i]) != null){
				allowed = true;
				break;
			}
		}
		if(allowURLs.length == 1){
			allowed = true;
		}
		if(allowed == false){
			alert(loadingURL + " is not in the allowed host list");
			oldURL = currentURL;
			currentURL = loadingURL;
			contentBrowser.loadURI(oldURL);
		}
		else{
			currentURL = loadingURL;
		}
	}
}

/*function onResize(){
	alert('resized');
	//put it back to normal size
	if (width != 0 && height !=0) {
		window.resizeTo(width, height);
	}
}*/

function backClicked(){
	try{
	if(contentBrowser.canGoBack == true)
		contentBrowser.goBack();
	}
	catch(e){
	alert("exception in backClicked: " + e);
	}
}

function forwardClicked(){
	try{
	if(contentBrowser.canGoForward == true)
		contentBrowser.goForward();
	}
	catch(e){
	alert("exception in forwardClicked: " + e);
	}
}

function homeClicked(){
	try{
	contentBrowser.goHome();
	}
	catch(e){
	alert("exception in homeClicked: " + e);
	}
}

function exitClicked(){
	try{
	var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].
	getService(Components.interfaces.nsIAppStartup);
	appStartup.quit(Components.interfaces.nsIAppStartup.eAttemptQuit);
	window.close();
	}
	catch(e){
	alert("exception in exitClicked: " + e);
	}
}

function bookmarkClicked(event){
	try{
	var loc = event.target.getAttribute("location");
	if(loc != ""){
		contentBrowser.loadURI(loc);
	}
	else{
		alert("Location field is empty!");
	}
	}
	catch(e){
	alert("exception in bookmarkClicked: " + e);
	}
}
