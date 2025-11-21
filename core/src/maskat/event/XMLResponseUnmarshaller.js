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
 * @class HTTP 応答メッセージ (XML 文書) から取得した値をレイアウト内のマスカット部品に設定するクラスです。
 *
 * @name maskat.event.XMLResponseUnmarshaller
 * @extends maskat.event.ResponseUnmarshaller
 */ 
maskat.lang.Class.declare("maskat.event.XMLResponseUnmarshaller")
	.extend("maskat.event.ResponseUnmarshaller", {

	/** @scope maskat.event.XMLResponseUnmarshaller.prototype */

	/**
	 * コンストラクタです。 
	 */
	initialize: function(){
		this.base();
		this.soap = false;
		this.ns = "";
		this.rootNode = null;
		this.configured = false;
		this.nodes = {};
		this.targets = [];
		this.logger = maskat.log.LogFactory.getLog("maskat.event");
	},

	/**
	 * 応答メッセージの Content-Type を取得します
	 * @return 応答メッセージの Content-Type
	 */
	getContentType: function() {
		return "application/xml";
	},

	/**
	 * 応答メッセージからエラー情報を取得します
	 * @param response 応答メッセージ
	 * @return エラーオブジェクト
	 */
	getError: function(response) {
		var errors;
		if (response && response.documentElement && response.documentElement.nodeName == "errors") {
			errors = this.convertErrorObject(response);
		}
		return errors;
	},

	/**
	 * ドキュメントからJSON型のエラーオブジェクトに変換します。
	 * 
	 * @param doc エラーノードを含むドキュメント
	 * @return JSON型のエラーオブジェクト
	 *
	 * 変換例）変換前
	 * <errors>
	 *   <error name="name1">message-1</error>
	 *   <error name="name2, unknown="node">message-2</error>
	 * </errors>
	 *
	 * 変換例）変換後
	 * [
	 *    {"name": "name1", "message": "message-1"},
	 *    {"name": "name2", "message": "message-2" unkown: "node"}
	 * ]
	 */
	convertErrorObject: function(doc) {
		var binder = new maskat.xml.XMLObjectBinder({
				"#document": {
					children: {
						errors: {}
					}
				},
				errors: {
					children:{
						error: {property: "errors", repeat: true }
					}
				},
				error: {
					attributes: {"*": {}},
					children: {
						"#text": {property: "message"}
					}
				}
		});
		var object = binder.read(doc);
		return  (object && object.errors) ? object.errors : "";
	},

	/**
	 * 応答メッセージをオブジェクトとして読み込みます
	 * 
	 * @param targets
	 *            ターゲットの配列
	 * @param object
	 *            受信したオブジェクト
	 * @returns オブジェクト
	 */
	read: function(targets, object) {
		var values = object ? this.binder.read(object) : null;
		var result = values;
		for (var i = 0, l = targets.length; i < l; i++) {
			var target = targets[i];
			if (target.type == "local") {
				continue;
			}
			var name = target.node || target.childNode;
			if (this.nodes[name] != -1) {
				var value = values[this.nodes[name]];
				if (value instanceof Array) {
					var arr = [], len = 0;
					for (var j = 0, m = value.length; j < m; j++) {
						var v = {}, f = false;
						var child = value[j];
						for (var k = 0, n = target.binds.length; k < n; k++) {
							var property = target.binds[k].property;
							if (child[property] != undefined) {
								v[property] = child[property];
								f = true;
							}
						}
						if (f) {
							arr[len++] = v;
						}
					}
					value = arr;
				} else if (target.binds) {
					var v = {};
					for (var k = 0, n = target.binds.length; k < n; k++) {
						var property = target.binds[k].property;
						if (value[property] != undefined) {
							v[property] = value[property];
						}
					}
					value = v;
				}
				result[i] = value;
			}
		}
		return result;
	},

	/**
	 * 応答メッセージ作成の前処理を行います
	 */
	configure: function() {
		if (this.configured) {
			return;
		}
		this.configured = true;
		this.binder = new maskat.xml.XMLObjectBinder();

		if (this.targets.length <= 0) {
			return;
		}
		var root;

		for (var i = 0, l = this.targets.length; i < l; i++) {
			var target = this.targets[i];
			var path = [];
			path[path.length] = this.rootNode;
			this.binder.strictCheck = true;

			if (target.type == "local") {
				continue;
			}
			// 同一ノードを複数のターゲットで取得するさいのデータ位置を保持する
			var name = target.node || target.childNode;
			this.nodes[name] = (this.nodes[name] == undefined) ? -1 : i;

			if (this.soap) {
				// TODO: add soap envelope
			} else {
				this.binder.setRootElement(this.ns, this.rootNode);
			}
			/* 応答メッセージのルート要素に対応するバインディングを生成 */
			if (!root) {
				root = this.binder.addElementBinding(this.ns, this.rootNode);
			}
			var wrapper;
			if (target.node) {
				/*
				 * アンマーシャル対象のデータはルート要素の子要素 (wrapper) の
				 * 内部に格納されている
				 */
				path[path.length] = target.node;
				wrapper = this.binder.addElementBinding(this.ns, path.join("."));
				root.addChildBinding(path.join("."));
				root.addChildBinding("*", { validate: false });
			} else {
				/* アンマーシャル対象のデータはルート要素の内部に格納されている */
				wrapper = root;
			}
			var object;
			if (target.childNode) {
				/*
				 * 繰り返し要素が定義されている場合、繰り返し単位となる個々の
				 * 要素をオブジェクトへバインドし、それらを要素とする配列を
				 * マスカット部品または変数にバインドする
				 */
				path[path.length] = target.childNode;
				object = this.binder.addElementBinding(this.ns, path.join("."));
				wrapper.addChildBinding(target.childNode, { property: i, repeat: true });
				if (target.binds) {
					wrapper.addChildBinding("*", { validate: false });
				} else {
					wrapper.addChildBinding(target.childNode, { repeat: true });
				}
			} else if (target.binds) {
				/*
				 * 繰り返し要素は未定義だが、プロパティへのバインドが定義されて
				 * いる場合、単一のオブジェクトへのバインドを定義
				 */
				root.addChildBinding(target.node, { property: i });
				object = wrapper;
			} else {
				/* テキスト要素から文字列へのバインドを定義 */
				wrapper.addChildBinding("#text", { property: i });
				object = null;
			}
			if (object) {
				if (target.binds) {
					/* オブジェクトのプロパティへのバインドを定義 */
					for (var j = 0, m = target.binds.length; j < m; j++) {
						var bind = target.binds[j];
						path[path.length] = bind.node;
						var property = this.binder.addElementBinding(this.ns, path.join("."));
						property.addChildBinding("#text", { property: bind.property });
						object.addChildBinding(bind.node);
						path.pop();
					}
					object.addChildBinding("*", { validate: false });
				} else {
					object.addChildBinding("#text", { property: i, repeat: true });
				}
			}
		}
	},

	/**
	 * 応答メッセージのアンマーシャル処理を行います
	 * @param object 応答メッセージ
	 * @param layout レイアウト
	 */
	unmarshal: function(object, layout) {
		this.configure();
		var values;
		for (var i = 0, len = this.targets.length; i < len; i++) {
			var target = this.targets[i];
			switch (target.type) {
			case "local":
				/* ローカルデータバインディングを実行 */
				var src = layout.getWidget(target.node);
				var value = src ? src.getValue() : layout.getVariable(target.node);
				var dst = layout.getWidget(target.widgetId);

				if (target.workType) {
					var arg1 = src ? src.unwrap() : value;
					var arg2 = dst ? dst.unwrap() : layout.getVariable(target.widgetId);

					if (this.logger.getLevel() <= maskat.log.Log.TRACE) {
						this.logger.trace(maskat.util.Message.format("BINDING_HANDLE", {
								functionName: target.workType.functionName,
								src: target.node, dst: target.widgetId}));
					}
					target.workType(arg1, arg2);
				} else {
					if (this.logger.getLevel() <= maskat.log.Log.TRACE) {
						this.logger.trace(maskat.util.Message.format("LOCAL_BINDING_START", {
								src: target.node, dst: target.widgetId}));
					}
					if (dst) {
						dst.setValue(value);
					} else {
						layout.setVariable(target.widgetId, value);
					}
					if (this.logger.getLevel() <= maskat.log.Log.TRACE) {
						this.logger.trace(maskat.util.Message.format("BINDING_VALUE", {
								value: maskat.lang.Object.encodeJSON(value)}));
					}
				}
				break;

			case "remote":
				if (!values) {
					values = this.read(this.targets, object);
				}
				/* 応答メッセージのバインディングを実行 */
				var value = values[i];
				if (value == undefined) {
					break;
				}
				var widget = layout.getWidget(target.widgetId);
				if (widget) {
					try {
						widget.setValue(value, target.teleType);
					} finally {
						if (this.logger.getLevel() <= maskat.log.Log.TRACE) {
							this.logger.trace(maskat.util.Message.format("BINDING_WIDGET", {
								widget: target.widgetId,
								method: target.teleType ? target.teleType : "",
								value: maskat.lang.Object.encodeJSON(value)}));
						}
					}
				} else {
					layout.setVariable(target.widgetId, value);
					if (this.logger.getLevel() <= maskat.log.Log.TRACE) {
						this.logger.trace(maskat.util.Message.format("BINDING_VARIABLE", {
							variable: target.widgetId,
							value: maskat.lang.Object.encodeJSON(value)}));
					}
				}
				break;
			}
		}
	}
});
