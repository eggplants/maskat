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
maskat.lang.Class.declare("maskat.widget.rialto.PopupWrapper")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

    createWidget: function(parent) {
		var popup= new rialto.widget.PopUp(
			this.name,
			this.top,
			this.left,
			this.width,
			this.height,
			this.content, /* parent */
			this.title,
			this.suffFond,
			this);
		
		var self = this;
		popup.onClose = function() { self.notifyEvent("onClose", arguments); };
		
		this.widget = popup;
		return popup;
	},

	postCreateWidget: function() {
		var self = this;
		var layoutId = this.getLayout().getWidgetId();
		var dispatcher = {
			handleEvent: function(event) {
				if (event.layoutId == layoutId &&
					event.widgetId == layoutId &&
					event.type == "onhide") {
					self.setVisible(false);
				}
			}
		}
		this.getLayout().addEventListener(dispatcher);
	},

	setParent: function(parent) {
		if (this.parent == parent) {
			return;
		}
		this.parent = parent;
	}

});
