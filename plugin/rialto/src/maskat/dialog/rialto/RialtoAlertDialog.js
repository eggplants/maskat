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
 
maskat.lang.Class.declare("maskat.dialog.rialto.RialtoAlertDialog")
	.extend("maskat.ui.AlertDialog", {

	/**
	 * Rialtoのアラートコンストラクタ
	 *
	 * @param title ダイアログのタイトル文字列
	 * @param message ダイアログメッセージ文字列
	 * @param icon アイコン種別
	 * @param onClick ボタン押下時の呼び出し先関数名
	 */
	initialize: function (title, message, icon, onClick) {
		/* 引数を内部メンバとして設定 */
		this.base.apply(this, arguments);
		/* 改行文字列の置換 */
		this.message = this.message.replace( /\r?\n/g, "<br />\n");
		/* ウインドウサイズを取得 (最小サイズ幅:300 高:80)  */
		this.getOffset(300,80)
		/* ボタンの幅 */
		this.buttonWidth = 100;
	},

	/**
	 * RialtoのアラートをPOPUPして表示します。
	 *
	 */
	open: function () {
		/* 戻り関数の存在チェック、無いときはEmpty関数をセット*/
		if (typeof(this.onClick) != "function") {
			this.onClick = maskat.lang.EmptyFunction;
		}
		/* 空ウィンドウの表示 */
		var oThis = this;
		var widthGlobal = document.body.clientWidth;
		var heightGlobal = document.body.clientHeight;
		var top = (heightGlobal / 2) - (this.height / 2);
		var left = (widthGlobal / 2) - (this.width / 2);
		this.popup = new rialto.widget.PopUp("popup", 
							top, 
							left, 
							this.width, 
							this.height, 
							"", 
							this.title, 
							"inherit",
							{withCloseButon:false}
							);
							
		this.divData = document.createElement("DIV");
		/* イメージの表示 */
		this.icon = this.icon ? this.icon : "";
		if (this.icon!="") {
			this.message = "<IMG src=\"" + this.icon + "\"> " +	this.message;
		}
		/* アラート内表示メッセージの作成 */
		this.divData.innerHTML = this.message;
		this.divData.style.position = "absolute";
		this.divData.style.overflow = "auto";
		this.popup.add(this.divData);
		/* [OK]ボタンの追加 */
		var posxOk = (this.width / 2) - (this.buttonWidth / 2);
		var hightButton = 25;
		var posyOk = this.height - hightButton;
		this.buttonClose = new rialto.widget.Button(posyOk, 
									posxOk, 
									maskat.ui.Dialog.OK, 
									maskat.ui.Dialog.OK
									);
		this.buttonClose.onclick = function () {
			oThis.popup.closeWindow();
			oThis.onClick();
		};
		this.popup.add(this.buttonClose);
	},

	/**
	 * ダイアログサイズを算出します
	 *
	 * @param minWidth 最小幅
	 * @param minHeight 最小高さ
	 */
	getOffset: function (minWidth, minHeight) {
		var div = document.createElement("DIV");
		div.innerHTML = this.message;
		div.style.position = "absolute";
		div.style.visibility = "hidden";
		div.style.whiteSpace = "nowrap";
		document.body.appendChild(div);
		this.width = div.offsetWidth < minWidth ? minWidth : div.offsetWidth + 0;
		this.width = this.width * 1.05;
		this.height = div.offsetHeight < minHeight ? minHeight : div.offsetHeight;
		this.height += 50;
		document.body.removeChild(div);
		div = null;
	}
});
