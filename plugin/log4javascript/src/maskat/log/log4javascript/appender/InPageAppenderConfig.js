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
maskat.lang.Class.declare("maskat.log.log4javascript.InPageAppenderConfig")
	.extend("maskat.log.log4javascript.AppenderConfig", {
	/**
	 * InPageAppenderオブジェクトを生成します。
	 *
	 * @return InPageAppenderオブジェクト
	 */
	createAppender: function(){
		var layoutTmp;
		if (this.layout != null) {
			layoutTmp = this.layout.createLayout();
		} else {
			layoutTmp = new log4javascript.PatternLayout(
				"%d{HH:mm:ss} %-5p - %m{1}%n");
		}
		var containerElement = document.getElementById(this.div);
		if (containerElement == null){
				containerElement = document.createElement("div");
				containerElement.setAttribute("id", this.div);
				containerElement.style.position = "absolute";
				containerElement.style.bottom = "10px";
				containerElement.style.left = "10px";
				containerElement.innerHTML = "<div style=\"overflow:auto\"></div>";
				document.getElementsByTagName("body").item(0).appendChild(containerElement);
		}
		var appender = new log4javascript.InPageAppender(
			containerElement,
			this.lazyInit,
			layoutTmp, 
			this.initiallyMinimized,
			this.newestMessageAtTop,
			this.scrollToLatestMessage,
			this.width,
			this.height,
			this.maxMessages);
		return appender;
	}
});
