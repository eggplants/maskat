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
maskat.lang.Class.declare("maskat.widget.rialto.RialtoPlugin")
	.extend("maskat.core.Plugin", {

	_static: {
		initialize: function() {
			maskat.core.Plugin.register(this);
		}
	},

	initialize: function() {
		this.properties = new maskat.util.Properties({
			version: { type: "number", defaultValue: 0.9 },
			isDebug: { type: "boolean", defaultValue: false },
			traceLevel: { type: "number", defaultValue: 0 },	
			isTestVersion: { type: "boolean", defaultValue: false },
			language: { type: "string", defaultValue: "en" }
		});
	},

	getPluginId: function() {
		return "rialto";
	},

	getVersion: function() {
		return "2.3.0.@build@";
	},

	isLoaded: function() {
		return (typeof(rialto) != "undefined") &&
			(typeof(rialtoConfig) != "undefined") &&
			(typeof(rialto.onLoad) == "function");
	},

	load: function(app) {
		var pathRialtoE = maskat.location + "rialto/rialtoEngine/";
		maskat.app.loadStyleSheet(pathRialtoE + "style/rialto.css");
		maskat.app.loadStyleSheet(pathRialtoE + "style/behavior.css");
		maskat.app.loadStyleSheet(pathRialtoE + "style/defaultSkin.css");

		maskat.app.loadJavaScript(pathRialtoE + "config.js", false);
		maskat.app.loadJavaScript(pathRialtoE + "javascript/rialto.js", true);
	},
	
	start: function() {
		maskat.lang.Object.populate(rialtoConfig, this.properties.getProperties());
		rialtoConfig.pathRialtoE = maskat.location + "rialto/rialtoEngine/";
		rialto.onLoad();
		
		var reader = maskat.layout.LayoutXMLReader.getInstance();
		var library = new maskat.widget.rialto.RialtoWidgetLibrary();
		reader.addWidgetLibrary(library);
	}

});
