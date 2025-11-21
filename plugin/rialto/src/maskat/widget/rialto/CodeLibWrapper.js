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
maskat.lang.Class.declare("maskat.widget.rialto.CodeLibWrapper")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

	defaultGetter: "getCode",

	defaultSetter: "setCode",
	
	createWidget: function(parent) {
		var codeLib = new rialto.widget.codeLabel(
			this.name,
			this.top,
			this.left,
			this.width,
			null, /* parent */
			this);
		
		if(this.enable == false){
			codeLib.setEnable(false);
		}	
		
		this.widget = codeLib;
		return codeLib;
	},

    postCreateWidget: function() {
		this.widget.code.champs.tabIndex = this.getTabIndex();
		this.widget.img.divExt.tabIndex = this.getTabIndex();
    },

	getCode: function() {
		return this.widget.getValue();
	},

	setCode: function(value) {
		this.widget.code.setValue(value);
		if (this.widget.getValue() != "") {
           
                this.widget.checkValue();
        } 
	},

	handleKeyEvent: function(event) {
		var element = event.target || event.srcElement;
		if (event.keyCode == 9) {
			if (element == this.widget.code.champs) {
				if (!event.shiftKey) {
					this.widget.img.divExt.focus();
					return false;
				}
			} else if (event.shiftKey) {
				this.widget.code.champs.focus();
				return false;
			}
		} else if (this.focusPos == 1 && event.keyCode == 13 || event.keyCode == 32) {
			this.widget.img.onclick();
			return false;
		}
		return true;
	},
	
	setFocus: function() {
		this.widget.code.champs.focus();
	},
	
	getControlElement: function(){
		/* codeLabel のコード入力用要素を返却 */
		return this.widget.code.getHtmlExt().firstChild;
	}
});
