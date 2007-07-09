var contentBrowser = null;

function init(){
	contentBrowser = document.getElementById("contentBrowser");
	window.moveTo(-1,-1);
	window.resizeTo(window.screen.width, window.screen.height);
}

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

function bookmarkClicked(loc){
	try{
	contentBrowser.loadURI(loc);
	}
	catch(e){
	alert("exception in bookmarkClicked: " + e);
	}
}