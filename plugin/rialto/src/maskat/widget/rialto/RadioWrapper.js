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
maskat.lang.Class.declare("maskat.widget.rialto.RadioWrapper")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

	createWidget: function(parent) {
//		this.group = maskat.widget.rialto.RadioGroupWrapper.getGroup(this.name);
		this.checkGroupInfo(parent);
		var radio = new rialto.widget.Radio(
			this.name,
			this.top,
			this.left,
			null, /* parent */
			this.group,
			this.text,
			this.checked,
			this.className);
		radio.setEnable(this.enable);

		var self = this;
		radio.onclick = function() { self.notifyEvent("onclick", arguments); };
		this.widget = radio;

		this.tabIndexGroupName = this.group;
		if (this.group) {
			this.tabIndex = 0;
		}

		this.widget.radio.disabled = !this.enable;
		this.widget.radio.tabIndex = 0;
		rialto.widget.Form.prototype.tabIndex = 0;
		return radio;
    },

    checkGroupInfo: function(parent) {

    	var layout = parent.getLayout();
	    var radioGroup;

    	if (this.group) {
			radioGroup = layout.getWidget(this.group);

			if (radioGroup) {
				radioGroup.addMember(this.name, this.tabIndex);
			} else {
				radioGroup = new maskat.widget.rialto.RadioGroupWrapper();
				radioGroup.name = this.group;
				radioGroup.createWidget(parent);
				radioGroup.setParent(layout);
				layout.addWidget(radioGroup);
				radioGroup.addMember(this.name, this.tabIndex);
	  		}
	  	}

		var widgets = layout.widgets;
		for (var prop in widgets) {
			if (widgets[prop] instanceof maskat.widget.rialto.RadioGroupWrapper && widgets[prop].isMember(this.name)) {
				if (this.group && this.group != prop) {
					widgets[prop].delMember(this.name);
				} else if (! this.group) {
    				this.group = prop;
					widgets[prop].setGroupTabIndex(this.name, this.tabIndex);
				}
			}
		}
    },

	handleKeyEvent: function(event) {
		if (event.keyCode == 13 || event.keyCode == 32) {
			this.widget.setCheck(true);

		} else if (this.group && (event.keyCode == 37 || event.keyCode == 38)) {
			var members = this.getLayout().widgets[this.group].members;
			var radio = this.getLayout().widgets;
			for (var i = 1; i < members.length; i++) {
				if (radio[members[i]].widget.name == this.name) {
					this.getLayout().widgets[members[i]].widget.radio.focus();
					break;
				}
			}
		} else if (this.group && (event.keyCode == 39 || event.keyCode == 40)) {
			var members = this.getLayout().widgets[this.group].members;
			var radio = this.getLayout().widgets;
			for (var i = 0; i < members.length - 1; i++) {
				if (radio[members[i]].widget.name == this.name) {
					this.getLayout().widgets[members[i]].widget.radio.focus();
					break;
				}
			}
		}
		return true;
	},

	getTabIndex: function() {
		if (this.group) {
			return -1;
		} else {
			return this.tabIndex;
		}
	},

	setFocus: function() {
		if (this.tabIndex > 0) {
			this.widget.radio.focus();
		}
	},

	setEnabled: function(enabled){
		this.widget.setEnable(enabled);
		this.widget.radio.disabled = !enabled;
	}
});
