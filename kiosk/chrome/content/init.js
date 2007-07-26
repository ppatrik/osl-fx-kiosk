var contentBrowser = null;
var Ci = Components.interfaces;
var width;
var height;

function init(){
	setTimeout(function(){
		fullScreen = true;
	}, 0);
	//set resize event
	window.addEventListener("focus", onFocus, false);
	window.addEventListener("resize", onResize, false);
	contentBrowser = document.getElementById("contentBrowser");
	//these might be needed when using a tabbrowser
	//contentBrowser.homePage = "http://www.osuosl.org";
	//contentBrowser.goHome();
}

function onFocus(){
	//if width and height aren't cached, cache them
	if(!(width > 1) || !(height > 1)){
		width = window.outerWidth;
		height = window.outerHeight;
	}
}

function onResize(){
	//put it back to normal size
	window.resizeTo(width, height);
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