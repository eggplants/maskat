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
maskat.lang.Class.declare("maskat.widget.google.GoogleWidgetLibrary")
	.extend("maskat.layout.WidgetLibrary", {

	getBindingConfiguration: function() {
		return {
			googleMap: {
				type: maskat.widget.google.Map2Wrapper,
				attributes: {
					name: { type: "string", required: true },
					top: { type: "number", required: true },
					left: { type: "number", required: true },
					width: { type: "number", defaultValue: 0 },
					height: { type: "number", defaultValue: 0 },
					initialLongitude: { type: "number", defaultValue: 0 },
					initialLatitude: { type: "number", defaultValue: 0 },
					initialZoomLevel: { type: "number", defaultValue: 10 },
					mapControl: { type:"enum", values: ["large","small"] },
					typeControl: { type:"boolean" },
					doubleClickZoom: { type:"boolean" },
					continuousZoom: { type:"boolean" }
				}
			}
		};
	}

});
