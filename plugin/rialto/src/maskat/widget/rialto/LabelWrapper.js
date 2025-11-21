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
maskat.lang.Class.declare("maskat.widget.rialto.LabelWrapper")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

	defaultGetter: "getText",

	defaultSetter: "setText",
	
	createWidget: function(parent) {
		var label = new rialto.widget.Label(
			this.name,
			this.top,
			this.left,
			null, /* parent */
			this.text,
			this.className,
			this);

		this.widget = label;
		return label;
	},

	getText: function() {
		return this.widget.text;
	},

	setText: function(value) {
		this.widget.setText(value);
	},

	clear: function() {
		this.widget.setText("");
	}

});
