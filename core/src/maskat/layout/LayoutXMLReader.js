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
 * レイアウト定義 XML を読み込みます。
 *
 * <p>
 * LayoutXMLReader に部品ライブラリを登録することにより、レイアウト定義 XML
 * に記述可能なタグを追加できます。
 * </p>
 *
 * @name maskat.layout.LayoutXMLReader
 * @extends maskat.xml.XMLObjectBinder
 */
maskat.lang.Class.declare("maskat.layout.LayoutXMLReader")
	.extend("maskat.xml.XMLObjectBinder", {

	_static: {
		/** @scope maskat.layout.LayoutXMLReader */
		
		/**
		 * このクラスの唯一のインスタンスを返します。(Singleton パターン)
		 *
		 * @returns このクラスの唯一のインスタンス
		 */
		getInstance: function() {
			var self = arguments.callee;
			if (!self.instance) {
				self.instance = new this();
			}
			return self.instance;
		}
	},
	
	/** @scope maskat.layout.LayoutXMLReader.prototype */
	
	/**
	 * コンストラクタです。
	 */
	initialize: function(){
		this.base.apply(this, arguments);
		this.libraries = null;
		this.addWidgetLibrary(new maskat.layout.LayoutFactory());
	},

	createObject: function(element){
		var uri = element.namespaceURI || "";
		var widget;
		if (this.libraries[uri]) {
			widget = this.libraries[uri].create(element);
		}
		return widget || {};
	},

	/**
	 * 部品ライブラリを登録します。
	 *
	 * @param library 部品ライブラリ
	 */
	addWidgetLibrary: function(library) {
		var uri = library.getNamespaceURI() || "";
		if (!this.libraries) {
			this.libraries = {};
		}
		this.libraries[uri] = library;

		var config = library.getBindingConfiguration();
		this.addBindingConfiguration(uri, config);
	}

});
