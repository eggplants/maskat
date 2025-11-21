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
maskat.lang.Class.declare("maskat.widget.rialto.TextWrapper")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

	defaultGetter: "getValue_",

	defaultSetter: "setValue_",
		
    createWidget: function(parent) {
    	var text = new rialto.widget.Text(
    		this.name,
    		this.top,
    		this.left,
    		this.width,
    		this.datatype,
    		null, /* parent */
    		this);

		var self = this;
		text.onblur = function() { self.notifyEvent("onblur", arguments); };
		text.onfocus = function() { self.notifyEvent("onfocus", arguments); };

		this.widget = text;
		return text;
    },

	getControlElement: function(){
		return this.widget.getHtmlExt().firstChild;
	},

	getValue_: function() {
		switch (this.widget.datatype) {
		case "DT":
		case "DA":
		case "D":
			return this.getDateTimeValue();
		default:
			return this.widget.getValue();
		}
	},
	
	getDateTimeValue: function(){
		var value = this.widget.getValue();

		if (value.length != 11){
			return "";
		}
		  
		switch(this.datatype) {
		case "D":
		     return this.getMonth() + "/" + this.getDay() + "/" + this.getYear();
		case "DA":
		     return this.getYear() + "-" + this.getMonth() + "-" + this.getDay();
		case "DT":
		     var datePart = this.getYear() + "-" + this.getMonth() + "-" + this.getDay();
		     var now = new Date();
		     var hours = now.getHours();
		     var strHours = hours < 10 ? "0" + hours :  "" + hours;
		     var minutes = now.getMinutes();
		     var strMinutes = minutes < 10 ? "0" + minutes : "" + minutes;
		     var seconds = now.getSeconds();
		     var strSeconds = seconds < 10 ? "0" + seconds : "" + seconds;
		     return datePart + "T" + strHours + ":" + strMinutes + ":" + strSeconds;
		  }
		  return "";
	},
	
	getYear: function(){
		var value = this.widget.getValue();
		if (value.length != 11){
			return "";
		}
		return value.substring(0,4);
	},
	
	getMonth: function(){
		var value = this.widget.getValue();
		if (value.length != 11){
			return "";
		}
		return value.substring(5,7);
	},
	
	getDay: function(){
		var value = this.widget.getValue();
		if (value.length != 11){
			return "";
		}
		return value.substring(8,10);
	},

	setValue_: function(value) {
		this.widget.setValue(value);
	},

	clear: function() {
		this.widget.setValue("");
	},

	setFocus: function() {
		this.widget.divExt.childNodes[0].focus();
	}
});
