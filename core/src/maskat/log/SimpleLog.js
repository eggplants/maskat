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
/**
 * @class
 * 簡易的なログ出力 API の実装クラスです。
 * ログ出力時にポップアップウインドウを開いてログメッセージを表示します。
 *
 * <p>
 * このクラスはマスカットフレームワークのデフォルトのログ出力 API として
 * 利用されます。
 * </p>
 *
 * @name maskat.log.SimpleLog
 * @extends maskat.log.Log
 */
maskat.lang.Class.declare("maskat.log.SimpleLog").extend("maskat.log.Log", {

	/** @scope maskat.log.SimpleLog.prototype */

	initialize: function(name, level, focus) {
		this.base.apply(this, arguments);
		this.name = name;
		this.level = level || maskat.log.Log.WARN;
		this.focus = focus || false;
	},

	getLevel: function() {
		return this.level;
	},

	trace: function(message, error) {
		if (this.level <= maskat.log.Log.TRACE) {
			this.log("TRACE", message, "#666666");
		}
	},

	debug: function(message, error) {
		if (this.level <= maskat.log.Log.DEBUG) {
			this.log("DEBUG", message, "green");
		}
	},

	info: function(message, error) {
		if (this.level <= maskat.log.Log.INFO) {
			this.log("INFO", message, "#000099");
		}
	},

	warn: function(message, error) {
		if (this.level <= maskat.log.Log.WARN) {
			this.log("WARN", message, "#999900");
		}
	},

	error: function(message, error) {
		if (this.level <= maskat.log.Log.ERROR) {
			this.log("ERROR", message, "red");
		}
	},

	fatal: function(message, error) {
		if (this.level <= maskat.log.Log.FATAL) {
			this.log("FATAL", message, "#660066");
		}
	},
	
	console: null,

	lineCounter: 0,

	log: function(level, message, color) {
		var doc = this.getLogDocument();
		var msgDiv = doc.createElement("div");
		// TODO: エラー処理　各ブラウザごとに改行させる
		// word-breakはIEのみ有効
		//"white-space:pre-wrap;"       /* css-3 */
		//"white-space:-moz-pre-wrap;"  /* Mozilla, since 1999 */
		//"white-space:-pre-wrap;"      /* Opera 4-6, FireFox3 */
		//"white-space:-o-pre-wrap;"    /* Opera 7 */
		//"word-break:break-all;"       /* IE5.5+ */
		var wrap;
		if (navigator.userAgent.indexOf("MSIE") != -1) {
			wrap = "word-break:break-all;";
		} else {
			wrap = "white-space:pre-wrap;white-space:-moz-pre-wrap;";
		}
		var style = "border-top:1px solid #cecece;margin-top:5px;padding-left:5px;font-size:12px;" + wrap;
		var colorStyle = (this.lineCounter++ % 2) == 0 ? "#eeeeee" : "white";
		var timeStyle = "'float:left;width:28%;background-color:#525D76;color:white;" + style + "'";
		var msgStyle =  "'float:left;width:70%;background-color:" + colorStyle + ";" + style + "min-height:2.5em;_height:3em;'";
		var levelMsg = "\n<span style='color:while;font-weight:bold;background-color:" +
				color + ";'> " + level + " </span>";
				
		message = maskat.lang.String.escapeHTML(message);
		msgDiv.innerHTML =
			"<pre><span style=" + timeStyle + ">" + (new Date()).toLocaleString() + levelMsg + "</span>" +
			"<span style=" + msgStyle + ">" + message + "</span></pre>";
			
		var div = this.getLogElement(doc);
		if (!div) {
			if (!this.fragment) {
				this.fragment = doc.createDocumentFragment();
			}
			this.fragment.appendChild(msgDiv);
			
			if (!this.documentStatus) {
				var self = this;
				doc.onreadystatechange = function() {
					if (this.readyState == "complete") {
						self.checkBodyElement();
						self.documentStatus = false;
					}
				}
				this.documentStatus = true;
				doc.onreadystatechange();
			}
		} else {
			div.appendChild(msgDiv);
			this.adjustMessagePosition(div);
		}
	},	
	
	adjustMessagePosition: function(div) {
		div.scrollTop = div.scrollHeight - div.offsetHeight;
		if (this.focus) {
			if (navigator.appName == "Netscape") {
				window.blur();
			}
			this.console.focus();
		}
	},
	
	getLogDocument: function() {
		if (!this.console || this.console.closed) {
			var prop = "width=700,height=200,titlebar=no,toolbar=no,status=no,resizable,dependent=yes";
			this.console = window.open("", "maskatSimpleLog", prop);
		}
		return this.console.document;
	},

	getLogElement: function(doc) {
		var element = doc.getElementById("maskat.log.SimpleLog");
		if (!element) {
			var body = doc.getElementsByTagName("body");
			if (!body || !(body.item(0))) {
				return null;
			}
			element = doc.createElement("div");
			element.setAttribute("id", "maskat.log.SimpleLog");
			element.innerHTML = "<div style='position:absolute;height:95%;width:99%;overflow:auto;'/>";
			body.item(0).appendChild(element);
		}
		return element.getElementsByTagName("div").item(0);
	},

	checkBodyElement: function() {
		var div = this.getLogElement(this.getLogDocument());
		if (this.fragment) {
			div.appendChild(this.fragment);
			this.adjustMessagePosition(div);
			this.fragment = null;
		}
	}
});

