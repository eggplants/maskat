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
maskat.lang.Class.declare("maskat.widget.rialto.ButtonWrapper")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

    createWidget: function(parent) {
    	var button = new rialto.widget.Button(
    		this.top,
    		this.left,
    		this.title,
    		this.alt,
    		null, /* parent */
    		this);

		var self = this;
		button.onclick = function() { self.notifyEvent("onclick", arguments); };
    	
		this.widget = button;
		return button;
    },
    
    postCreateWidget: function() {
		this.widget.divExt.tabIndex = this.getTabIndex();
    },

	handleKeyEvent: function(event) {
		if (event.keyCode == 13 || event.keyCode == 32) {
			this.widget.onclick();
			return false;
		}
		return true;
	},
	
	setFocus: function() {
		this.widget.divExt.focus();
	}
});

