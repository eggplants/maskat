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
 * JavaScript におけるデータ型の変換を行うコンバータです。
 *
 * <p>
 * このクラスは static メソッドのみを持つユーティリティクラスであり、
 * インスタンス化する必要はありません。
 * </p>
 *
 * <h2>使用方法</h2>
 * <p>
 * コンバータの最も一般的な利用方法は文字列を他のデータ型に変換する
 * ことです。コンバータは {@link maskat.util.Converter.convert} 関数
 * を経由して実行します。使用例を以下に示します:
 * </p>
 *
 * <pre>
 * var input = prompt("How old are you ?", "");
 * // 入力された文字列を数値に変換
 * var age = maskat.util.Converter.convert("number", input);
 * </pre>
 *
 * <p>
 * 変換先の型によっては、文字列以外の値を入力値として受け取ることが
 * 可能です。デフォルトで利用可能な変換先の型は以下のとおりです。
 * </p>
 * <ul>
 *   <li>boolean : 真偽値</li>
 *   <li>number : 数値 (整数または浮動小数)</li>
 *   <li>string : 文字列</li>
 *   <li>enum: 列挙値</li>
 *   <li>json: JSON 形式の値をパースしたオブジェクト</li>
 *   <li>object: オブジェクト</li>
 *   <li>function: 関数オブジェクト</li>
 *   <li>RegExp: 正規表現オブジェクト</li>
 *   <li>HTMLElement: HTML 要素</li>
 * </ul>
 *
 * <h2>データ型の追加</h2>
 * <p>
 * {@link maskat.util.Converter.converters} オブジェクトにコンバータ
 * 関数を追加することにより、変換可能なデータ型の種類を追加できます。
 * コンバータ関数は以下のシグネチャに従います:
 * </p>
 *
 * <dl>
 *   <dt>書式<dt>
 *   <dd><code>function converter(value, options)</code><dd>
 *   <dt>引数</dt>
 *   <dd>
 *     <ul>
 *       <li><code>value</code> - 変換元の値</li>
 *       <li><code>options</code> - 変換オプション</li>
 *     </ul>
 *   </dd>
 *   <dt>返却値<dt>
 *   <dd>変換された値</dd>
 * </dl>
 *
 * @name maskat.util.Converter
 */
maskat.lang.Class.declare("maskat.util.Converter", {

	_static: {
		/** @scope maskat.util.Converter */

		/** コンバータ関数を登録するレジストリ */
		converters: {
			"boolean": function(value){
				switch (typeof(value)) {
				case "boolean":
					return value;
				case "string":
					value = maskat.lang.String.trim(value).toLowerCase();
					if (value == "true") {
						return true;
					} else if (value == "false") {
						return false;
					}
				default:
					return undefined;
				}
			},

			"number": function(value){
				switch (typeof(value)) {
				case "number":
					return value;
				case "string":
					if (isNaN(value)) {
						return undefined;
					}
					if (value.indexOf(".") == -1) {
						return parseInt(value, 10);
					} else {
						return parseFloat(value);
					}
				default:
					return undefined;
				}
			},

			"string": function(value){
				if (typeof(value) == "string") {
					return value;
				} else {
					return value.toString();
				}
			},

			"enum": function(value, options){
				if (typeof(value) == "string" && options.values) {
					if (options.values instanceof Array) {
						for (var i = 0, len = options.values.length; i < len; i++) {
							if (value == options.values[i]) {
								return value;
							}
						}
					} else {
						for (var key in options.values) {
							if (value == key) {
								return options.values[key];
							}
						}
					}
				}
				return undefined;
			},

			"json": function(value){
				switch (typeof(value)) {
				case "boolean":
				case "number":
				case "object":
					return value;
				case "string":
					return maskat.lang.Object.parseJSON(value);
				default:
					return undefined;
				}
			},

			"object": function(value){
				switch (typeof(value)) {
				case "object":
					return value;
				case "string":
					return maskat.lang.Object.find(value);
				default:
					return undefined;
				}
			},

			"function": function(value){
				switch (typeof(value)) {
				case "function":
					return value;
				case "string":
					var func = maskat.lang.Object.find(value);
					if (func && typeof(func) == "function") {
						func.functionName = value;
						return func;
					}
					throw new maskat.lang.Error("MISSING_FUNCTION",
						{ functionName: value });
				default:
					return undefined;
				}
			},

			"RegExp": function(value){
				switch (typeof(value)) {
				case "object":
				case "function":
					return (value instanceof RegExp) ? value : undefined;
				case "string":
					return new RegExp(value);
				default:
					return undefined;
				}
			},

			"HTMLElement": function(value){
				switch (typeof(value)) {
				case "string":
					return document.getElementById(value);
				default:
					return undefined;
				}
			},

			"length": function(value){
				value = value.match(/^([-+]?\d+(\.\d+)?)\s*(em|pt|px|%)?$/);
				if (value && value[3] == "" || value[3] == undefined) {
					value[3] = "px";
				}
				return value ? value[1] + value[3] : undefined;
			},

			"Array": function(value){
				switch (typeof(value)) {
				case "object":
					if (value instanceof Array) {
						return value;
					} else {
						return [ value ];
					}
				case "string":
					return value.split(",");
				case "undefined":
					return undefined;
				default:
					// boolean, number の場合
					return [ value ];
				}
			}
		},

		/**
		 * 指定された値 (オブジェクト) を指定した型に変換します。
		 *
		 * @param type 変換先の型
		 * @param value 変換元の値
		 * @param options 変換オプション
		 * @throws {maskat.lang.Error} データ型の変換中にエラーが発生した場合
		 *
		 * @returns 変換された値, 変換に失敗した場合は undefined
		 */
		convert: function(type, value, options){
			if (!this.converters[type]) {
				throw new maskat.lang.Error("UNKNOWN_CONVERTER_TYPE",
					{ type: type });
			}

			var result = this.converters[type](value, options);
			if (result === undefined) {
				if (value instanceof Object && !(window.Node && value instanceof Node)) {
					value = maskat.lang.Object.encodeJSON(value);
				} else if (value == undefined) {
					value = "undefined";
				}
				throw new maskat.lang.Error("CONVERSION_ERROR",
					{ type: type, value: value });
			}
			return result;
		}
	}

});
