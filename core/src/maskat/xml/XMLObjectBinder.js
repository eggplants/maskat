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
 * XML 文書とオブジェクトの相互変換を行います。
 *
 * @name maskat.xml.XMLObjectBinder
 */
maskat.lang.Class.declare("maskat.xml.XMLObjectBinder", {

	/** @scope maskat.xml.XMLObjectBinder.prototype */

	initialize: function(config, factory) {
		this.document = new maskat.xml.DocumentBinding(this);
		this.bindings = {
			"": {
				"#document": this.document,
				"#text": new maskat.xml.TextBinding(),
				"#cdata-section": new maskat.xml.CDATASectionBinding()
			}
		};
		this.addBindingConfiguration("", config);
		this.factory = factory;
	},

	addBindingConfiguration: function(uri, config){
		if (!config) {
			return;
		}

		uri = uri || "";
		for (var name in config) {
			if (name == "#document") {
				for (var root in config[name].children) {
					this.setRootElement(uri, root);
				}
			} else {
				this.addElementBinding(uri, name, config[name]);
			}
		}
	},

	/**
	 * XML 文書のルート要素を設定します。
	 * 
	 * @param uri
	 *            ルート要素の名前空間 URI
	 * @param name
	 *            ルート要素のローカル名
	 */
	setRootElement: function(uri, name) {
		this.document.setRootElement(uri, name);
	},

	/**
	 * 指定した名前空間 URI に対応する接頭辞を返します。
	 * 
	 * @param uri
	 *            名前空間 URI
	 * @returns 名前空間 URI に対応する接頭辞
	 */
	getPrefix: function(uri) {
		for (var prefix in this.namespaces) {
			if (this.namespaces[prefix] == uri) {
				return prefix;
			}
		}
		return undefined;
	},

	/**
	 * 名前空間 URI と接頭辞のマッピングを追加します。
	 * 
	 * @param prefix
	 *            接頭辞
	 * @param uri
	 *            名前空間 URI
	 */
	addPrefixMapping: function(prefix, uri) {
		if (!this.namespaces) {
			this.namespaces = {};
		}
		this.namespaces[prefix] = uri;
	},

	addElementBinding: function(uri, name, config) {
		uri = uri || "";
		var binding = new maskat.xml.ElementBinding(uri, name, config);
		if (!this.bindings[uri]) {
			this.bindings[uri] = {};
		}
		this.bindings[uri][name] = binding;
		return binding;
	},

	/**
	 * XML 文書の読み込み・書き出し処理のために利用する新しいコンテキストを
	 * 生成します。
	 * 
	 * @returns 新しく生成されたコンテキスト
	 */
	createContext: function() {
		return new maskat.xml.BindingContext(this);
	},

	/**
	 * HTTP GET メソッドで取得した XML 文書の情報を オブジェクトに読み込み、
	 * そのオブジェクトを返します。
	 * 
	 * @param url
	 *            XML 文書を取得する URL
	 * 
	 * @returns XML 文書の情報を読み込んだオブジェクト
	 */
	load: function(url) {
		try {
			return this.read(maskat.util.CrossBrowser.getXMLDocumentFrom(url));
		} catch (e) {
			throw new maskat.lang.Error("XML_LOAD_ERROR", { url: url }, e);
		}
	},

	/**
	 * XML 文書の情報をオブジェクトに読み込み、そのオブジェクトを返します。
	 * 
	 * @param doc
	 *            XML 文書
	 * 
	 * @returns XML 文書の情報を読み込んだオブジェクト
	 */
	read: function(doc) {
		var context = this.createContext();
		this.document.read(context, doc);
		return context.popObject();
	},

	createObject: function(element) {
		return this.factory ? this.factory.create(element) : {};
	},

	/**
	 * オブジェクトを XML 文書に変換し、文字列として返します。
	 * 
	 * @param object
	 *            オブジェクト
	 * @returns XML 文書形式の文字列
	 */
	write: function(object) {
		var context = this.createContext();
		context.pushObject(object);
		this.document.write(context);
		return context.getXMLString();
	}

});
