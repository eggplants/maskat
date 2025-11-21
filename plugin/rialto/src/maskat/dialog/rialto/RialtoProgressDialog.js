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
 
maskat.lang.Class.declare("maskat.dialog.rialto.RialtoProgressDialog")
	.extend("maskat.ui.ProgressDialog", {

	/**
	 * Rialtoの進捗ダイアログコンストラクタ
	 *
	 * @param title ダイアログのタイトル文字列
	 * @param message ダイアログメッセージ文字列
	 * @param total 終了進捗値(オプション) または、doneを実行するまで終了しない処理中表示(POSITIVE_INFINITY)
	 */
	initialize: function (title, message, total) {
	
		/* 引数を内部メンバとして設定 */
		this.base.apply(this, arguments);
		
		/* totalのデフォルト設定 */
		if (!this.total || this.total == "") {
			this.total = 100;
		}
		
		/* 表示タイプの判定 */
		this.endlessMode = false;
		if (this.total == Number.POSITIVE_INFINITY) {
			this.endlessMode = true;
			this.total = 100;
		}
		
		/* 改行文字列の置換 */
		if (typeof(this.message) == "string") {
			this.message = this.message.replace( /\r?\n/g, "<br />\n");
		}

		/* ウインドウサイズを取得 (最小サイズ幅:500 高:50)  */
		this.getOffset (250, 50);
		/* 進捗バーの幅 */
		this.barWidth = this.width * 0.8;
		/* カレントの進捗値 */
		this.count = 0;
		/* 進捗バーのElement ID */
		this.barElementId = "";
		this.oThis = this;
		
	},
 
 	/**
	 * Rialtoの進捗ダイアログをPOPUPして表示します。
	 *
	 */
	open: function () {
	
		/* 空ウィンドウのPOPUP */
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
								"transparent", 
								{withCloseButon:false}
								);         

		/* メッセージの表示 */
		var divData = document.createElement("DIV");
		divData.id = 'processingMessage';
		divData.innerHTML = this.message;
		this.popup.add(divData);
		
		/* 進捗バーの位置・サイズ算出 */
		var barHeight = 16; 
		var barTop = this.height - barHeight -10;
		var barLeft = this.width * 0.02;
		
		if (this.endlessMode) {
			
			/* 進捗バー表示枠の設定 */
			var barProgress = document.createElement ("div");
			barProgress.id = 'pbar';
			barProgress.style.top = barTop;
			barProgress.style.left = (this.width - this.barWidth) / 2 - 10;
			barProgress.style.position = "absolute";

			/* 進捗バーの設定 */
			var imagePath = maskat.location + "core/images/"
			var imgTag = document.createElement("img");
			imgTag.src = imagePath + "endless_progress.gif";
			imgTag.width = this.barWidth ;
			imgTag.height = 14;
			
			barProgress.appendChild(imgTag);
			this.popup.add(barProgress);
		
		} else {
		
			/* 進捗率の表示 */
			var rateMargin = 35;
			this.textRate = document.createElement("DIV");
			this.textRate.innerHTML = "0%";
			this.textRate.style.position = "absolute";
			this.textRate.style.top = barTop;
			this.textRate.style.left = barLeft;
			this.popup.add(this.textRate);
			
			/* 進捗率表示領域の確保 */
			this.barWidth = this.barWidth - rateMargin;

			/* 進捗バー枠の表示 */
			var barBorder = document.createElement("DIV");
			barBorder.style.top = barTop;
			barBorder.style.left = barLeft + rateMargin;
			barBorder.style.width = this.barWidth;
			barBorder.style.height = barHeight;
			barBorder.style.backgroundColor = "white"; 
			barBorder.style.borderColor = "black";
			barBorder.style.borderStyle = "solid";
			barBorder.style.borderWidth = "1px"; 
			barBorder.style.position = "absolute";
			this.popup.add(barBorder);

			/* 進捗バーの設定 */
			var barColor = "#003399";
			this.barProgress = document.createElement("DIV");
			this.barProgress.id = "progressBar";
			this.barProgress.style.top = barTop;
			this.barProgress.style.left = barLeft + rateMargin;
			this.barProgress.style.width = 0;
			this.barProgress.style.height = barHeight;
			this.barProgress.style.backgroundColor = barColor;
			this.barProgress.style.borderColor = barColor;
			this.barProgress.style.borderStyle = "solid";
			this.barProgress.style.borderWidth = "1px"; 
			this.barProgress.style.position = "absolute";
			this.popup.add(this.barProgress);
			return this;
			
		}
	},
	
	/**
	 * rialtoの進捗状況ウィンドウの進捗状況を更新します。
	 *
	 * @param count 進捗総数
	 */
	setProgress:function (count) {
		/* 更新対象の存在チェック */
		if (!this.oThis) {
			return;
		}
		if (!this.isNumeric(count)) {
		    return;
		}
		this.count = Number(count);
		/* トータルを超えている場合 */
		if (this.count > this.total) {
			this.count = this.total;
		}
		/* マイナス値の場合 */
		if (this.count < 0) {
			this.count = 0;
		}
		/* 表示の更新 */
		this.updateProgress();
		/* 終了時のClose */
		if (this.count >= this.total) {
			this.oThis.popup.closeWindow();
			this.oThis = null;
		}
	},

	/**
	 * rialtoの進捗状況ウィンドウの進捗状況を加算更新します。
	 *
	 * @param addValue 進捗数
	 */
	worked:function (addValue) {
		if (this.isNumeric(addValue)) {
		    this.setProgress (Number(addValue) + Number(this.count));
		} else {
		    return;
		}
	},

	/**
	 * 進捗状況ウィンドウを閉じます。
	 *
	 */
	done: function() {
		this.setProgress(this.total);
	},

	/**
	 * 進捗状況ウィンドウの進捗状況を更新します。
	 *
	 */
	updateProgress:function () {
	
		/* 進捗率表示無し */
		if (this.endlessMode) {
			return;
		}
		
		/* 更新対象の存在チェック */
		if (!this.oThis) {
		    return;
		}
		
		/* 進捗率の計算 */
		var rate = this.count * 100 / this.total;
		
		this.textRate.innerHTML = Math.round (rate) + "%";
		
		/* 進捗バーの更新 */
		this.barProgress.style.width
					= (this.barWidth * rate) / 100;
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
	},
	
	/**
	 * 先頭にプラス・マイナスを含んだ数字であることをチェックします
	 *
	 */
	isNumeric: function (value) {
		if (typeof(value) != "string") { 
			return true;
		}
		return value.match(/[^+^-][\D]/g) ? false : true;
	},

	/**
	 * 表示中のメッセージを置き換えます
	 * 制限として、メッセージの長さによるウィンドウのリサイズは行いません
	 *
	 * @param newMessage 置き換え後のメッセージ
	 */
	setMessage: function (newMessage) {
	
		/* 更新対象の存在チェック */
		if (!this.oThis) {
			return;
		}
	
		if (typeof(newMessage) != "string") { 
			return;
		}

		newMessage = newMessage.replace( /\r?\n/g, "<br />\n"); 
		document.getElementById('processingMessage').innerHTML = newMessage;
	}

});
