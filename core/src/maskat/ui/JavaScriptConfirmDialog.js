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
 * @class JavaScriptの確認ダイアログを表示するクラスです。
 *
 * @name maskat.ui.JavaScriptConfirmDialog
 * @extends maskat.ui.ConfirmDialog
 */
maskat.lang.Class.declare("maskat.ui.JavaScriptConfirmDialog")
	.extend("maskat.ui.ConfirmDialog", {

	/** @scope maskat.ui.JavaScriptConfirmDialog.prototype */

	/**
	 * javascriptの確認ダイアログコンストラクタです。
	 * 引数のtitle, iconは無視されます
	 *
	 * @param title ダイアログのタイトル文字列
	 * @param message ダイアログメッセージ文字列
	 * @param icon アイコン種別
	 * @param onClick ボタン押下時の呼び出し先関数名
	 */
	initialize: function (title, message, icon, onClick) {
		/* 引数を内部メンバとして設定 */
		this.base.apply(this, arguments);
	},

	/**
	 * javascriptの確認ダイアログをPOPUPして表示します。
	 *
	 */
	open: function () {
	
		/* ダイアログボックス表示 */
		var returnValue = confirm(this.message);
		
		/* 関数の実行 */
		this.onClick (returnValue ? maskat.ui.Dialog.OK : maskat.ui.Dialog.CANCEL);
		
	}
});
