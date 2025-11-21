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
 * @class ダイアログ API を切り替えるためのファクトリを定義するクラスです。
 *
 * ダイアログファクトはロードされているプログインをもとに、適切なダイアログオブジェクトを
 * 生成して返却します。
 *
 * @name maskat.ui.DialogFactory
 */
maskat.lang.Class.declare("maskat.ui.DialogFactory", {

	/** @scope maskat.ui.DialogFactory.prototype */

	/**
	 * 確認ダイアログを表示するためのクラスを生成します。
	 *
	 * @param title ダイアログのタイトル文字列
	 * @param message ダイアログメッセージ文字列
	 * @param icon アイコン種別
	 * @param onClick ボタン押下時の呼び出し先関数名
	 */
	createConfirm: function (title, message, icon, onClick) {
		/* NOP */
	},
	
	/**
	 * アラートダイアログを表示するためのクラスを生成します。
	 *
	 * @param title ダイアログのタイトル文字列
	 * @param message ダイアログメッセージ文字列
	 * @param icon アイコン種別
	 * @param onClick ボタン押下時の呼び出し先関数名
	 */
	createAlert: function (title, message, icon, onClick) {
		/* NOP */
	},
	
	/**
	 * 入力ダイアログを表示するためのクラスを生成します。
	 *
	 * @param title ダイアログのタイトル文字列
	 * @param message ダイアログメッセージ文字列
	 * @param icon アイコン種別
	 * @param onClick ボタン押下時の呼び出し先関数名
	 */
	createInput: function (title, message, icon, onClick) {
		/* NOP */
	},
	
	/**
	 * 進捗表示ダイアログを表示するためのクラスを生成します。
	 *
	 * @param title ダイアログのタイトル文字列
	 * @param message ダイアログメッセージ文字列
	 */
	createProgress: function (title, message) {
		/* NOP */
	}
	
});
