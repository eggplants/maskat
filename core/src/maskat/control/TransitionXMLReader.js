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
 * @class 画面遷移定義 XML からコントローラを読み込んで実行するクラスです。
 *
 * @name maskat.control.TransitionXMLReader
 * @extends maskat.xml.XMLObjectBinder
 */ 
maskat.lang.Class.declare("maskat.control.TransitionXMLReader")
	.extend("maskat.xml.XMLObjectBinder", {

	_static: {
	
		/** @scope maskat.control.TransitionXMLReader */
		
		getInstance: function() {
			var self = arguments.callee;
			if (!self.instance) {
				self.instance = new this();
			}
			return self.instance;
		}
	},
	
	/** @scope maskat.control.TransitionXMLReader.prototype  */
	
	/**
	 * コンストラクタです。
	 */
	initialize: function(){
		this.base({
			"#document": {
				children: {
					transitionDef: {}
				}
			},

			transitionDef: {
				type: maskat.control.ApplicationController,
				children: {
					init: { property: "init" },
					transition: {
						property: "transitions",
						method: "addCommand",
						repeat: true
					}
				}
			},

			init: {
				type: maskat.control.CommandSet,
				children: {
					loadJS: { property: "priorCommands", repeat: true },
					loadCSS: { property: "priorCommands", repeat: true },
					loadLayout: { property: "commands", repeat: true },
					loadKeyBinding: { property: "commands", repeat: true }
				}
			},

			transition: {
				type: maskat.control.CommandSet,
				attributes: {
					layout: { type: "string", defaultValue: "", property: "layoutId" },
					component: { type: "string", required: true, property: "widgetId" },
					event: { type: "string", required: true, property: "eventType" },
					branch: { type: "string" }
				},
				children: {
					loadJS: { property: "priorCommands", repeat: true },
					loadCSS: { property: "priorCommands", repeat: true },
					loadLayout: { property: "commands", repeat: true },
					removeLayout: { property: "commands", repeat: true },
					showLayout: { property: "commands", repeat: true },
					hideLayout: { property: "commands", repeat: true },
					loadKeyBinding: { property: "commands", repeat: true }
				}
			},
			
			loadLayout: {
				type: maskat.control.LoadLayoutCommand,
				attributes: {
					xmlFile: { type: "string", required: true, property: "layoutURL" },
					eventXmlFile: { type: "string", property: "eventURL" },
					target: { type: "string", required: true, property: "elementId" },
					show: { type: "boolean", defaultValue: false, property: "visible" }
				}
			},

			loadJS: {
				type: maskat.control.LoadJavaScriptCommand,
				attributes: {
					fileName: { type: "string", required: true, property: "url"  }
				}
			},

			loadCSS: {
				type: maskat.control.LoadStyleSheetCommand,
				attributes: {
					fileName: { type: "string", required: true, property: "url"  }
				}
			},

			showLayout: {
				type: maskat.control.ShowLayoutCommand,
				attributes: {
					layout: { type: "string", required: true, property: "layoutId"  }
				}
			},

			hideLayout: {
				type: maskat.control.HideLayoutCommand,
				attributes: {
					layout: { type: "string", required: true, property: "layoutId"  }
				}
			},

			removeLayout: {
				type: maskat.control.UnloadLayoutCommand,
				attributes: {
					layout: { type: "string", required: true, property: "layoutId" }
				}
			},

			loadKeyBinding: {
				type: maskat.control.LoadKeyBindingCommand,
				attributes: {
					url: { type: "string", required: true }
				}
			}
		});
	}

});
