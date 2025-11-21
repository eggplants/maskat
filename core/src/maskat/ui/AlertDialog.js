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
 * メッセージダイアログの API を規定する抽象クラスです。
 *
 * <p>
 * メッセージダイアログはユーザにメッセージを表示し、ダイアログが閉じられた
 * さいにコールバック関数を実行します。
 * </p>
 *
 * @name maskat.ui.AlertDialog
 */ 
maskat.lang.Class.declare("maskat.ui.AlertDialog", {

	/** @scope maskat.ui.AlertDialog.prototype */

	/**
	 * コンストラクタです。
	 *
	 * @param title タイトル文字列
	 * @param message メッセージ文字列
	 * @param icon アイコン種別
	 * @param onClick ボタン押下時に呼び出されるコールバック関数
	 */
	initialize: function (title, message, icon, onClick) {
		this.title = title;
		this.message = message;
		this.icon = icon;
		this.onClick = onClick;

		/* コールバック関数が未指定の場合は何もしない */
		if (typeof(this.onClick) != "function") {
			this.onClick = maskat.lang.EmptyFunction;
		}
	},

	/**
	 * ダイアログを表示します。
	 */
	open: function () {
		/* NOP */
	}

});
