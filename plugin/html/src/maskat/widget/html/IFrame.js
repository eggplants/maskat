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
maskat.lang.Class.declare("maskat.widget.html.IFrame")
	.extend("maskat.widget.html.HTMLWidget", {

	defaultGetter: "getSrc",

	defaultSetter: "setSrc",
	
    createWidget: function(parent) {
		var iframe = document.createElement("iframe");
		iframe.style.position = "absolute";
		iframe.style.top = this.top;
		iframe.style.left = this.left;
		iframe.style.width = this.width;
		iframe.style.height = this.height;
		iframe.src = this.url;

		this.element = iframe;
    },

	getSrc: function(){
		return this.element.src;
	},

	setSrc: function(value){
		if (value) {
			this.element.src = value;
		}
	}

});
