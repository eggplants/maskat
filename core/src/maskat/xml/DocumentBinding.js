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
 * XML 文書のルート要素とオブジェクトをバインドします。
 *
 * @name maskat.xml.DocumentBinding
 */ 
maskat.lang.Class.declare("maskat.xml.DocumentBinding", {

	/** @scope maskat.xml.DocumentBinding.prototype */

	/**
	 * コンストラクタです。
	 * 
	 * @param uri
	 *            ルート要素の名前空間 URI
	 * @param name
	 *            ルート要素のローカル名
	 */
	initialize: function(uri, name) {
		this.setRootElement(uri, name);
	},

	/**
	 * XML 文書のルート要素を設定します。
	 * 
	 * @param uri
	 *            ルート要素の名前空間 URI
	 * @param name
	 *            ルート要素のローカル名
	 */
	setRootElement : function(uri, name) {
		this.uri = uri || "";
		this.name = name;
	},

	/**
	 * XML 文書をオブジェクトに読み込みます。
	 * 
	 * @param context
	 *            XML 読み込みに使用するコンテキスト
	 * @param doc
	 *            XML 文書
	 */
	read: function(context, doc) {
		var element = doc.documentElement;
		var nodeName = element.localName || element.baseName;
		if (nodeName != this.name) {
			throw new maskat.lang.Error("INVALID_ROOT_NODE",
				{ elementName: nodeName });
		}
		
		var binding = context.getElementBinding(element);
		if (!binding) {
			throw new maskat.lang.Error("UNKNOWN_ELEMENT", {
					elementName: element.nodeName });
		}
		binding.read(context, element);
	},

	/**
	 * オブジェクトを XML 文書の形式で書き出します。
	 * 
	 * @param context
	 *            XML 書き出しに使用するコンテキスト
	 */
	write: function(context) {
		context.writeXMLDeclaration();
		var binding = context.getElementBinding(this.uri, this.name);
		if (!binding) {
			throw new maskat.lang.Error("UNKNOWN_ELEMENT", {
					elementName: this.name });
		}
		binding.write(context);
	}

});
