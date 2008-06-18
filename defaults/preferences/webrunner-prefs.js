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

pref("browser.dom.window.dump.enabled", true);
pref("javascript.options.showInConsole", true);

pref("javascript.enabled", true);

pref("network.protocol-handler.warn-external.http", false);
pref("network.protocol-handler.warn-external.https", false);
pref("network.protocol-handler.warn-external.ftp", false);


pref("security.warn_entering_secure.show_once", false);
pref("security.warn_entering_secure", false);
pref("security.warn_leaving_secure.show_once", false);
pref("security.warn_leaving_secure", false);

pref("dom.allow_scripts_to_close_windows", true);

pref("browser.formfill.enable", true);

pref("browser.download.useDownloadDir", true);
pref("browser.download.folderList", 0);
pref("browser.download.manager.showAlertOnComplete", true);
pref("browser.download.manager.showAlertInterval", 2000);
pref("browser.download.manager.retention", 2);
pref("browser.download.manager.showWhenStarting", true);
pref("browser.download.manager.useWindow", true);
pref("browser.download.manager.closeWhenDone", true);
pref("browser.download.manager.openDelay", 0);
pref("browser.download.manager.focusWhenStarting", false);
pref("browser.download.manager.flashCount", 2);

pref("alerts.slideIncrement", 1);
pref("alerts.slideIncrementTime", 10);
pref("alerts.totalOpenTime", 4000);
pref("alerts.height", 50);

pref("toolkit.defaultChromeURI", "chrome://kiosk/content/kiosk.xul");  // - main xul window
pref("browser.chromeURL", "chrome://kiosk/content/kiosk.xul");  // - allow popup windows to open
