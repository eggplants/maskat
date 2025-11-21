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
maskat.lang.Class.declare("maskat.widget.compat.ConfirmDialog")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

    createWidget: function(parent) {
    	var width = getTailleTexte(this.title) + 40;
		if (width < 300) {
			width = 300;
		}
	
		/* ダイアログとして表示するポップアップウィンドウを生成 */
		var popup= new rialto.widget.PopUp(
			this.name,
			0,
			0,
			width,
			50,
			null,
			this.title,
			"Gris",
			{ withCloseButon: false });
	    this.widget = popup;
		this.setVisible(false);

		var div = document.createElement("div");
		div.innerHTML = this.message;
		popup.getHtmlCont().appendChild(div);

		/* OK ボタンを生成 */
	    var self = this;
		var okButton = new rialto.widget.Button(
			25,
			parseInt(width) / 2 - 114,
			this.btnOKTxt,
			this.btnOKTxt,
			popup);
		okButton.onclick = function(e) {
			popup.setVisible(false);
			if (self.onOK) {
				self.onOK();
			}
			self.proceed();
		}
		okButton.getHtmlExt().tabIndex = 32767;

		/* キャンセルボタンを生成 */
		var cancelButton = new rialto.widget.Button(
			25,
			parseInt(width) / 2 + 6,
			this.btnCancelTxt,
			this.btnCancelTxt,
			popup);
		cancelButton.onclick = function(e) {
			popup.setVisible(false);
			if (self.onCancel) {
				self.onCancel();
			}
		}
		cancelButton.getHtmlExt().tabIndex = 32767;
		
		/* キーイベントハンドラを設定 */
		var keyHandler = function(event) {
			maskat.key.KeyEventManager.getInstance().handle(event);
		};
		maskat.util.CrossBrowser.addEventListener(
			popup.getHtmlExt(), "keydown", keyHandler);
    },

	handleKeyEvent: function(event) {
		var element = event.target || event.srcElement;
		switch (event.keyCode) {
		case 13:
		case 32:
			element.onclick(event);
			break;
		case 9:
		case 37:
		case 39:
			var buttons = this.widget.arrChild;
			var pos = (buttons[0].getHtmlExt() === element ? 1 : 0);
			buttons[pos].getHtmlExt().focus();
			break;
		}
		return false;
	},

	setParent: function(parent) {
		if (this.parent == parent) {
			return;
		}
		this.parent = parent;
	},

	setVisible: function(visible) {
		if (visible) {
			/* ブラウザウインドウの中央に表示する */
			this.widget.setTop((document.body.clientHeight - 240) / 2);
			this.widget.setLeft((document.body.clientWidth - this.widget.width) / 2);
		}
		this.widget.setVisible(visible);
		
		/*
		 * 指定されたボタンにフォーカスを設定
		 * IEはフォーカスが移動できる状態でないとエラーとなる
		 */
		if (visible) {
			if (this.btnOnFocus == 1){
				this.widget.arrChild[0].getHtmlExt().focus();
			} else {
				this.widget.arrChild[1].getHtmlExt().focus();
			}
		}
	},

	proceed: function() {
		/* NOP */
	}
});
