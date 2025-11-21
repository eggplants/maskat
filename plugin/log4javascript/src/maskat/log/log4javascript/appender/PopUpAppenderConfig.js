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
maskat.lang.Class.declare("maskat.log.log4javascript.PopUpAppenderConfig")
	.extend("maskat.log.log4javascript.AppenderConfig", {
	/**
	 * PopUpAppenderオブジェクトを生成します。
	 *
	 * @return PopUpAppenderオブジェクト
	 */
	createAppender: function(){
		var layoutTmp;
		if (this.layout != null) {
			layoutTmp = this.layout.createLayout();
		} else {
			layoutTmp = new log4javascript.PatternLayout(
				"%d{HH:mm:ss} %-5p - %m{1}%n");
		}
		var appender = new log4javascript.PopUpAppender(
			this.lazyInit,
			layoutTmp,
			this.focusPopUp,
			this.useOldPopUp,
			this.complainAboutPopUpBlocking,
			this.newestMessageAtTop,
			this.scrollToLatestMessage,
			this.reopenWhenClosed,
			this.width,
			this.height,
			this.maxMessages);
		return appender;
	}
});
