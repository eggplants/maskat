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
maskat.lang.Class.declare("maskat.widget.compat.EndDialog")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

    createWidget: function(parent) {
    	/* NOP */
    },

	getElement: function() {
		return null;
	},

	setParent: function(parent) {
		if (this.parent == parent) {
			return;
		}
		this.parent = parent;
	},

	setVisible: function(visible) {
		/*
		 * アラートウインドウは閉じるとインスタンスが削除されるため、表示の
		 * たびに生成する
		 */
		if (visible) {
			this.widget = new rialto.widget.Alert(this.message);
			var button = this.widget.BQUIT.getHtmlExt();
			button.tabIndex = 32767;
			button.focus();
			
			var keyHandler = function(event) {
				var element = event.target || event.srcElement;
				switch (event.keyCode) {
				case 13:
				case 32:
					element.onclick(event);
					break;
				case 9:
					if (event.preventDefault) {
						event.preventDefault();
					} else {
						event.returnValue = false;
					}
					if (event.stopPropagation) {
						event.stopPropagation();
					} else {
						event.cancelBubble  = true;
					}
					break;
				}
			};
			maskat.util.CrossBrowser.addEventListener(
				button, "keydown", keyHandler);
				
		} else {
			this.widget.fen.setVisible(false);
		}
	},

	dispose: function() {
		maskat.lang.Object.dispose(this);
	}
});
