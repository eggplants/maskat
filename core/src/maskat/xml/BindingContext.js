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
 * XML 文書の読み込み・書き出し処理の中間状態 (コンテキスト) を保持します。
 * {@link maskat.xml.XMLObjectBinder} は XML 文書の処理要求ごとに新しい
 * コンテキストを生成して使用します。
 *
 * @see maskat.xml.XMLObjectBinder#createContext
 * @name maskat.xml.BindingContext
 */ 
maskat.lang.Class.declare("maskat.xml.BindingContext", {

	/** @scope maskat.xml.BindingContext.prototype */

	/**
	 * コンストラクタです。
	 * 
	 * @param binder
	 *            このコンテキストを使用する XMLObjectBinder
	 */
	initialize: function(binder) {
		this.binder = binder;
		this.object = null;
		this.stack = [];
		this.emptyElement = false;
		this.nodeNames = [];
		this.buffer = [];
		this.variables = null;
		this.isFF = (navigator.userAgent.indexOf("Firefox") != -1);
	},

	/**
	 * 指定した名前空間 URI に対応する接頭辞を返します。
	 * 
	 * @param uri
	 *            名前空間 URI
	 * @returns 名前空間 URI に対応する接頭辞
	 */
	getPrefix: function(uri) {
		return this.binder.getPrefix(uri);
	},

	/**
	 * 名前空間 URI と接頭辞のマッピングを追加します。
	 * 
	 * @param prefix
	 *            接頭辞
	 * @param uri
	 *            名前空間 URI
	 */
	addPrefixMapping : function(prefix, uri) {
		this.binder.addPrefixMapping(prefix, uri);
	},

	getElementBinding: function(uri, name) {
		if (typeof(uri) == "object") {
			var qname = uri;
			uri = qname.namespaceURI;
			name = qname.localName || qname.baseName || qname.nodeName;
			if (this.binder.strictCheck && this.nodeNames.length > 0 && name.charAt(0) != "#") {
				name = this.nodeNames.join(".") + "." + name;
			}
		}
		uri = uri || "";
		var bindings = this.binder.bindings;
		if (!bindings[uri]) {
			throw new maskat.lang.Error("UNKNOWN_NS_URI", { uri: uri });
		}
		return bindings[uri][name];
	},
	
	/**
	 * 指定された XML 要素を読み込むための新しいオブジェクトを生成し、
	 * スタックの頂上に追加します。
	 * 
	 * @param element
	 *            XML 書き出しに使用するコンテキスト
	 */
	createObject: function(element) {
		this.pushObject(this.binder.createObject(element));
	},

	/**
	 * スタックの頂上にあるオブジェクトを返します。
	 * 
	 * @returns スタックの頂上にあるオブジェクト 
	 */
	getObject: function() {
		return this.object;
	},
	
	/**
	 * スタックの頂上に指定されたオブジェクトを追加します。
	 * 
	 * @param object
	 *            オブジェクト
	 */
	pushObject: function(object) {
		this.object = object;
		this.stack[this.stack.length] = object;
	},

	/**
	 * スタックの頂上からオブジェクトを削除し、そのオブジェクトを返します。
	 * 
	 * @returns スタックの頂上から削除されたオブジェクト 
	 */
	popObject: function() {
		var result = this.stack.pop(); 
		this.object = this.stack[this.stack.length - 1];
		return result;
	},

	/**
	 * スタックの頂上にあるオブジェクトから指定されたプロパティの値を取得し、
	 * その値を返します。
	 * 
	 * @returns プロパティの値
	 */
	getProperty: function(name) {
		return this.object[name];
	},
	
	/**
	 * スタックの頂上にあるオブジェクトにプロパティを設定します。
	 * 
	 * @param name
	 *            プロパティ名
	 * @param value
	 *            プロパティの値
	 */
	setProperty : function(name, value) {
		this.object[name] = value;
	},

	/**
	 * スタックの頂上にあるオブジェクトのプロパティに値を追加します。
	 * プロパティは配列型である必要があります。
	 * 
	 * @param name
	 *            プロパティ名
	 * @param value
	 *            プロパティの値
	 */
	addProperty: function(name, value) {
		if (!this.object[name]) {
			this.object[name] = [];
		}
		this.object[name][this.object[name].length] = value;
	},

	/**
	 * スタックの頂上にあるオブジェクトに対し、複数のプロパティを一括して
	 * 設定します。
	 * 
	 * @param properties
	 *            設定対象のプロパティを格納したオブジェクト
	 */
	addProperties: function(properties) {
		maskat.lang.Object.populate(this.object, properties, true);
	},

	/**
	 * スタックの頂上にあるオブジェクトのプロパティに値を追加します。
	 * プロパティは連想配列型 (オブジェクト) である必要があります。
	 * 
	 * @param name
	 *            プロパティ名
	 * @param key
	 *            連想配列のキー
	 * @param value
	 *            プロパティの値
	 */
	putProperty: function(name, key, value) {
		if (!this.object[name]) {
			this.object[name] = {};
		}
		this.object[name][key] = value;
	},

	/**
	 * スタックの頂上にあるオブジェクトに対し、指定したメソッドを実行します。
	 * 
	 * @param name
	 *            メソッド名
	 * @param argument
	 *            メソッド呼び出し時に与える引数
	 */
	callMethod: function(name, argument) {
		this.object[name](argument);
	},
	
	/**
	 * XML 文書内に文字列を書き出します。
	 * 
	 * @param string
	 *            書き出し対象の文字列
	 */
	write: function(string) {
		this.buffer[this.buffer.length] = string;
	},

	/**
	 * XML 文書内に XML 宣言を書き出します。
	 */
	writeXMLDeclaration: function() {
		this.buffer[this.buffer.length] = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	},

	/**
	 * XML 文書内に要素の開始を書き出します。
	 * 
	 * @param name
	 *            要素名
	 */
	writeStartElement: function(uri, name) {
		if (this.binder.strictCheck) {
			var pos = name.lastIndexOf(".");
			name = pos == -1 ? name : name.substring(pos + 1);
		}
		var prefix = this.getPrefix(uri);
		var nodeName = prefix ? (prefix + ":" + name) : name; 

		/* 開始タグを出力 */
		this.nodeNames[this.nodeNames.length] = nodeName;
		this.buffer[this.buffer.length] = "<" + nodeName;
		this.buffer[this.buffer.length] = ">";

		/* 空要素であると仮定してフラグを立てる */
		this.emptyElement = true;
	},

	/**
	 * XML 文書内に要素の終了を書き出します。
	 * 
	 * @param name
	 *            要素名
	 */
	writeEndElement: function() {
		/* 終了タグを出力 */
		var nodeName = this.nodeNames.pop();
		if (this.emptyElement) {
			this.buffer.pop();
			this.buffer[this.buffer.length] = "/>";
		} else {
			this.buffer[this.buffer.length] = "</" + nodeName + ">";
		}

		/* 子要素を出力したため、親要素は空要素ではない */
		this.emptyElement = false;
	},

	/**
	 * XML 文書内に属性を書き出します。
	 * 
	 * @param name
	 *            属性名
	 * @param value
	 *            属性値
	 */
	writeAttribute: function(name, value) {
		this.buffer.pop();
		this.buffer[this.buffer.length] = " " + name + "=\"" + value + "\"";
		this.buffer[this.buffer.length] = ">";
	},

	/**
	 * XML 文書内に CDATA セクションを書き出します。
	 * 
	 * @param string
	 *            書き出し対象の文字列
	 */
	writeCDATASection: function(string) {
		this.buffer[this.buffer.length] = "<![CDATA[" + string + "]]>";

		/* CDATA セクションを出力したため、親要素は空要素ではない */
		this.emptyElement = false;
	},

	/**
	 * XML 文書内にテキストノードを書き出します。
	 * 
	 * @param string
	 *            書き出し対象の文字列
	 */
	writeText: function(string) {
		this.buffer[this.buffer.length] = maskat.lang.String.escapeXML(string);

		/* テキストノードを出力したため、親要素は空要素ではない */
		this.emptyElement = false;
	},

	/**
	 * XML 文書を文字列として取得します。
	 * 
	 * @returns XML 文書を表す文字列
	 */
	getXMLString: function() {
		/* ルート要素に名前空間宣言を出力する */
		if (this.binder.namespaces && this.buffer.length > 2) {
			var attributes = [];
			for (var prefix in this.binder.namespaces) {
				attributes[attributes.length] = " xmlns";
				if (prefix) {
					attributes[attributes.length] = ":";
					attributes[attributes.length] = prefix;
				}
				attributes[attributes.length] = "=\"";
				attributes[attributes.length] = this.binder.namespaces[prefix];
				attributes[attributes.length] = "\"";
			}
			this.buffer.splice(2, 0, attributes.join(""));
		}

		return this.buffer.join("");
	}
	
});
