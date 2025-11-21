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
 * @class レイアウト内のマスカット部品から取得した値を用いて HTTP 要求メッセージ (XML 文書) を作成するクラスです。
 *
 * @name maskat.event.XMLRequestMarshaller
 * @extends maskat.event.RequestMarshaller
 */
maskat.lang.Class.declare("maskat.event.XMLRequestMarshaller")
	.extend("maskat.event.RequestMarshaller", {

	/** @scope maskat.event.XMLRequestMarshaller.prototype */

	/**
	 * コンストラクタです。
	 */
	initialize: function(){
		this.base();
		this.binder = new maskat.xml.XMLObjectBinder();
		this.rootNode = null;
		this.ns = "";
		this.soap = false;
		this.configured = false;
		this.sources = [];
		this.logger = maskat.log.LogFactory.getLog("maskat.event");
	},

	/**
	 * バリデーションを行います
	 * @param layout レイアウト
	 * @return true 要求メッセージの作成を中断します
	 */
	validate: function(layout) {
		return !this.rootNode;
	},

	/**
	 * 要求メッセージの Content-Type を取得します
	 * @return 要求メッセージの Content-Type
	 */
	getContentType: function() {
		return "application/xml";
	},

	/**
	 * オブジェクトを XML 文書に変換し、文字列として返します。
	 * 
	 * @param object
	 *            オブジェクト
	 * @returns XML 文書形式の文字列
	 */
	write: function(values) {
		return this.binder.write(values);
	},

	/**
	 * 要求メッセージ作成の前処理を行います
	 */
	configure: function() {
		if (this.configured) {
			return;
		}
		this.configured = true;
		this.binder.strictCheck = true;

		if (this.soap) {
			// TODO: add soap envelope
		} else {
			this.binder.setRootElement(this.ns, this.rootNode);
		}

		if (this.ns) {
			this.binder.addPrefixMapping("", this.ns);
		}

		/* 応答メッセージのルート要素に対応するバインディングを生成 */
		var root = this.binder.addElementBinding(this.ns, this.rootNode);

		for (var i = 0, l = this.sources.length; i < l; i++) {
			var path = [];
			path[path.length] = this.rootNode;
			var source = this.sources[i];
			var wrapper;
			if (source.node) {
				/*
				 * マーシャル対象のデータをルート要素の子要素 (wrapper) の
				 * 内部に出力する
				 */
				path[path.length] =  source.node;
				root.addChildBinding(path.join("."), { property: i });
				wrapper = this.binder.addElementBinding(this.ns, path.join("."));
			}
			var object;
			if (source.childNode) {
				path[path.length] = source.childNode;
				/*
				 * 繰り返し要素が定義されている場合、マスカット部品または変数
				 * から配列を取得し、配列の各要素を XML 要素へバインドする
				 */
				if (source.node) {
					wrapper.addChildBinding(path.join("."), { repeat: true });
				} else {
					/*
					 * childNode 属性が指定された場合は node 属性は省略可能
					 * この場合、ルート要素の直下に繰り返し要素を出力する
					 */
					root.addChildBinding(path.join("."), { property: i, repeat: true });
				}
				object = this.binder.addElementBinding(this.ns, path.join("."));
			} else if (source.binds) {
				/*
				 * 繰り返し要素は未定義だが子要素へのバインドが定義されている
				 * 場合、マスカット部品または変数からオブジェクトを取得し、
				 * そのプロパティを子要素へバインドする
				 */
				object = wrapper;
			} else {
				/* 文字列からテキストノードへのバインドを定義 */
				wrapper.addChildBinding("#text", {});
			}

			if (object && source.binds) {
				/* 子要素へのバインドを定義 */
				for (var j = 0, m = source.binds.length; j < m; j++) {
					var bind = source.binds[j];
					path[path.length] =  bind.node;
					var property = this.binder.addElementBinding(this.ns, path.join("."));
					property.addChildBinding("#text", { property: bind.property });
					object.addChildBinding(path.join("."));
					path.pop();
				}
			}
		}
	},

	/**
	 * 要求メッセージのマーシャル処理を行います
	 * @param layout レイアウト
	 * @return 要求メッセージ
	 */
	marshal: function(layout) {
		if (this.validate(layout)) {
			return null;
		}
		this.configure();

		var values = [];
		for (var i = 0, len = this.sources.length; i < len; i++) {
			var source = this.sources[i];
			var widgetId = source.obj;

			var widget = layout.getWidget(widgetId);
			var value;

			if (source.idxRef) {
				var reference = layout.getWidget(source.idxRef);
				if (reference) {
					if (this.logger.getLevel() <= maskat.log.Log.TRACE) {
						this.logger.trace(maskat.util.Message.format("GET_WIDGET_VALUE", {
							widget: source.idxRef,
							method: source.teleType ? source.teleType : ""}));
					}
					value = reference.getValue(source.teleType);
				} else {
					if (this.logger.getLevel() <= maskat.log.Log.TRACE) {
						this.logger.trace(maskat.util.Message.format("GET_VARIABLE_VALUE", {
							variable: source.idxRef}));
					}

					value = layout.getVariable(source.idxRef);
				}
			} else {
				if (widget) {
					if (this.logger.getLevel() <= maskat.log.Log.TRACE) {
						this.logger.trace(maskat.util.Message.format("GET_WIDGET_VALUE", {
							widget: widgetId,
							method: source.teleType ? source.teleType : ""}));
					}
					value = widget.getValue(source.teleType);
	            } else {
					if (this.logger.getLevel() <= maskat.log.Log.TRACE) {
						this.logger.trace(maskat.util.Message.format("GET_VARIABLE_VALUE", {
							variable: widgetId}));
					}
	            	value = layout.getVariable(widgetId);
				}
			}
			if (typeof(source.fromkey) != "undefined") {
			    /* 選択されたセルを送信 */
				if (this.logger.getLevel() <= maskat.log.Log.TRACE) {
					this.logger.trace(maskat.util.Message.format("GET_WIDGET_VALUE", {
							widget: widgetId, method: "getSelectedIndex"}));
				}
				var index = widget.getValue("getSelectedIndex");
				values[i] = value[index][source.fromkey];

			} else if (typeof(source.idxRef) != "undefined") {
                if (typeof(source.childNode) == "undefined") {
				    /* 選択された単一行を送信 */
					if (this.logger.getLevel() <= maskat.log.Log.TRACE) {
						this.logger.trace(maskat.util.Message.format("GET_WIDGET_VALUE", {
								widget: widgetId, method: "getSelectedIndex"}));
					}
                    var index = widget.getValue("getSelectedIndex");
                    values[i] = value[index];

                } else {
				    /* 選択された複数行を送信 */
					if (this.logger.getLevel() <= maskat.log.Log.TRACE) {
						this.logger.trace(maskat.util.Message.format("GET_WIDGET_VALUE", {
								widget: widgetId, method: "getSelectedIndexes"}));
					}
					var indexes = widget.getValue("getSelectedIndexes");
					var rows = [];
					for (var j = 0, l = indexes.length; j < l; j++) {
						rows[rows.length] = value[indexes[j]];
					}
					values[i] = rows;
				}
			} else {
				/* マスカット部品の値をそのまま使用する */
				values[i] = value;
			}

			/* sendBlankElement 属性への対応 */
			switch (typeof(values[i])) {
			case "string":
				/* 空文字列の場合 */
				if (values[i] == "" && !source.sendBlankElement) {
					values[i] = undefined;
				}
				break;

			case "object":
				/* null または空の配列の場合 */
				if (values[i] == null ||
				    values[i] instanceof Array && values[i].length == 0) {
					values[i] = source.sendBlankElement ? null : undefined;
				}
				break;

			case "undefined":
				/* 未定義の場合 */
				values[i] = source.sendBlankElement ? null : undefined;
				break;
			}
			if (this.logger.getLevel() <= maskat.log.Log.TRACE) {
				this.logger.trace(maskat.util.Message.format("GET_VALUE", {
						value: maskat.lang.Object.encodeJSON(values[i])}));
			}
		}
		return this.write(values);
	}
});
