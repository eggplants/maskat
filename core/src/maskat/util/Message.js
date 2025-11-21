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
 * メッセージテンプレートと置換パラメータを合成し、メッセージ文字列を動的に
 * 生成する機能を持つユーティリティクラスです。
 *
 * <p>
 * このクラスは static メソッドのみを持つユーティリティクラスであり、
 * インスタンス化する必要はありません。
 * </p>
 *
 * @name maskat.util.Message
 */
maskat.lang.Class.declare("maskat.util.Message", {

	_static: {
		/** @scope maskat.util.Message */	
		
		/**
		 * メッセージテンプレートを格納するハッシュ
		 *
		 * <ul>
		 *   <li>プロパティ名: メッセージキー</li>
		 *   <li>プロパティ値: 置換パラメータを含むテンプレート文字列</li>
		 * </ul>
		 */
		templates: {},

		/** 
		 * 指定された URL から JSON 形式で記述されたメッセージテンプレートの
		 * リストを読み込みます。
		 *
		 * <p>
		 * メッセージテンプレートのリストの定義例を以下に示します:
		 * </p>
		 * <pre>
		 * {
		 *     "メッセージキー1": "テンプレート文字列1",
		 *     "メッセージキー2": "テンプレート文字列2",
		 *     ...
		 * }
		 * </pre>
		 *
		 * <p>
		 * 読み込まれたリストは既存のメッセージテンプレートに追加されます。
		 * 既存のメッセージテンプレートとキーが重複する場合には、読み込まれた
		 * 値で上書きされます。
		 * </p>
		 *
		 * @param url メッセージテンプレートを取得する URL
		 */
		loadTemplates: function(url) {
			maskat.lang.Object.populate(this.templates,
				maskat.util.CrossBrowser.loadJSONFrom(url)); 
		},

		/** 
		 * メッセージを指定されたパラメータでフォーマットして返します。
		 *
		 * @param key メッセージキー
		 * @param values 置換パラメータの値を含んだオブジェクト
		 * @returns フォーマットされたメッセージ文字列
		 */
		format: function(key, values) {
			return this.merge(this.templates[key], values);
		},
		
		/** 
		 * メッセージを指定されたパラメータでフォーマットして返します。
		 *
		 * @param template メッセージテンプレート
		 * @param values 置換パラメータの値を含んだオブジェクト
		 * @returns フォーマットされたメッセージ文字列
		 */
		merge: function(template, values) {
			if (template && values) {
				var replacer = function(str, p1, offset, s){ return values[p1]; };
				template = template.replace(/#{(.*?)}/g, replacer);
			}
			return template;
		}
	}

});
