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
maskat.lang.Class.declare("maskat.widget.rialto.TabFolderWrapper")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

    createWidget: function(parent) {
  		var folder = new rialto.widget.TabFolder(this);

    	this.widget = folder;
    	return folder;
    },

    postCreateWidget: function() {
    	var folder = this.unwrap();
   		folder.activeTab(this.noActiveTab - 1);
		this.widget.divExt.tabIndex = this.getTabIndex();
    },

	handleKeyEvent: function(event) {
		if (event.keyCode == 39) {
			var pos = this.widget.indActiveTab + 1;
			if (pos < this.widget.arrTabItem.length) {
				this.widget.activeTab(pos);
			}
			return false;
			
		} else if (event.keyCode == 37) {
			var pos = this.widget.indActiveTab - 1;
			if (pos >= 0) {
				this.widget.activeTab(pos);
			}
			return false;
		}
		return true;
	},

	setFocus: function() {
		this.widget.divExt.focus();
	},
	
	isVisible: function(){
		var index = this.widget.indActiveTab;
		return this.widget.isVisible(index);
	}
});
