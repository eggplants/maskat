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
 * XML 属性とオブジェクトのプロパティをバインドします。
 * 
 * @name maskat.xml.AttributeBinding
 */
maskat.lang.Class.declare("maskat.xml.AttributeBinding", {

	/** @scope maskat.xml.AttributeBinding.prototype */

	/**
	 * コンストラクタです。
	 * 
	 * @param name
	 *            XML 属性のローカル名
	 * @param config
	 *            バインディング設定
	 * <pre>
	 * {
	 *     type:
	 *         属性のデータ型を表す文字列 (&quot;string&quot;, &quot;number&quot;, &quot;boolean&quot; など)
	 *         指定可能なデータ型は {@link maskat.util.Converter} を参照してください。
	 * 
	 *     required:
	 *         必須属性の場合 true、省略可能の場合は false
	 * 
	 *     defaultValue:
	 *         属性値が省略された場合のデフォルト値
	 * 
	 *     property:
	 *         属性名と対応するオブジェクトのプロパティ名
	 * 
	 *     value:
	 *         属性値のリテラル
	 *         読み込み時は常に一定の属性値が記述されていることを要求し、
	 *         書き込み時は固定値で属性値を書き出します。
	 * }
	 * </pre>
	 */
	initialize: function(name, config) {
		this.name = name;
		this.type = config.type || "string";
		this.required = config.required || false;
		this.property = config.property || name;
		this.value = config.value;
		this.options = config;

		if (typeof (config.defaultValue) != "undefined") {
			this.defaultValue = maskat.util.Converter.convert(this.type,
					config.defaultValue, this.options);
		}
	},

	/**
	 * オブジェクトのプロパティに XML 属性の値を読み込みます。
	 * 
	 * @param context
	 *            XML 読み込みに使用するコンテキスト
	 * @param attribute
	 *            XML 属性ノード
	 */
	read: function(context, attribute) {
		var value = this.value || (attribute && attribute.nodeValue);
		if (value || value === "") {
			var replacer = function(str, p1, offset, s) {
				return maskat.util.Message.format(p1);
			};
			value = value.replace(/#{(.*?)}/g, replacer);
			value = maskat.util.Converter.convert(this.type, value,
					this.options);
			context.setProperty(this.property, value);
		} else if (this.required) {
			throw new maskat.lang.Error("MISSING_ATTRIBUTE", {
				attributeName :this.name
			});
		} else if (typeof (this.defaultValue) != "undefined") {
			context.setProperty(this.property, this.defaultValue);
		}
	},

	/**
	 * オブジェクトのプロパティ値を XML 属性の形式で書き出します。
	 * 
	 * @param context
	 *            XML 書き出しに使用するコンテキスト
	 */
	write: function(context) {
		var value = this.value || context.getProperty(this.property);
		if (typeof (value) != "undefined") {
			if (this.defaultValue !== value) {
				if (typeof (value) == "function") {
					value = value.toString().match(/function (\w+)/);
					value = value ? value[1] : "[function]";
				}
				value = maskat.lang.String.escapeXML(value);
				context.writeAttribute(this.name, value);
			}
		} else if (this.required) {
			throw new maskat.lang.Error("MISSING_ATTRIBUTE", {
				attributeName :this.name
			});
		}
	}

});
