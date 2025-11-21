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
maskat.lang.Class.declare("maskat.widget.html.HTMLWidgetLibrary")
	.extend("maskat.layout.WidgetLibrary", {

	getBindingConfiguration: function() {
		return {
			javaScriptGlobal: {
				type: maskat.widget.html.Script,
				children: {
					"#cdata-section": { property: "text" }
				}
			},
			
			javaScript: {
				type: maskat.widget.html.Script,
				children: {
					"#cdata-section": { property: "text" }
				}
			},
			
			divHtml: {
				type: maskat.widget.html.Div,
				attributes: {
					name: { type: "string" , required: true  },
					top: { type: "number" , required: true  },
					left: { type: "number" , required: true  },
					className: { type: "string" },
					position: {
						type: "enum",
						values: [ "static", "relative", "absolute" ]
					}
				},
				children: {
					"#cdata-section": { property: "element" }
				}
			},
	
			iFrame: {
				type: maskat.widget.html.IFrame,
				attributes: {
					name: { type: "string" , required: true  },
					top: { type: "number" , required: true },
					left: { type: "number" , required: true },
					width: { type: "number", defaultValue: 0 },
					height: { type: "number", defaultValue: 0 },
					url: { type: "string" ,  defaultValue:"about:blank" }
				}
			}
		};
	}

});
