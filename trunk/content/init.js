var contentBrowser;
contentBrowser = document.getElementById("contentBrowser");

function init(){
	//will be true later
	window.fullScreen = true;
}

function backClicked(){
	try{
	alert(contentBrowser);
	alert(document.getElementById("contentBrowser").goBack);
	alert(document.getElementById("contentBrowser").webNavigation);
	if(contentBrowser.webNavigation.canGoBack == true)
		contentBrowser.webNavigation.goBack();
	}
	catch(e){
	alert("exception in backClicked: " + e);
	}
}

function forwardClicked(){
	try{
	if(document.getElementById("contentBrowser").canGoForward == true)
		document.getElementById("contentBrowser").goForward();
	}
	catch(e){
	alert("exception in backClicked: " + e);
	}
}

function homeClicked(){
	try{
	document.getElementById("contentBrowser").goHome();
	}
	catch(e){
	alert("exception in homeClicked: " + e);
	}
}