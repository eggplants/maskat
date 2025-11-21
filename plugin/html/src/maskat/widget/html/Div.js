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
maskat.lang.Class.declare("maskat.widget.html.Div")
	.extend("maskat.widget.html.HTMLWidget", {

	defaultGetter: "getInnerHTML",

	defaultSetter: "setInnerHTML",
	
    createWidget: function(parent) {
		var div = document.createElement("div");

		div.className = this.className;
		div.style.position = this.position || "absolute";
		div.style.left = this.left + "px";
		div.style.top = this.top + "px";
		div.style.whiteSpace = "nowrap";
		div.innerHTML = this.element || "";

		this.element = div;
    },
    
	getInnerHTML: function(){
		return this.element.innerHTML;
	},

	setInnerHTML: function(value){
		this.element.innerHTML = value;
	}

});
