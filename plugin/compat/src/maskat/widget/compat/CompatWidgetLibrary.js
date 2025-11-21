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
maskat.lang.Class.declare("maskat.widget.compat.CompatWidgetLibrary")
	.extend("maskat.layout.WidgetLibrary", {

	getBindingConfiguration: function() {
		var config = {
			confirmDialog: {
				type: maskat.widget.compat.ConfirmDialog,
				attributes: {
					name: { type: "string", required: true },
					title: { type: "string" },
					message: { type: "string" },
					btnOKTxt: { type: "string" },
					btnCancelTxt: { type: "string" },
					btnOnFocus: { type: "number", defaultValue: 2},
					okFunc: { type: "function", property: "onOK" },
					cancelFunc: { type: "function", property: "onCancel" }
				}
			},

			endDialog: {
				type: maskat.widget.compat.EndDialog,
				attributes: {
					name: { type: "string", required: true },
					message: { type: "string" , required: true }
				}
			}
		};
		return config;
	}


});
 