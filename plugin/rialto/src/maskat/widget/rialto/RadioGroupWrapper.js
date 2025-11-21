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
maskat.lang.Class.declare("maskat.widget.rialto.RadioGroupWrapper")
	.extend("maskat.layout.Widget", {

	createWidget: function(parent) {
		
		if (! this.members) {
			this.members = [];
		}
		return this.members;
	
	},

	defaultGetter: "getSelectedMemberName",

	defaultSetter: "setSelectedMemberName",
	
   	getWidgetId: function() {
		return this.name;
	},
	
	addMember: function(name, tabIndex) {
		if (! this.isMember(name)) {
			this.members.push(name);
		}
		
		this.setGroupTabIndex(name, tabIndex);
	},
	
	setGroupTabIndex: function(name, tabIndex) {
		if (! this.isMember(name)) {
			return;
		}
		if ((this.tabIndex <= 0 && tabIndex > 0) 
			|| (tabIndex > 0 && this.tabIndex > tabIndex)) {
			this.tabIndex = tabIndex;
		}
	},
	
	isMember: function(name) {
		for (var i=0; i<this.members.length; i++) {
			if (this.members[i] == name) {
				return true;
			}
		}
		return false;
	},
	
	delMember: function(name) {
		for (var i=0; i<this.members.length; i++) {
			if (this.members[i] == name) {
				this.members = this.members.slice(0, i).concat(this.members.slice(i+1));
				break;
			}
		}
	},
	
	setFocus: function() {
		var widget = this.getSelection();
		if (widget) {
			widget.radio.focus();
		} else if (this.members.length > 0) {
			var layout = this.getLayout();
			for (var i=0; i<this.members.length; i++) {
				var radio = layout.getWidget(this.members[i]);
				if (radio) {
					radio.unwrap().radio.focus();
					break;
				}
			}
		}
	},
	
	getSelectedMemberName: function() {
		var widget = this.getSelection();
		if (widget) {
			return widget.name;
		}
	},

	setSelectedMemberName: function(value) {
		var widget = this.getLayout().getWidget(value);
		if (widget && this.isMember(value)) {
			widget.unwrap().setCheck(true);
		}
	},
	
	getSelection: function() {
		var layout = this.getLayout();
		for (var i = 0; i < this.members.length; i++) {
			var widget = layout.getWidget(this.members[i]);
			if (widget && widget.unwrap().isCheck()) {
				return widget.unwrap();
			}
		}
		return null;
	},
	
	getTabIndex: function() {
		var layout = this.getLayout();
		for (var i = 0; i < this.members.length; i++) {
			var widget = layout.getWidget(this.members[i]);
			if (widget) {
				return this.tabIndex;
			}
		}
		return -1;
	},

	isVisible: function(){
		var layout = this.getLayout();
		for (var i = 0; i < this.members.length; i++) {
			var widget = layout.getWidget(this.members[i]);
			if (widget && widget.isVisible()) {
				return true;
			}
		}
		return this.members.length == 0;
	},
	
	setVisible: function(visible){
		var layout = this.getLayout();
		for (var i = 0; i < this.members.length; i++) {
			var widget = layout.getWidget(this.members[i]);
			if (widget) {
				widget.setVisible(visible);
			}
		}
	},

    isEnabled: function(){
		var layout = this.getLayout();
		for (var i = 0; i < this.members.length; i++) {
			var widget = layout.getWidget(this.members[i]);
			if (widget && widget.isEnabled()) {
				return true;
			}
		}
		return this.members.length == 0;
    },

	setEnabled: function(enabled){
		var layout = this.getLayout();
		for (var i = 0; i < this.members.length; i++) {
			var widget = layout.getWidget(this.members[i]);
			if (widget) {
				widget.setEnabled(enabled);
			}
		}
	}
});
