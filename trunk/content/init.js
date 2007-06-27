var contentBrowser = null;

function init(){
	contentBrowser = document.getElementById("contentBrowser");
	window.resizeTo(window.screen.availWidth, window.screen.availHeight);
}

function backClicked(){
	try{
	if(contentBrowser.webNavigation.canGoBack == true)
		contentBrowser.webNavigation.goBack();
	}
	catch(e){
	alert("exception in backClicked: " + e);
	}
}

function forwardClicked(){
	try{
	if(contentBrowser.webNavigation.canGoForward == true)
		contentBrowser.webNavigation.goForward();
	}
	catch(e){
	alert("exception in backClicked: " + e);
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