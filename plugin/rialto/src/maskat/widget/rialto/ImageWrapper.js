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
maskat.lang.Class.declare("maskat.widget.rialto.ImageWrapper")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

	defaultSetter: "setImages",
	
    createWidget: function(parent) {
		var orgName = this.name;
    	var image = new rialto.widget.Image(
    		this.imageOut,
    		this.left,
    		this.top,
    		null, /* parent */
    		this.alternateText,
			this.imageOn,
			this);

		var self = this;
		image.onclick = function() { self.notifyEvent("onclick", arguments); };

		this.name = orgName;
		this.widget = image;
		return image;
    },

	setImages: function(value) {
		this.widget.setImages(value);
	},

	clear: function() {
		this.widget.setImages("");
	}
});

