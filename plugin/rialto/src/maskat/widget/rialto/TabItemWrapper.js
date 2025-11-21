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
maskat.lang.Class.declare("maskat.widget.rialto.TabItemWrapper")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

    createWidget: function(parent) {
    	var folder = parent.unwrap();
		var item = folder.addTabItem(this.title);

		if (folder.orientation == "t" || folder.orientation == "b") {
			item.contenuOnglet.style.width = folder.width - 2;
			item.contenuOnglet.style.height = folder.height - folder.$tabSize - 2;
		} else if (folder.orientation == "l" || folder.orientation == "r") {
			item.contenuOnglet.style.width = folder.width - folder.$tabSize - 2;
			item.contenuOnglet.style.height = folder.height - 2;
		}
		
		var self = this;
		item.onEnableTab = function() { self.notifyEvent("onEnableTab", arguments); };

		this.widget = item;
		return item;
    },

	setParent: function(parent){
		this.parent = parent;
	}

});
