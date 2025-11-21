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
 * ダイアログの表示方法を切り替えるためのファクトリです。
 *
 * @name maskat.ui.Dialog
 */ 
maskat.lang.Class.declare("maskat.ui.Dialog", {

	_static: {
		/** @scope maskat.ui.Dialog */
		
		/** 「はい」ボタンを表す定数値 */
		YES: "YES",

		/** 「いいえ」ボタンを表す定数値 */
		NO: "NO",

		/** 「OK」ボタンを表す定数値 */
		OK: "OK",

		/** 「キャンセル」ボタンを表す定数値 */
		CANCEL: "CANCEL",

		/** ダイアログの生成に用いるダイアログファクトリ */
		factory: null,

		/**
		 * ダイアログの生成に用いるダイアログファクトリを取得します。
		 *
		 * @returns ダイアログファクトリ
		 */
		getFactory: function() {
			/* ダイアログファクトリが未定義の場合は JavaScriptDialogFactory を使用 */
			if (!this.factory) {
				this.factory = new maskat.ui.JavaScriptDialogFactory();
			}
			return this.factory;
		},
		
		/**
		 * 確認ダイアログをPOPUPして表示します。
		 *
		 * @param title ダイアログのタイトル文字列
		 * @param message ダイアログメッセージ文字列
		 * @param icon アイコン種別
		 * @param onClick ボタン押下時の呼び出し関数
		 */
		openMessage: function (title, message, icon, onClick)  {
			return this.openConfirm(title, message, icon, onClick);
		},
		
		/**
		 * 確認ダイアログをPOPUPして表示します。
		 *
		 * @param title ダイアログのタイトル文字列
		 * @param message ダイアログメッセージ文字列
		 * @param icon アイコン種別
		 * @param onClick ボタン押下時の呼び出し関数
		 */
		openConfirm: function (title, message, icon, onClick)  {
			/* メッセージ表示クラスをファクトリ経由で生成 */
			var dialog = this.getFactory().createConfirm(title, message, icon, onClick);
			dialog.open();

			return dialog;
		},
		
		/**
		 * 入力ダイアログをPOPUPして表示します。
		 *
		 * @param title ダイアログのタイトル文字列
		 * @param message ダイアログメッセージ文字列
		 * @param icon アイコン種別
		 * @param onClick ボタン押下時の呼び出し関数
		 */
		openInput: function (title, message, icon, onClick) {
			/* 入力ダイアログクラスをファクトリ経由で生成 */
			var dialog = this.getFactory().createInput(title, message, icon, onClick);
			dialog.open ();

			return dialog;
		},
		
		/**
		 * アラートをPOPUPして表示します。
		 *
		 * @param title ダイアログのタイトル文字列
		 * @param message ダイアログメッセージ文字列
		 * @param icon アイコン種別
		 * @param onClick ボタン押下時の呼び出し関数
		 */
		openAlert: function (title, message, icon, onClick) {
			/* アラート表示ダイアログクラスをファクトリ経由で生成 */
			var dialog = this.getFactory().createAlert(title, message, icon, onClick);
			dialog.open ();

			return dialog;
		},
		
		/**
		 * 進捗状況ウィンドウをPOPUPして表示します。
		 *
		 * @param title ダイアログのタイトル文字列
		 * @param message ダイアログメッセージ文字列
		 * @param goalValue 終了進捗値(オプション)
		 * @returns POPUPのインスタンス
		 */
		openProgress: function (title, message, goalValue)  {
			/* 進捗表示ダイアログクラスをファクトリ経由で生成 */
			var dialog = this.getFactory().createProgress(title, message, goalValue);
			dialog.open ();

			return dialog;
		}
	}
});
