/*
 * WebRunner Kiosk Browser
 * Copyright (C) 2007 Oregon State University Open Source Lab
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

const nsIWebProgress = Components.interfaces.nsIWebProgress;
const nsIWebProgressListener = Components.interfaces.nsIWebProgressListener;

window.addEventListener("load", startup, false);
window.addEventListener("unload", shutdown, false);

var allowURLs = new Array();
allowURLs[0] = "about:blank";
var currentURL = "about:blank";

var httpRequestObserver =
{
	observe: function(subject, topic, data) 
	{
		if (topic == "http-on-modify-request"){
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

function onLoading(){
	try{
        var browser = getBrowser();
	loadingURL = browser.contentDocument.URL;
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
			browser.loadURI(oldURL);
		}
		else{
			currentURL = loadingURL;
		}
	}
	}
	catch(e){
	alert("exception in onLoading: " + e);
	}
}

var params;

if (window.arguments && window.arguments[0])
  params = new Params(window.arguments[0].QueryInterface(Components.interfaces.nsICommandLine));
else
  params = new Params(null);
  

function getBrowser() {
  return document.getElementById('main-browser');
}

function secure(){
	try{
	//init locking component
	var cls = Components.classes["@osuosl.org/OSLock"];
	var oslockapi = cls.createInstance().QueryInterface(Components.interfaces.iOSLock);
	oslockapi.lock();

	fullScreen = true;

	//set resize event
	window.addEventListener("resize", onResize, false);

	}
	catch(e){
	alert("exception in init2: " + e);
	}
}

function destroy(){
	//remove locking
	var cls = Components.classes["@osuosl.org/OSLock"];
	var oslockapi = cls.createInstance().QueryInterface(Components.interfaces.iOSLock);
	oslockapi.unlock();
}

function onResize(){
	try{
	//put it back to normal size
        moveTo(0, 0);
        resizeTo(window.screen.width, window.screen.height);
	}
	catch(e){
	alert("exception in onResize: " + e);
	}
}

function startup()
{
  setTimeout(secure, 0);
  // Process parameters
  document.documentElement.setAttribute("id", params.icon);

  document.getElementById("statusbar").hidden = !params.showstatus;

  if (!params.enablenavigation) {
    var keys = document.getElementsByTagName("key");
    for (var i = keys.length - 1; i >= 0; i--)
      if (keys[i].className == "nav")
        keys[i].parentNode.removeChild(keys[i]);
  }

  // hookup the browser window callbacks
  window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
        .getInterface(Components.interfaces.nsIWebNavigation)
        .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
        .treeOwner
        .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
        .getInterface(Components.interfaces.nsIXULWindow)
        .XULBrowserWindow = gXULBrowserWindow;

  var cl = window.arguments[0].QueryInterface(Components.interfaces.nsICommandLine);
  var startURI = cl.handleFlagWithParam("uri", false);
  if (startURI == null) {
    startURI = "http://oakssecure.starttest.com/"
  }

  var browser = getBrowser();

  currentURL = startURI
  browser.addEventListener("DOMTitleChanged", domTitleChanged, false)
  browser.webProgress.addProgressListener(browserProgressListener, nsIWebProgress.NOTIFY_ALL);
  browser.loadURI(params.uri, null, null);

  var browserContext = document.getElementById("main-popup");
  browserContext.addEventListener("popupshowing", popupShowing, false);
  
  var fileMenu = document.getElementById("menu_file").hidden = true;

  //load list of allowed URLs
  loadAllowedURLs();
}

function loadAllowedURLs(){
	try{
	var i = 0;
	var file = Components.classes["@mozilla.org/file/directory_service;1"]
		.getService(Components.interfaces.nsIProperties)
		.get("resource:app", Components.interfaces.nsIFile);
	file.append("chrome");
	file.append("content");
	file.append("URLs.txt");

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

function shutdown()
{
  window.removeEventListener("load", startup, false);
  window.removeEventListener("unload", shutdown, false);
  
  var browserContext = document.getElementById("main-popup");
  browserContext.removeEventListener("popupshowing", popupShowing, false);
}

function popupShowing(aEvent) {
  var cut = document.getElementById("cut-menuitem");
  var copy = document.getElementById("copy-menuitem");
  var paste = document.getElementById("paste-menuitem");
  var del = document.getElementById("delete-menuitem");

  var isContentSelected = !document.commandDispatcher.focusedWindow.getSelection().isCollapsed;

  var target = document.popupNode;
  var isTextField = target instanceof HTMLTextAreaElement;
  if (target instanceof HTMLInputElement && (target.type == "text" || target.type == "password"))
    isTextField = true;
  var isTextSelectied= (isTextField && target.selectionStart != target.selectionEnd);

  cut.setAttribute("disabled", ((!isTextField || !isTextSelectied) ? "true" : "false"));
  copy.setAttribute("disabled", (((!isTextField || !isTextSelectied) && !isContentSelected) ? "true" : "false"));
  paste.setAttribute("disabled", (!isTextField ? "true" : "false"));
  del.setAttribute("disabled", (!isTextField ? "true" : "false"));
}

function showAbout() {
}

function domUnload(aEvent) {
  aEvent.target.ownerDocument.removeEventListener("click", domClick, true);
  aEvent.target.ownerDocument.removeEventListener("DOMActivate", domActivate, true);
  aEvent.target.ownerDocument.removeEventListener("unload", domUnload, false);
}

function domTitleChanged(aEvent) {
  if (aEvent.target != this.contentDocument)
    return;

  document.title = aEvent.target.title;
}

function domClick(aEvent)
{
  var link = aEvent.target;

  if (link instanceof HTMLAnchorElement && 
      link.target != "" &&
      link.target != "_self" &&
      link.target != "_top") {
    aEvent.stopPropagation();
  }
}

function domActivate(aEvent)
{
  var link = aEvent.target;

  if (link instanceof HTMLAnchorElement && 
      link.target != "" &&
      link.target != "_self" &&
      link.target != "_top") {

    // We don't want to open external links in this process: do so in the
    // default browser.
    var ios = Components.classes["@mozilla.org/network/io-service;1"]
                        .getService(Components.interfaces.nsIIOService);

    var resolvedURI = ios.newURI(link.href, null, null);

    var extps = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
                          .getService(Components.interfaces.nsIExternalProtocolService);

    extps.loadURI(resolvedURI, null);
    aEvent.preventDefault();
    aEvent.stopPropagation();
  }
}

// nsIXULBrowserWindow implementation to display link destinations in the statusbar
var gXULBrowserWindow = {
  QueryInterface: function(aIID) {
    if (aIID.Equals(Components.interfaces.nsIXULBrowserWindow) ||
        aIID.Equals(Components.interfaces.nsISupports))
     return this;

    throw Components.results.NS_NOINTERFACE;
  },

  setJSStatus: function() { },
  setJSDefaultStatus: function() { },

  setOverLink: function(aStatusText, aLink) {
    var statusbar = document.getElementById("status");
    statusbar.label = aStatusText;
  }
};


// nsIWebProgressListener implementation to monitor activity in the browser.
var browserProgressListener = {
  _requestsStarted: 0,
  _requestsFinished: 0,

  // We need to advertize that we support weak references.  This is done simply
  // by saying that we QI to nsISupportsWeakReference.  XPConnect will take
  // care of actually implementing that interface on our behalf.
  QueryInterface: function(iid) {
    if (iid.equals(Components.interfaces.nsIWebProgressListener) ||
        iid.equals(Components.interfaces.nsISupportsWeakReference) ||
        iid.equals(Components.interfaces.nsISupports))
      return this;
    
    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  // This method is called to indicate state changes.
  onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus) {
    if (aStateFlags & nsIWebProgressListener.STATE_IS_REQUEST) {
      if (aStateFlags & nsIWebProgressListener.STATE_START) {
        this._requestsStarted++;
      }
      else if (aStateFlags & nsIWebProgressListener.STATE_STOP) {
        this._requestsFinished++;
      }
      
      if (this._requestsStarted > 1) {
        var value = (100 * this._requestsFinished) / this._requestsStarted;

        var progress = document.getElementById("progress");
        progress.setAttribute("mode", "determined");
        progress.setAttribute("value", value + "%");
      }
    }

    if (aStateFlags & nsIWebProgressListener.STATE_IS_NETWORK) {
      var progress = document.getElementById("progress");
      if (aStateFlags & nsIWebProgressListener.STATE_START) {
        progress.hidden = false;
      }
      else if (aStateFlags & nsIWebProgressListener.STATE_STOP) {
        progress.hidden = true;
        this.onStatusChange(aWebProgress, aRequest, 0, "Done");
        this._requestsStarted = this._requestsFinished = 0;
      }      
    }
    
    if (aStateFlags & nsIWebProgressListener.STATE_IS_DOCUMENT) {
      if (aStateFlags & nsIWebProgressListener.STATE_STOP) {
        var domDocument = aWebProgress.DOMWindow.document;
        domDocument.addEventListener("click", domClick, true);
        domDocument.addEventListener("DOMActivate", domActivate, true);
        domDocument.addEventListener("unload", domUnload, false);
      }
    }
  },

  // This method is called to indicate progress changes for the currently
  // loading page.
  onProgressChange: function(aWebProgress, aRequest, aCurSelf, aMaxSelf, aCurTotal, aMaxTotal) {
    if (this._requestsStarted == 1) {
      var progress = document.getElementById("progress");
      if (aMaxSelf == -1) {
        progress.setAttribute("mode", "undetermined");
      }
      else {
        progress.setAttribute("mode", "determined");
        progress.setAttribute("value", ((100 * aCurSelf) / aMaxSelf) + "%");
      }
    }
  },

  // This method is called to indicate a change to the current location.
  onLocationChange: function(aWebProgress, aRequest, aLocation) {
    //document.getElementById("location").value = aLocation.spec;
  },

  // This method is called to indicate a status changes for the currently
  // loading page.  The message is already formatted for display.
  onStatusChange: function(aWebProgress, aRequest, aStatus, aMessage) {
    var statusbar = document.getElementById("status");
    statusbar.setAttribute("label", aMessage);
  },

  // This method is called when the security state of the browser changes.
  onSecurityChange: function(aWebProgress, aRequest, aState) {
    var security = document.getElementById("security");

    var level = "unknown";
    switch (aState) {
      case nsIWebProgressListener.STATE_IS_SECURE | nsIWebProgressListener.STATE_SECURE_HIGH:
        security.setAttribute("level", "high");
        break;
      case nsIWebProgressListener.STATE_IS_SECURE | nsIWebProgressListener.STATE_SECURE_MEDIUM:
        security.setAttribute("level", "med");
        break;
      case nsIWebProgressListener.STATE_IS_SECURE | nsIWebProgressListener.STATE_SECURE_LOW:
        security.setAttribute("level", "low");
        break;
      case nsIWebProgressListener.STATE_IS_BROKEN:
        security.setAttribute("level", "broken");
        break;
      case nsIWebProgressListener.STATE_IS_INSECURE:
      default:
        security.removeAttribute("level");
        break;
    }
  }
};
