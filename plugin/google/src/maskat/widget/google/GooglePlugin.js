/*
 * Copyright (c)  2006-2011 Maskat Project.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
maskat.lang.Class.declare("maskat.widget.google.GooglePlugin")
	.extend("maskat.core.Plugin", {

	_static: {
		initialize: function() {
			maskat.core.Plugin.register(this);
		}
	},

	getPluginId: function() {
		return "google";
	},

	getVersion: function() {
		return "2.3.0.@build@";
	},

	isLoaded: function() {
		return typeof(google) != "undefined" && typeof(GMap2) != "undefined";
	},

	load: function() {
		maskat.app.loadJavaScript("http://www.google.com/jsapi?key="
			+ this.getProperty("key"), true);
		this.loader = new maskat.lang.Thread(this, this.loadModules, null, 100);
		this.loader.start();
	},

	loadModules: function() {
		if (typeof(google) != "undefined" && typeof(google.load) == "function") {
			this.loader.stop();
			google.load("maps", "2", { callback: function() {} });
		}
	},
	
	start: function() {
		var reader = maskat.layout.LayoutXMLReader.getInstance();
		var library = new maskat.widget.google.GoogleWidgetLibrary();
		reader.addWidgetLibrary(library);
	}

});
