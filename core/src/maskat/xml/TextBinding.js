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
 * テキストノードと文字列をバインドします。
 *
 * @name maskat.xml.TextBinding
 */ 
maskat.lang.Class.declare("maskat.xml.TextBinding", {

	/** @scope maskat.xml.TextBinding.prototype */

	/**
	 * テキストノードに含まれる文字列を返します。
	 * 
	 * @param context
	 *            XML 読み込みに使用するコンテキスト
	 * @param text
	 *            テキストノード
	 */
	read: function(context, text) {
		context.pushObject(text.nodeValue);
	},

	/**
	 * オブジェクトをテキストノードの形式で書き出します。
	 * 
	 * @param context
	 *            XML 書き出しに使用するコンテキスト
	 */
	write: function(context) {
		context.writeText(context.popObject());
	}

});
