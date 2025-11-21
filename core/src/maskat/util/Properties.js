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
 * キーと値が対になったプロパティを取得・格納する機能を持ったクラスです。
 * プロパティにはキーごとに型とデフォルト値を定義できます。
 *
 * <h2>プロパティの定義</h2>
 * <p>
 * コンストラクタ引数や defineProperty メソッドでプロパティを定義します。
 * 未定義のプロパティについても値の格納や取得はできますが、その場合には
 * 型変換やデフォルト値の機能が利用できません。
 * </p>
 * <pre>
 * var prop = new maskat.util.Properties({
 *     itemCode: { type: "string" },
 *     name: { type: "string" },
 *     size: { type: "enum", values: [ "large", "medium", "small" ] },
 *     price: { type: "number" },
 *     discontinued: { type: "boolean", defaultValue: false }
 * });
 * </pre>
 *
 * <h2>プロパティ値の格納</h2>
 * <p>
 * データ型が指定されたプロパティでは、値の格納時に型の変換が行われます。
 * 未定義の場合は指定された値をそのまま格納します。
 * </p>
 * <pre>
 * prop.setProperty("price", "500"); // 数値の 500 に変換される
 * </pre>
 *
 * <h2>プロパティ値の取得</h2>
 * <p>
 * プロパティに値が格納されていない場合、デフォルト値が指定されていれば
 * その値を返却します。未定義の場合は undefined を返します。
 * </p>
 * <pre>
 * var discontinued = prop.getProperty("discontinued"); // false
 * if (discontinued) {
 *     ...
 * }
 * </pre>
 *
 * @name maskat.util.Properties
 */
maskat.lang.Class.declare("maskat.util.Properties", {

	/** @scope maskat.util.Properties.prototype */

	/**
	 * コンストラクタです。
	 *
	 * @param descriptors プロパティ記述子
	 * <pre>
	 * {
	 *     プロパティキー1: { 
	 *         type: プロパティの型を表す文字列
	 *         defaultValue: デフォルト値
	 *     },
	 *
	 *     プロパティキー2: { ... },
	 *     プロパティキー3: { ... },
	 *     ...
	 * }
	 * </pre>
	 */
	initialize: function(descriptors) {
		this.descriptors = {};
		this.values = {};

		for (var key in descriptors) {
			var desc = descriptors[key];
			this.defineProperty(key, desc.type, desc.defaultValue, desc);
		}
	},

	/**
	 * 新しいプロパティキーを宣言します。
	 *
	 * @param key プロパティキー
	 * @param type プロパティの型を表す文字列
	 *        {@link maskat.util.Converter} がサポートする型を指定します。
	 * @param defaultValue デフォルト値
	 * @param options 変換オプション
	 */
	defineProperty: function(key, type, defaultValue, options) {
		/* デフォルト値が指定された場合、型を変換する */		
		if (typeof(defaultValue) != "undefined") {
			defaultValue = maskat.util.Converter.convert(type, defaultValue, options);
		}

		this.descriptors[key] = {
			type: type,
			defaultValue: defaultValue,
			options: options
		};

		/* プロパティの値がすでに格納されている場合は型を変換 */		
		if (typeof(this.values[key]) != "undefined") {
			this.setProperty(key, this.values[key]);
		}
	},

	/**
	 * 指定したキーに対応するプロパティ値を格納します。
	 *
	 * @param key プロパティキー
	 * @param value プロパティの値
	 */
	setProperty: function(key, value) {
		var desc = this.descriptors[key];
		if (desc) {
			value = maskat.util.Converter.convert(desc.type, value, desc.options);
		}
		this.values[key] = value;
	},

	/**
	 * プロパティキーと値が対になったオブジェクトから、プロパティ値を
	 * すべて読み込みます。
	 *
	 * @param values プロパティキーと値が対になったオブジェクト 
	 */
	setProperties: function(values) {
		for (var key in values) {
			this.setProperty(key, values[key]);
		}
	},

	/**
	 * 指定された URL から HTTP GET メソッドで JSON 形式のリテラル文字列を
	 * 取得し、そこからプロパティキーと値を読み込みます。
	 *
	 * @param url JSON ファイルを取得する URL
	 */
	load: function(url) {
		this.setProperties(maskat.util.CrossBrowser.loadJSONFrom(url));
	},

	/**
	 * 指定したキーに対応するプロパティ値を返します。
	 *
 	 * @returns 指定したキーに対応するプロパティ値 
	 */
	getProperty: function(key) {
		var value = this.values[key];
		if (typeof(value) == "undefined" && this.descriptors[key]) {
			value = this.descriptors[key].defaultValue;
		}
		return value;
	},

	/**
	 * すべてのプロパティキーと値が対になったオブジェクトを返します。
	 *
	 * @returns プロパティキーと値が対になったオブジェクト 
	 */
	getProperties: function() {
		var result = {};
		var key;

		/* デフォルト値を result オブジェクトに格納 */
		for (key in this.descriptors) {
			result[key] = this.descriptors[key].defaultValue;
		} 

		/* プロパティ値を result オブジェクトに格納 */
		for (key in this.values) {
			result[key] = this.values[key];
		} 

		return result;
	}

});
