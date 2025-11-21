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
 * @class 入力ダイアログを表示するクラスです。
 *
 * ダイアログが閉じられたときにコールバック関数を実行します。
 *
 * @name maskat.ui.InputDialog
 */ 
maskat.lang.Class.declare("maskat.ui.InputDialog", {

	/** @scope maskat.ui.InputDialog.prototype */

	/**
	 * javascriptの入力ダイアログコンストラクタです。
	 *
	 * @param title ダイアログのタイトル文字列
	 * @param message ダイアログメッセージ文字列
	 * @param icon アイコン種別
	 * @param onClick ボタン押下時の呼び出し先関数名
	 */
	initialize: function (title, message, icon, onClick) {
		this.title = title;
		this.message = message;
		this.icon = icon;
		this.onClick = onClick;
		/* 戻り関数の存在チェック、無いときは何もしない*/
		if (typeof(this.onClick) != "function") {
			this.onClick = maskat.lang.EmptyFunction;
		}
	},

	/**
	 * 入力ダイアログをPOPUPして表示します。
	 *
	 */
	open: function () {
		/* NOP */
	}
});
