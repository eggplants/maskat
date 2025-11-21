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
 * @class レイアウト内のマスカット部品から取得した値を用いて HTTP 要求メッセージ (JSON 文書) を作成するクラスです。
 *
 * @name maskat.event.JSONRequestMarshaller
 * @extends maskat.event.RequestMarshaller
 */ 
maskat.lang.Class.declare("maskat.event.JSONRequestMarshaller")
	.extend("maskat.event.RequestMarshaller", {

	/** @scope maskat.event.JSONRequestMarshaller.prototype */

	/**
	 * コンストラクタです。
	 */
	initialize: function(){
		this.logger = maskat.log.LogFactory.getLog("maskat.event");
	},

	/**
	 * 要求メッセージの Content-Type を取得します
	 * @return 要求メッセージの Content-Type
	 */
	getContentType: function() {
		return "application/json";
	},

	/**
	 * 要求メッセージのマーシャル処理を行います
	 * @param layout レイアウト
	 * @return 要求メッセージ
	 */
	marshal: function(layout) {
		/*
		 * 部品からデータを取得します。一度取得したデータはキャッシュされます。
		 * @param name [レイアウト名#]部品名（レイアウトを省略した場合にはカレントレイアウト）
		 * @param method メソッド名（省略した場合にはデフォルトゲッタ）
		 * @return 部品のデータ
		 */
		var app = maskat.app;
		var logger = this.logger, logLevel = this.logger.getLevel();
		var cache = {}, currentLayout = layout;

		var _getWidgetValue = function(name, method) {
			var v = cache[name];
			if (v && v[method]) {
				return v[method];
			}
			if (!v) {
				cache[name] = {};
			}
			var names = name.split("#");
			var widget = names.length > 1 ?
					app.getLayout(names[0]).getWidget(names[1]) :
					currentLayout.getWidget(names[0]);

			var values = cache[name][method] = widget.getValue(method ? method : undefined);

			if (logLevel <= maskat.log.Log.TRACE) {
				logger.trace(maskat.util.Message.format("GET_WIDGET_VALUE", {
						widget: name, method: method}));
			}
			return values;
		}

		var _valueLogging = function(value) {
			logger.trace(maskat.util.Message.format("GET_VALUE", {
					value: maskat.lang.Object.encodeJSON(value)}));
		}

		/*
		 * 変数からデータを取得します
		 * @param name 変数名（[レイアウト名#]変数名
		 * @param type データの格納スコープを指定します layout, global
		 * @return 変数の値
		 */
		var _getVariableValue = function(name, type) {
			var names = name.split("#");
			var scope, variableName;

			if (type == "layout") {
				scope = currentLayout;
				variableName = names[0];
			} else if (names.length > 1) {
				scope = app.getLayout(names[0]);
				variableName = names[1];
			} else {
				scope = window;
				variableName = names[0];
			} 
			if (logLevel <= maskat.log.Log.TRACE) {
				logger.trace(maskat.util.Message.format("GET_VARIABLE_VALUE", {
						variable: name}));
			}
			return maskat.lang.Object.find(variableName, scope);
		}

		/*
		 * 配列タグで利用する部品、変数を抽出し処理を行いやすくなるように
		 * オブジェクトの再構成を行います
		 * @param schema normalize 処理を行いたい JSON形式のデータバインド構成
		 */
		var stack = [];
		var _normalize = function(schema) {
			if (schema.array) {
				stack[stack.length] = schema.array;
				_normalize(schema.array);
				stack.pop();
				
			} else if (schema.object) {
				var properties = schema.object.properties;
				if (properties) {
					for (var i = 0, l = properties.length; i < l; i++) {
						_normalize(properties[i]);
					}
				}
			// 任意の array スコープ内に存在する widget を array オブジェクトに登録します
			} else if (schema.widget) {
				var pos = stack.length - 1;
				if (pos >= 0) {
					var array = stack[pos];
					if (!array._widgets) {
						array._widgets = {};
					}
					array._widgets[schema.widget.name] = schema.widget;
				}
			// 任意の array スコープ内に存在する variable を array オブジェクトに登録します
			} else if (schema.variable) {
				var pos = stack.length - 1;
				if (pos >= 0) {
					var array = stack[pos];
					if (!array._variables) {
						array._variables = {};
					}
					array._variables[schema.variable.name] = schema.variable;
				}
			}
		}
		_normalize(this);
		var converter = maskat.util.Converter;
		var finder = maskat.lang.Object;
		var _marshal = function(object, schema, context) {
			if (schema.widget) {
				var widget = schema.widget;
				var name = widget.name;
				var method = widget.method;
				var value = context ? context[name + "@" + method] : _getWidgetValue(name, method);
				value = widget.property ? value[widget.property] : value;
				if (schema.type) {
					value = converter.convert(schema.type, value);
				}
				if (logLevel <= maskat.log.Log.TRACE) {
					_valueLogging(value);
				}
				if (value !== undefined || context) {
					object[schema.name] = value;
				} else if (widget.defaultValue !== undefined) {
					object[schema.name] = widget.defaultValue;
				}

			} else if (schema.variable) {
				var variable = schema.variable;
				var value = context ? context[variable.scope + "$" + variable.name] :
						_getVariableValue(variable.name, variable.scope);
				value = variable.property ? finder.find(variable.property, value) : value;

				if (schema.type) {
					value = converter.convert(schema.type, value);
				}
				if (logLevel <= maskat.log.Log.TRACE) {
					_valueLogging(value);
				}
				if (value !== undefined || context) {
					object[schema.name] = value;
				} else if (variable.defaultValue !== undefined) {
					object[schema.name] = variable.defaultValue;
				}

			} else if (schema.literal) {
				var value = schema.literal.value;
				if (schema.type) {
					value = converter.convert(schema.type, value);
				}
				if (logLevel <= maskat.log.Log.TRACE) {
					_valueLogging(value);
				}
				object[schema.name] = value;

			} else if (schema.object) {
				var name = schema.name ? schema.name : object.length;
				var obj = object[name] = {};
				var properties = schema.object.properties;
				if (properties) {
					for (var i = 0, l = properties.length; i < l; i++) {
						_marshal(obj, properties[i], context);
					}
				}

			} else if (schema.array) {
				var widget = schema.array.widget;
				var variable = schema.array.variable;

				if (!context && (
					(widget && widget.property === undefined) ||
					(variable && variable.property === undefined))) {
					schema.array.name = 0;
					var value = [];
					_marshal(value, schema.array, context);
					object[schema.name] = value[0] instanceof Array ? value[0] : value;
					return;
				}
				var obj = object[schema.name] = [];

				if (schema.array.object || widget || variable) {
					var widgets = schema.array._widgets;
					var variables = schema.array._variables;
					var values = {}, count = 0;
					if (widgets) {
						for (var id in widgets) {
							var res = widgets[id];
							var key = res.name + "@" + res.method;
							var value = values[key] = _getWidgetValue(res.name, res.method);
							count = Math.max(count, value instanceof Array ? value.length : 1);
						}
					}
					if (variables) {
						for (var name in variables) {
							var res = variables[name];
							var key = res.scope + "$" + res.name;
							var value = values[key] = _getVariableValue(res.name, res.scope);
							count = Math.max(count, value instanceof Array ? value.length : 1);
						}
					}
					for (var i = 0; i < count; i++) {
						var childContext = {};
						for (var name in values) {
							var value = values[name];
							childContext[name] = value instanceof Array ? value[i] : value;
						}
						if (widget || variable) {
							schema.array.name = i;
						}
						_marshal(obj, schema.array, childContext);
					}
				}
			}
		}
		var object = {};
		this.name = "root";
		_marshal(object, this);
		return maskat.lang.Object.encodeJSON(object.root);
	}
});

