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
maskat.lang.Object.populate(maskat, {

	appInit: function(){
		maskat.core.Application.bootstrap();
	},

	loadLayoutFile: function(uri, element, visible){
		var regexp = /document\.getElementById\((['"])(.*)\1\)/;

		if (typeof(element) == "string") {
			var match = element.match(regexp);
			if (match) {
				element = document.getElementById(RegExp.$2);
			} else {
				element = document.getElementById(element);
			}
		}

		visible = visible || (arguments.length < 3);
		var layout = maskat.app.loadLayout(uri, null, element, visible); 

		this.lastLoadedLayout = layout;
	},

	showLayout: function(layoutId){
		var layout = maskat.app.getLayout(layoutId);
		if (layout) {
			layout.setVisible(true);
		}
	},
	
	hideLayout: function(layoutId){
		var layout = maskat.app.getLayout(layoutId);
		if (layout) {
			layout.setVisible(false);
		}
	},
	
	removeLayout: function(layoutId){
		maskat.app.unloadLayout(layoutId);
	},

	loadEventFile: function(uri){
		var layout = this.lastLoadedLayout;
		if (layout) {
			/* 直前にロードしたレイアウトとディスパッチャを対応付ける */
			var dispatcher = maskat.event.EventXMLReader.getInstance().load(uri);
			layout.addEventListener(dispatcher);

			this.lastLoadedLayout = null; 

			/*
			 * レイアウトの onload イベントは maskat.loadLayoutFile() の時点で
			 * 発生済みのため、ここで疑似的に再発生させる
			 */
			dispatcher.handleEvent(new maskat.event.Event(layout, layout, "onload"));
		}
	},

	loadJSFile: function(uri){
		maskat.app.loadJavaScript(uri, false);
	},
	
	loadJSSrc: function(source){
		maskat.app.loadJavaScriptFromString(source);
	},

	loadCSSFile: function(uri){
		maskat.app.loadStyleSheet(uri);
	},
	
	getFWLog: function(){
		return maskat.log.LogFactory.getLog("maskat.framework");
	},
	
	getCMULog: function(){
		return maskat.log.LogFactory.getLog("maskat.comm");
	},

	getAppLog: function(){
		return maskat.log.LogFactory.getLog("maskat.application");
	}

});
