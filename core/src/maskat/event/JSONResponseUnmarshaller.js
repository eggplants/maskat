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
 * @class HTTP 応答メッセージ (JSON 文書) から取得した値をレイアウト内のマスカット部品に設定するクラスです。
 *
 * @name maskat.event.JSONResponseUnmarshaller
 * @extends maskat.event.ResponseUnmarshaller
 */ 
maskat.lang.Class.declare("maskat.event.JSONResponseUnmarshaller")
	.extend("maskat.event.ResponseUnmarshaller", {

	/** @scope maskat.event.JSONResponseUnmarshaller.prototype */

	/**
	 * コンストラクタです。
	 */
	initialize: function(){
		this.logger = maskat.log.LogFactory.getLog("maskat.event");
	},

	/**
	 * 応答メッセージの Content-Type を取得します
	 * @return 応答メッセージの Content-Type
	 */
	getContentType: function() {
		return "application/json";
	},

	/**
	 * 応答メッセージを解析可能な形式へ変換します
	 * @param context 通信終了後のコンテキスト
	 * @return 変換した応答メッセージ
	 */
	normalize: function(context) {
		var response;
		if (context.responseMessage) {
			response = maskat.lang.Object.parseJSON(context.responseMessage);
		}
		return response;
	},

	/**
	 * 応答メッセージからエラー情報を取得します
	 * @param response 応答メッセージ
	 * @return エラーオブジェクト
	 */
	getError: function(response) {
		return response ? response.errors : undefined;
	},

	/**
	 * 応答メッセージのアンマーシャル処理を行います
	 * @param object JSONオブジェクト
	 * @param layout レイアウト
	 */
	unmarshal: function(object, layout) {
		if (typeof(object) == "string") {
			object = maskat.lang.Object.parseJSON(object);
		}
		var app = maskat.app;
		var logger = this.logger, logLevel = this.logger.getLevel();
		var currentLayout = layout;

		var _setWidgetValue = function(name, method, object) {
			var names = name.split("#");
			var widget = names.length > 1 ?
					app.getLayout(names[0]).getWidget(names[1]) :
					currentLayout.getWidget(names[0]);
			if (logLevel <= maskat.log.Log.TRACE) {
				logger.trace(maskat.util.Message.format("BINDING_WIDGET", {
						widget: name,
						method: method,
						value: maskat.lang.Object.encodeJSON(object)}));
			}
			widget.setValue(object, method ? method : undefined);
		}

		var _setVariableValue = function(name, property, type, object) {
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
			variableName += (property !== undefined ? ("." + property) : "");
			var p = variableName.lastIndexOf(".");
			var propertyName;
			var variable;
			if (p != -1) {
				propertyName = variableName.substring(p + 1);
				variableName = variableName.substring(0, p);
				variable = maskat.lang.Object.find(variableName, scope);
				if (!variable) {
					variable = maskat.lang.Object.create(variableName, scope);
				}
			} else {
				propertyName = variableName;
				variable = scope;
			}
			if (logLevel <= maskat.log.Log.TRACE) {
				logger.trace(maskat.util.Message.format("BINDING_VARIABLE", {
						variable: name + (property !== undefined ? ("." + property) : ""),
						value: maskat.lang.Object.encodeJSON(object)}));
			}
			variable[propertyName] = object;
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
		var _unmarshal = function(object, schema, context) {
			if (schema.widget) {
				var widget = schema.widget;
				var name = widget.name;
				var method = widget.method;
				var value = schema.name === undefined ? object : object[schema.name];
				if (schema.type) {
					value = converter.convert(schema.type, value);
				}
				if (context) {
					if (widget.property) {
						context[name][widget.property] = value;
					} else {
						context[name] = value;
					}
				} else {
					if (widget.property) {
						var v = {};
						v[widget.property] = value;
						value = v;
					}
					if (value !== undefined) {
						_setWidgetValue(name, method, value);
					} else if (widget.defaultValue !== undefined) {
						_setWidgetValue(name, method, widget.defaultValue);
					}
				}

			} else if (schema.variable) {
				var variable = schema.variable;
				var name = variable.name;
				var scope = variable.scope;
				var property = variable.property;

				var value = schema.name === undefined ? object : object[schema.name];
				if (schema.type) {
					value = converter.convert(schema.type, value);
				}
				if (context) {
					if (property !== undefined) {
						context[name][property] = value;
					} else {
						context[name] = value;
					}
				} else if (value !== undefined) {
					_setVariableValue(name, property, scope, value);
				} else if (variable.defaultValue !== undefined) {
					_setVariableValue(name, property, scope, variable.defaultValue);
				}

			} else if (schema.object) {
				var obj = schema.name === undefined ? object : object[schema.name];
				var properties = schema.object.properties;
				if (properties) {
					for (var i = 0, l = properties.length; i < l; i++) {
						_unmarshal(obj, properties[i], context);
					}
				}
			} else if (schema.array) {
				var obj = object[schema.name];
				obj = obj instanceof Array ? obj : [obj];

				var widget = schema.array.widget;
				var variable = schema.array.variable;

				if (!context && (
					(widget && widget.property === undefined) ||
					(variable && variable.property === undefined))) {
					_unmarshal(obj, schema.array, context);
					return;
				}
				if (schema.array.object || widget || variable) {
					var widgets = schema.array._widgets;
					var variables = schema.array._variables;
					var values = {};
					for (var name in widgets) {
						values[name] = [];
					}
					for (var name in variables) {
						values[name] = [];
					}
					for (var i = 0, l = obj.length; i < l; i++) {
						var value = {};
						for (var name in widgets) {
							value[name] = {};
						}
						for (var name in variables) {
							value[name] = {};
						}
						_unmarshal(obj[i], schema.array, value);
						for (var name in widgets) {
							values[name][i] = value[name];
						}
						for (var name in variables) {
							values[name][i] = value[name];
						}
					}
					for (var name in widgets) {
						var value = values[name];
						if (value && value.length > 0) {
							_setWidgetValue(name, widgets[name].method, value);
						}
					}
					for (var name in variables) {
						var value = values[name];
						if (value && value.length > 0) {
							var variable = variables[name];
							_setVariableValue(name, undefined, variable.scope, value);
						}
					}
				}
			}
		}
		this.name = "root";
		_unmarshal({"root": object}, this);
	}

});
