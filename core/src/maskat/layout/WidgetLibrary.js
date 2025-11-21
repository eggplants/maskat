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
 * 部品ライブラリを定義します。
 *
 * <p>
 * 部品ライブラリはレイアウト定義 XML に記述可能なタグを追加するための
 * 拡張メカニズムであり、JSP におけるタグライブラリの概念と似ています。
 * 部品ライブラリを利用すると、サードパーティ製の Ajax ツールキットや 
 * JavaScript ライブラリの持つ機能をマスカットに取り込むことができます。
 * </p>
 *
 * @name maskat.layout.WidgetLibrary
 */
maskat.lang.Class.declare("maskat.layout.WidgetLibrary", {

	/** @scope maskat.layout.WidgetLibrary.prototype */
	
	/**
	 * この部品ライブラリがデフォルトで使用する名前空間接頭辞を返します。
	 *
	 * @returns デフォルトの名前空間接頭辞
	 */
	getPrefix: function() {
		return null;
	},

	/**
	 * この部品ライブラリの名前空間 URI を返します。
	 *
	 * @returns 部品ライブラリの名前空間 URI
	 */
	getNamespaceURI: function() {
		return null;
	},

	/**
	 * この部品ライブラリのバインディング設定を返します。
	 *
	 * @returns 部品ライブラリのバインディング設定
	 */
	getBindingConfiguration: function() {
		return null;
	},

	/**
	 * 指定した XML 要素をオブジェクトに変換します。
	 *
	 * <p>
	 * このメソッドを実装することにより、XMLObjectBinder のデフォルトの
	 * オブジェクト生成方法を変更することができます。
	 * </p>
	 *
	 * @returns XML 要素から変換されたオブジェクト
	 */
	create: function(element) {
		return null;
	}

});
