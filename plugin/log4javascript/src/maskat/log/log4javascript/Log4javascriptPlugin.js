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
maskat.lang.Class.declare("maskat.log.log4javascript.Log4javascriptPlugin")
	.extend("maskat.core.Plugin", {

	_static: {
		initialize: function() {
			maskat.core.Plugin.register(this);
		}
	},

	getPluginId: function() {
		return "log4javascript";
	},

	getVersion: function() {
		return "2.3.0.@build@";
	},

	isLoaded: function() {
		return typeof(log4javascript) != "undefined";
	},

	load: function() {
		maskat.app.loadJavaScript(
			maskat.location + "log4javascript/log4javascript.js", true);
	},
	
	/**
	 * 設定ファイル(log4javascript.xml)の値より、全てのロガーを生成します。
	 */
	start: function() {
		this.patch();

		var url = maskat.location + "log4javascript/log4javascript.xml";
		
		var xmlreader = maskat.log.log4javascript.Log4javascriptXMLReader
			.getInstance();
		xmlreader.load(url);
	},

	patch: function() {
		/*
		 * log4javascript 1.3.1のAjaxAppenderには２バイトコードを送信できない
		 * 不具合があります。それを解消するために以下のコードに置き換えていま
		 * す。
		 */
		log4javascript.HttpPostDataLayout.prototype.format = function(loggingEvent) {
			var dataValues = this.getDataValues(loggingEvent);
			var queryBits = [];
			for (var i = 0; i < dataValues.length; i++) {
				queryBits.push(encodeURI(dataValues[i][0] + "=" + dataValues[i][1]));
			}
			return queryBits.join("&");
		};
	}
});
