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
 * XML 要素の親子関係とオブジェクト間の参照関係をバインドします。
 *
 * @name maskat.xml.ChildNodeBinding
 */ 
maskat.lang.Class.declare("maskat.xml.ChildNodeBinding", {

	/** @scope maskat.xml.ChildNodeBinding.prototype */

	/**
	 * 子要素のバインディング設定を定義します。
	 * 
	 * <p>
	 * この XML 要素に対応するオブジェクト (親オブジェクト) は指定された
	 * プロパティを用いて子要素に対応するオブジェクト (子オブジェクト) を
	 * 参照します。
	 * </p>
	 * 
	 * @param name
	 *            XML 要素のローカル名
	 * @param config
	 *            バインディング設定
	 * <pre>
	 * {
	 *     property:
	 *         親オブジェクトから子オブジェクトを参照するプロパティ名
	 *         property を省略した場合、親要素と子要素は同じオブジェクト
	 *         にマッピングされます。
	 * 
	 *     required:
	 *         子要素の存在が必須の場合 true、省略可能の場合は false
	 * 
	 *     repeat:
	 *         子要素が繰り返し出現可能の場合は true
	 *         repeat が指定された場合、親オブジェクトのプロパティは
	 *         子オブジェクトの配列にマッピングされます。
	 * 
	 *     key:
	 *         子要素が繰り返し出現する場合に、子オブジェクトを一意に識別
	 *         するためのインデックスとして使用するプロパティ名
	 *         repeat と組み合わせて指定します。key が指定された場合には
	 *         親オブジェクトのプロパティはハッシュにマッピングされます。
	 * 
	 *     value:
	 *         プロパティの値となる子オブジェクトのプロパティ名
	 *         value が指定されている場合、親オブジェクトのプロパティは
	 *         子オブジェクトのプロパティへの参照となります。
	 * }
	 * </pre>
	 */
	initialize: function(uri, name, config) {
		this.uri = uri;
		this.name = name;

		config = config || {};
		this.property = config.property;
		this.method = config.method;
		this.validate = config.validate !== false;
		this.required = config.required || false;
		this.repeat = config.repeat || false;
		this.key = config.key;
		this.value = config.value;
	},

	/**
	 * 指定された子ノードからオブジェクトを読み込み、それをコンテキスト上の
	 * オブジェクトのプロパティに格納します。
	 * 
	 * @param context
	 *            XML 読み込みに使用するコンテキスト
	 * @param element
	 *            子ノード
	 */
	read: function(context, element) {
		try {
			var binding = context.getElementBinding(element);
			if (!binding) {
				if (this.validate) {
					throw new maskat.lang.Error("UNKNOWN_ELEMENT", {
						elementName: element.nodeName });
				}
				return;
			}
		} catch (e) {
			if (this.validate) {
				throw e;
			} else {
				return;
			}
		}

		binding.read(context, element);
		var value = context.popObject();

		if (this.method) {
			context.callMethod(this.method, value);
		} else if (typeof(this.property) == "undefined") {
			context.addProperties(value);
		} else if (this.repeat) {
			if (this.key) {
				/* プロパティがハッシュ型の場合 */
				var key = value[this.key];
				if (this.value) {
					context.putProperty(this.property, key, value[this.value]);
 				} else {
 					context.putProperty(this.property, key, value);
 				}
			} else {
				/* プロパティが配列型の場合 */
				if (this.value) {
					context.addProperty(this.property, value[this.value]);
				} else {
					context.addProperty(this.property, value);
				}
			}
		} else {
			/* プロパティが単純型の場合 */
			context.setProperty(this.property, value);
		}
	},

	/**
	 * コンテキスト上のオブジェクトからプロパティを取得し、それを XML 子要素
	 * として書き出します。
	 * 
	 * @param context
	 *            XML 書き出しに使用するコンテキスト
	 */
	write: function(context) {
		var object;
		if (typeof(this.property) == "undefined") {
			object = context.getObject();
		} else {
			object = context.getProperty(this.property);
		}
		if (typeof(object) == "undefined") {
			return;
		}

		var binding = context.getElementBinding(this.uri, this.name); 
		if (!binding) {
			throw new maskat.lang.Error("UNKNOWN_ELEMENT", {
					elementName: this.name });
		}
		if (this.repeat) {
			if (object instanceof Array) {
				/* プロパティが配列型の場合 */
				for (var i = 0, len = object.length; i < len; i++) {
					if (this.value) {
						var wrapper = {};
						wrapper[this.value] = object[i];
						context.pushObject(wrapper);
					} else {
						context.pushObject(object[i]);
					}
					binding.write(context);
				}
			} else if (this.key) {
				/* プロパティがハッシュ型の場合 */
				for (prop in object) {
					if (this.value) {
						var wrapper = {};
						wrapper[this.key] = prop;
						wrapper[this.value] = object[prop];
						context.pushObject(wrapper);
					} else {
						context.pushObject(object[prop]);
					}
					binding.write(context);
				}
			}
		} else {
			/* プロパティが単純型の場合 */
			context.pushObject(object);
			binding.write(context);
		}
	}

});
