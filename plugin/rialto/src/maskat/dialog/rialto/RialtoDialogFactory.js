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
 * Rialtoのダイアログ表示クラスのインスタンスを生成するためのクラスです。
 *
 */
maskat.lang.Class.declare("maskat.dialog.rialto.RialtoDialogFactory")
	.extend("maskat.ui.DialogFactory", {

	_static: {
		/** @scope maskat.dialog.rialto.RialtoDialogFactory */
		
		/** 情報アイコンの URL を表す定数 */
		INFO: "/rialto/rialtoEngine/images/debug/infoIcon.png",

		/** 警告アイコンの URL を表す定数 */
		WARN: "/rialto/rialtoEngine/images/debug/warningIcon.png",

		/** エラーアイコンの URL を表す定数 */
		ERROR:"/rialto/rialtoEngine/images/debug/errorIcon.png"
	},

	/**
	 * 確認ダイアログを表示するためのクラスを生成します。
	 *
	 * @param title ダイアログのタイトル文字列
	 * @param message ダイアログメッセージ文字列
	 * @param icon アイコン種別
	 * @param onClick ボタン押下時の呼び出し先関数名
	 */
	createConfirm: function (title, message, icon, onClick) {
		return new maskat.dialog.rialto.RialtoConfirmDialog (title, message, icon, onClick);
	},
	
	/**
	 * アラートダイアログを表示するためのクラスを生成します。
	 *
	 * @param title ダイアログのタイトル文字列
	 * @param message ダイアログメッセージ文字列
	 * @param onClick ボタン押下時の呼び出し先関数名
	 */
	createAlert: function (title, message, icon, onClick) {
		return new maskat.dialog.rialto.RialtoAlertDialog (title, message, icon, onClick);
	},
	
	/**
	 * 入力ダイアログを表示するためのクラスを生成します。
	 *
	 * @param title ダイアログのタイトル文字列
	 * @param message ダイアログメッセージ文字列
	 * @param onClick ボタン押下時の呼び出し先関数名
	 */
	createInput: function (title, message, icon, onClick) {
		return new maskat.dialog.rialto.RialtoInputDialog (title, message, icon, onClick);
	},
	
	/**
	 * 進捗表示ダイアログを表示するためのクラスを生成します。
	 *
	 * @param title ダイアログのタイトル文字列
	 * @param message ダイアログメッセージ文字列
	 * @param goalValue 終了進捗値(オプション)
	 */
	createProgress: function (title, message, goalValue) {
		return new maskat.dialog.rialto.RialtoProgressDialog (title, message, goalValue);
	}
	
});
