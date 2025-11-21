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
maskat.lang.Class.declare("maskat.widget.rialto.SimpleWindowWrapper")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

	createWidget: function(parent) {
		var simpleWindow = new rialto.widget.SimpleWindow(this);

		var self = this;
		simpleWindow.onSetTitle = function() { self.notifyEvent("onSetTitle", arguments); };
		simpleWindow.onClose = function() { self.notifyEvent("onclose", arguments); };

		this.widget = simpleWindow;

		var setVisible = simpleWindow.setVisible;
		simpleWindow.setVisible = function(visible) {
			if (!visible || !this.isVisible()) {
				if (visible && self.getElement().offsetWidth <= 0) {
					rialto.widget.SimpleWindow.prototype.openWindow = this;
					this.getHtmlExt().style.display = "block";
				} else {
					setVisible.call(this, visible);
				}
			}
		}
		return simpleWindow;
    }

});
