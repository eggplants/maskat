/*
 * Copyright (c)  2006-2011 Maskat Project.
 *
 * This software is the confidential and proprietary information of
 * NTT DATA CORPORATION ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with NTT DATA.
*/
maskat.lang.Class.declare("maskat.widget.maskat.Plugin")
	.extend("maskat.core.Plugin", {

	_static: {
		initialize: function() {
			maskat.core.Plugin.register(this);
		}
	},

	initialize: function() {
		this.properties = new maskat.util.Properties({
			enabled: { type: "boolean", defaultValue: false }
		});
	},

	getPluginId: function() {
		return "maskat";
	},

	getVersion: function() {
		return "2.3.0.@build@";
	},

	isLoaded: function() {
		return this.loadded;
	},

	load: function() {
		this.loadded = true;
	},

	start: function() {
		this.init();
		var path = maskat.location + "maskat/css/grid.css";
		maskat.app.loadStyleSheet(path);

		var reader = maskat.layout.LayoutXMLReader.getInstance();
		var library = new maskat.widget.maskat.WidgetLibrary();
		reader.addWidgetLibrary(library);
	},

	init: function() {
		maskat.widget.maskat.browser = {};
		var d = maskat.widget.maskat.browser;
		var doc = document;
		var n = navigator;
		var dua = n.userAgent,
			dav = n.appVersion,
			tv = parseFloat(dav);

		if (dua.indexOf("Opera") >= 0) { d.isOpera = tv; }
		if (dua.indexOf("AdobeAIR") >= 0) { d.isAIR = 1; }
		d.isKhtml = (dav.indexOf("Konqueror") >= 0) ? tv : 0;
		d.isWebKit = parseFloat(dua.split("WebKit/")[1]) || undefined;
		d.isChrome = parseFloat(dua.split("Chrome/")[1]) || undefined;
		var index = Math.max(dav.indexOf("WebKit"), dav.indexOf("Safari"), 0);
		if(index && !dojo.isChrome){
			d.isSafari = parseFloat(dav.split("Version/")[1]);
			if(!d.isSafari || parseFloat(dav.substr(index + 7)) <= 419.3){
				d.isSafari = 2;
			}
		}
		if(dua.indexOf("Gecko") >= 0 && !d.isKhtml && !d.isWebKit) {
			d.isMozilla = d.isMoz = tv;
		}
		if(d.isMoz){
			d.isFF = parseFloat(dua.split("Firefox/")[1] ||
					dua.split("Minefield/")[1] || dua.split("Shiretoko/")[1]) || undefined;
		}
		if(doc.all && !d.isOpera){
			d.isIE = parseFloat(dav.split("MSIE ")[1]) || undefined;
			if(d.isIE >= 8 && doc.documentMode != 5){
				d.isIE = doc.documentMode;
			}
		}
		var cm = doc.compatMode;
		d.isQuirks = cm == "BackCompat" || cm == "QuirksMode" || d.isIE < 6;

		var className;
		if (d.isIE) {
			className = "maskat_ie" + Math.floor(d.isIE);
		} else if (d.isFF) {
			className = "maskat_ff" + Math.floor(d.isFF);
		} else if (d.isSafari) {
			className = "maskat_safari" + Math.floor(d.isSafari);
		} else if (d.isOpera) {
			className = "maskat_opera" + Math.floor(d.isOpera);
		} else if (d.isChrome) {
			className = "maskat_chrome" + Math.floor(d.isChrome);
		} else if (d.isWebKit) {
			className = "maskat_webkit" + Math.floor(d.isWebKit);
		}
		var element = doc.documentElement;
		if (className && element) {
			element.className += ((element.className.length > 0 ? " " : "") + className);
		}
	}
});
