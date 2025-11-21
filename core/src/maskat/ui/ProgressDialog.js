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
 * @class 進捗ダイアログを表示するクラスです。
 *
 * @name maskat.ui.ProgressDialog
 */
maskat.lang.Class.declare("maskat.ui.ProgressDialog", {

	/** @scope maskat.ui.ProgressDialog.prototype */

	/**
	 * javascriptの進捗ダイアログコンストラクタです。
	 *
	 * @param title ダイアログのタイトル文字列
	 * @param message ダイアログメッセージ文字列
	 * @param total 終了進捗値(オプション)
	 */
	initialize: function (title, message, total) {
		this.title = title;
		this.message = message;
		this.total = total;
	},

	/**
	 * 進捗ダイアログをPOPUPして表示します。
	 *
	 */
	open: function () {
		/* NOP */
	},
	/**
	 * javascriptの進捗状況ウィンドウの進捗状況を更新します。
	 *
	 * @param count 進捗総数
	 */
	setProgress:function (count) {
		/* NOP */
	},
	/**
	 * javascriptの進捗状況ウィンドウの進捗状況を加算更新します。
	 *
	 * @param count 進捗数
	 */
	worked:function (count) {
		/* NOP */
	},
	/**
	 * 進捗ダイアログを閉じます。
	 *
	 */
	done: function () {
		/* NOP */
	}

});
