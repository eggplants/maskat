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
/**
 * @class レイアウトのインスタンスを生成するためのクラスです。
 *
 * @name maskat.layout.LayoutFactory
 * @extends maskat.layout.WidgetLibrary
 */
maskat.lang.Class.declare("maskat.layout.LayoutFactory")
	.extend("maskat.layout.WidgetLibrary", {

	/** @scope maskat.layout.LayoutFactory.prototype */

	config: {
		"#document": {
			children: {
				layoutDef: {}
			}
		},

		layoutDef: {
			type: maskat.layout.Layout,
			children: {
				layout: {},
				javaScriptGlobal: { property: "children", repeat: true }
			}
		},
		
		layout: {
			attributes: {
				name: { type: "string", required: true, property: "layoutId" },
				refParentHTML: { type: "string" }
			},
			children: {
				"*": { property: "children", repeat: true }
			}
		},
		
		evaluator: {
			type: maskat.layout.ExpressionEvaluator,
			attributes: {
				name: { type: "string", required: true }
			}
		},
		
		desc: {
			children: {
				"#text": {}
			}
		}
	},

	getBindingConfiguration: function() {
		return this.config;
	}

});
