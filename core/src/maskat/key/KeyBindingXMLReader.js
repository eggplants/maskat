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
 * キーバインド定義 XML を解析してキーイベントハンドラを構成します。
 *
 * @name maskat.key.KeyBindingXMLReader
 * @extends maskat.xml.XMLObjectBinder
 */ 
maskat.lang.Class.declare("maskat.key.KeyBindingXMLReader")
	.extend("maskat.xml.XMLObjectBinder", {

	_static: {
		/** @scope maskat.key.KeyBindingXMLReader */
	
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
	
	/** @scope maskat.key.KeyBindingXMLReader.prototype */
	
	/**
	 * コンストラクタです。 
	 */
	initialize: function(){
		this.base({
			"#document": {
				children: {
					keybinding: {}
				}
			},
		
			/* ルート要素 */
			keybinding: {
				attributes: {
					layout: { type: "string", required: true }
				},
				children: {
					"default": { property: "default" },
					component: { property: "components", repeat: true, key: "id" }
				}
			},
			
			/* レイアウト全体で有効なキーバインドの設定 */
			"default": {
				children: {
					bind: { property: "binds", repeat: true }
				}
			},
		
			/* 特定の部品にフォーカスがある場合ののキーバインドの設定 */
			"component": {
				attributes: {
					id: { type: "string", required: true }
				},
				children: {
					bind: { property: "binds", repeat: true }
				}
			},
		
			/* キー操作の組み合わせとタイミングの設定 */
			bind: {
				type: maskat.key.KeyBind,
				attributes: {
					key: { type: "string", required: true },
					type: { type: "enum",
							values: [ "keydown", "keypress", "keyup"],
							defaultValue: "keydown" }
				},
				children: {
					"*": { property: "commands", repeat: true }
				}
			},

			/* キーイベントに対応して実行されるコマンドの指定 */
			"set-focus": {
				type: maskat.control.SetFocusCommand,
				attributes:{
					target: { type: "string", required: true }
				}
			},

			"move-focus": {
				type: maskat.control.MoveFocusCommand,
				attributes:{
					type: {
						type: "enum",
						values: [ "next", "previous", "first", "last" ],
						defaultValue: "next"
					}
				}
			},
			
			"set-visible": {
				type: maskat.control.SetVisibleCommand,
				attributes:{
					target: { type: "string", required: true },
					visible: { type: "boolean", required: true }
				}
			},

			"show": {
				type: maskat.control.SetVisibleCommand,
				attributes:{
					target: { type: "string", required: true },
					visible: { type: "boolean", defaultValue: true }
				}
			},

			"hide": {
				type: maskat.control.SetVisibleCommand,
				attributes:{
					target: { type: "string", required: true },
					visible: { type: "boolean", defaultValue: false }
				}
			},

			"enable": {
				type: maskat.control.SetEnabledCommand,
				attributes:{
					target: { type: "string", required: true },
					enabled: { type: "boolean", defaultValue: true }
				}
			},

			"disable": {
				type: maskat.control.SetEnabledCommand,
				attributes:{
					target: { type: "string", required: true },
					enabled: { type: "boolean", defaultValue: false }
				}
			},

			"function": {
				type: maskat.control.CallFunctionCommand,
				attributes:{
					name: { type: "function", required: true, property: "func" }
				}
			},

			"maskat-event": {
				type: maskat.control.MaskatEventCommand,
				attributes:{
					type: { type: "string", required: true },
					target: { type: "string", required: true }
				}
			}
		});
	}
});
