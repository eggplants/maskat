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
maskat.lang.Class.declare("maskat.widget.rialto.ComboWrapper")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

	defaultGetter: "getSelectedValue",

	defaultSetter: "setSelectedValue",
	
    createWidget: function(parent) {
	   	/* コンボボックスの項目が未定義の場合は空配列を設定 */
	   	if(typeof(this.tabData) == "undefined"){
    		this.tabData = [];
    	}

    	var combo = new rialto.widget.Combo(
    		this.tabData,
    		this.name,
    		this.top,
    		this.left,
    		this.width,
    		null, /* parent */
    		this);

		var self = this;
		combo.onclick = function() {
			self.setFocus();
			self.notifyEvent("onclick", arguments);
		};
    	combo.onblur = function() { self.notifyEvent("onblur", arguments); };
    		
    	this.widget = combo;
    	return combo;
    },

    postCreateWidget: function() {
		this.widget.divExt.tabIndex = this.getTabIndex();
    },
	
	getControlElement: function(){
		return this.widget.text.getHtmlExt().firstChild;
	},

	getSelectedValue: function() {
		return this.widget.getSelValue();
	},

	setSelectedValue: function(value) {
		this.widget.selWithValue(value);
	},
	
	setFocus: function() {
		this.widget.text.divExt.childNodes[0].focus();
	}
});

