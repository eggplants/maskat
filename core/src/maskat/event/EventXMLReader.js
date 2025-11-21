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
 * @class
 * イベント定義 XML を解析してイベントディスパッチャを構成します。
 *
 * @name maskat.event.EventXMLReader
 * @extends maskat.xml.XMLObjectBinder
 */ 
maskat.lang.Class.declare("maskat.event.EventXMLReader")
	.extend("maskat.xml.XMLObjectBinder", {

	_static: {
	
		/** @scope maskat.event.EventXMLReader */
	
		/**
		 * このクラスの唯一のインスタンスを返します。(Singleton パターン)
		 *
		 * @returns このクラスの唯一のインスタンス
		 */
		getInstance: function() {
			var self = arguments.callee;
			if (!self.instance) {
				self.instance = new this();
			}
			return self.instance;
		}
	},
	
	/** @scope maskat.event.EventXMLReader.prototype */
	
	/**
	 * コンストラクタです。 
	 */
	initialize: function(){
		this.base({
			"#document": {
				children: {
					eventDef: {}
				}
			},

			eventDef: {
				type: maskat.event.EventDispatcher,
				attributes: {},
				children: {
					remoteUrl: {},
					header: { property: "headers", repeat: true },
					component: { property: "handlers", repeat: true, key: "id", value: "events" },
					event: { property: "events", repeat: true, key: "id" },
					eventRef: {  property: "eventRefs", repeat: true, key: "id" },
					desc: {}
				}
			},
	
			remoteUrl: {
				attributes: {
					url: { type: "string", required: true }
				}
			},
	
			header: {
				attributes: {
					name: { type: "string", required: true },
					value: { type: "string", required: true }
				}
			},
	
			component: {
				attributes: {
					id: { type: "string", required: true }
				},
				children: {
					event: { property: "events", repeat: true, key: "id" },
					desc: {}
				}
			},
	
			event: {
				attributes: {
					id: { type: "string", required: true },
					remoteUrl: { type: "string", property: "url" },
					type: {
						type: "enum",
						values: [ "local", "remote" ],
						defaultValue: "remote"
					},
					async: { type: "boolean", defaultValue: true },
					ref: { type: "string" },
					marshal: { type: "function" },
					unmarshal: { type: "function" },
					start: { type: "function", property: "onStart" },
					before: { type: "function", property: "onBeforeRequest" },
					after: { type: "function", property: "onAfterResponse" },
					finish: { type: "function", property: "onFinish" },
					timeout: { type: "number" },
					onTimeoutError: { type: "function", property: "onRequestTimeout" },
					confirmDialog: { type: "string" },
					endDialog: { type: "string" }
				},
				children: {
					header: { property: "headers", repeat: true },
					param: { property: "marshaller" },
					result: { property: "unmarshaller" },
					request: { property: "marshaller" },
					response: { property: "unmarshaller" },
					desc: {}
				}
			},
	
			eventRef: {
				attributes: {
					id: { type: "string", required: true }
				},
				children: {
					header: { property: "headers", repeat: true },
					param: { property: "marshaller" },
					result: { property: "unmarshaller" },
					desc: {}
				}
			},
	
			param: {
				type: maskat.event.XMLRequestMarshaller,
				attributes: {
					rootNode: { type: "string" },
					ns: { type: "string" },
					soap: { type: "boolean", defaultValue: false },
					type: {
						type: "enum", values: [ "xml", "json" ], defaultValue: "xml"
					}
				},
				children: {
					source: { property: "sources", repeat: true },
					desc: {}
				}
			},
	
			source: {
				attributes: {
					obj: { type: "string", required: true },
					node: { type: "string" },
					childNode: { type: "string" },
					idxRef: { type: "string" },
					fromkey: { type: "string" },
					type: { type: "string" },
					regexp: { type: "string" },
					min: { type: "number" },
					max: { type: "number" },
					desc: { type: "string" },
					sendBlankElement: { type: "boolean", defaultValue: false },
					teleType: { type: "string" }
				},
				children: {
					bind: { property: "binds", repeat: true },
					desc: {}
				}
			},
	
			result: {
				type: maskat.event.XMLResponseUnmarshaller,
				attributes: {
					rootNode: { type: "string" },
					ns: { type: "string" },
					onErrorTele: { type: "function" },
					soap: { type: "boolean", defaultValue: false },
					type: {
						type: "enum", values: [ "xml", "json" ], defaultValue: "xml"
					}
				},
				children: {
					target: { property: "targets", repeat: true },
					desc: {}
				}
			},
	
			target: {
				attributes: {
					out: { type: "string", property: "widgetId", required: true },
					"in": { type: "string", property: "node" },
					inkey: { type: "string", property: "childNode" },
					type: {
						type: "enum",
						values: [ "local", "remote" ]
					},
					teleType: { type: "string" },
					workType: { type: "function" }
				},
				children: {
					bind: { property: "binds", repeat: true },
					desc: {}
				}
			},
	
			bind: {
				attributes: {
					node: { type: "string", required: true },
					fromkey: { type: "string", property: "property" },
					tokey: { type: "string", property: "property" }
				}
			},
	
			desc: {
				children: {
					"#text": {}
				}
			},

			request: {
				type: maskat.event.JSONRequestMarshaller,
				attributes: {
					contentType: { type: "string", defaultValue: "application/json" },
					method: { type: "string", defaultValue: "post" }
				},
				children: {
					object: { property: "object" },
					array: { property: "array" }
				}
			},

			response: {
				type: maskat.event.JSONResponseUnmarshaller,
				attributes: {
					contentType: { type: "string", defaultValue: "application/json" },
					onerror: { type: "function", property: "onErrorTele" }
				},
				children: {
					object: { property: "object" },
					array: { property: "array" }
				}
			},

			object: {
				children: {
					property: { property: "properties", repeat: true }
				}
			},

			property: {
				attributes: {
					name: { type: "string", required: true },
					type: {
						type: "enum", values: [ "string", "number", "boolean", "object", "Array" ]
					}
				},
				children: {
					object: { property: "object" },
					array:  { property: "array" },
					widget: { property: "widget" },
					variable: { property: "variable" },
					literal: { property: "literal" }
				}
			},

			array: {
				children: {
					object: { property: "object" },
					widget: { property: "widget" },
					variable: { property: "variable" }
				}
			},

			widget: {
				attributes: {
					name: { type: "string", required: true },
					method: { type: "string", defaultValue: "" },
					property: { type: "string" },
					defaultValue: { type: "json" }
				}
			},

			variable: {
				attributes: {
					name: { type: "string", required: true },
					property: { type: "string" },
					defaultValue: { type: "json" },
					scope: {
						type: "enum", values: [ "global", "layout" ],  defaultValue: "global"
					}
				}
			},

			literal: {
				attributes: {
					value: { type: "string" }
				}
			}
		});
	},

	createObject: function(element){
		switch (element.nodeName) {
		case "event":
			/* イベント種別に応じてハンドラクラスを生成する */
			if (element.getAttribute("type") == "local") {
				return new maskat.event.LocalEventHandler();
			} else {
				return new maskat.event.RemoteEventHandler();
			}

		case "target":
			/*
			 * type 属性のデフォルト値はローカルイベントとリモートイベント
			 * の場合で異なる
			 */
			var event = element.parentNode.parentNode;
			var binder = {};
			binder.type = event.getAttribute("type") || "remote";
			return binder;

		case "bind":
			var parentName = element.parentNode.nodeName;
			/* 親要素が source の場合、fromkey 属性が必須 */
			if (parentName == "source" && !element.getAttribute("fromkey")) {
				throw new maskat.lang.Error("MISSING_ATTRIBUTE",
					{ attributeName: "fromkey" });
			}
			/* 親要素が target の場合、tokey 属性が必須 */
			if (parentName == "target" && !element.getAttribute("tokey")) {
				throw new maskat.lang.Error("MISSING_ATTRIBUTE",
					{ attributeName: "tokey" });
			}
			/* falls through */
		default:
			return {};
		}
	}

});
