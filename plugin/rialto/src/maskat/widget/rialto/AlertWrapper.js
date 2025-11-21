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
maskat.lang.Class.declare("maskat.widget.rialto.AlertWrapper")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

    createWidget: function(parent) {
    	var alertWrapper = new rialto.widget.Alert(this.mess);
    	
    	var self = this;
    	
    	alertWrapper.onclose = function() { self.notifyEvent("onclose", arguments); };
		
		
		this.widget = alertWrapper;
		return alertWrapper;
    },

	setParent: function(parent) {
		if (this.parent == parent) {
			return;
		}
		this.parent = parent;
	},

	dispose: function() {
		maskat.lang.Object.dispose(this);
	}
});
