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
 * 文字列を操作するためのユーティリティメソッドを提供します。
 *
 * <p>
 * このクラスは static メソッドのみを持つユーティリティクラスであり、
 * インスタンス化する必要はありません。
 * </p>
 *
 * @name maskat.lang.String
 */
maskat.lang.Class.declare("maskat.lang.String", {

	_static: {
		/** @scope maskat.lang.String.prototype */

		/**
		 * 指定した文字列に含まれている HTML 特殊文字を HTML エンティティに
		 * 置換した文字列を返します。
		 *
		 * @param string 文字列
		 *
		 * @returns HTML 特殊文字を HTML エンティティに置換した文字列
		 */
		escapeHTML: function(string) {
			var div = document.createElement("div");
			var text = document.createTextNode(string);
			div.appendChild(text);
			return div.innerHTML;
		},
	
		/**
		 * 指定した文字列に含まれている XML 特殊文字を XML エンティティに
		 * 置換した文字列を返します。
		 *
		 * @param string 文字列
		 *
		 * @returns XML 特殊文字を XML エンティティに置換した文字列
		 */
		escapeXML: function(string) {
			if (typeof(string) == "string" && string.length > 0) {
				string = string.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/"/g, "&quot;")
					.replace(/'/g, "&apos;");
			}
			return string;
		},

		/**
		 * 指定した文字列から、先頭と末尾の空白を取り除いた新しい文字列を
		 * 返します。
		 *
		 * @param string 文字列
		 *
		 * @returns 文字列の先頭と末尾の空白を取り除いた文字列
		 */
		trim: function(string){
			return string.replace(/^\s+|\s+$/g, "");
		}
	}

});
 