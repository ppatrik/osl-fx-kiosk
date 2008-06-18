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

function Params(cl)
{
  if (!cl)
    return;

  var file = cl.handleFlagWithParam("webapp", false);
  if (file)
    file = cl.resolveFile(file);

  if (!file) {
    var uri = cl.handleFlagWithParam("url", false);
    if (uri) {
      uri = cl.resolveURI(uri);
      file = uri.QueryInterface(Components.interfaces.nsIFileURL).file;
    }
  }
        
  if (file)
    this.readFile(file);

  this.readCommandLine(cl);
}

Params.prototype = {
  uri: "http://oakssecure.starttest.com/",
  icon: "webrunner",
  showstatus: true,
  showlocation: false,
  enablenavigation: false,

  setParameter: function(name, value) {
    if (typeof this[name] != "string" && typeof this[name] != "boolean")
      return;

    if (typeof this[name] == "boolean")
      value = (value.toLowerCase() == "true" || value.toLowerCase() == "yes");

    this[name] = value;
  },

  readFile: function(file)
  {
    try {
      const PR_RDONLY = 0x01;

      var stream = Components.classes["@mozilla.org/network/file-input-stream;1"]
                             .createInstance(Components.interfaces.nsIFileInputStream);
      stream.init(file, PR_RDONLY, 0, 0);
      stream = stream.QueryInterface(Components.interfaces.nsILineInputStream);

      var line = {};
      var section = null;
      var eof = false;
      while (!eof) {
        eof = !stream.readLine(line);

        if (/^\s*\[(.*)\]\s*$/.test(line.value))
          section = RegExp.$1.toLowerCase();
        else if (section == "parameters" && /^\s*(.*?)=(.*?)\s*$/.test(line.value))
          this.setParameter(RegExp.$1.toLowerCase(), RegExp.$2);
      }
    }
    catch (e) {
      dump(e);
    }
  },

  readCommandLine: function(cl)
  {
    for (var key in this) {
      var value = cl.handleFlagWithParam(key, false);
      if (value != null)
        this.setParameter(key, value);
    }
  }
}
