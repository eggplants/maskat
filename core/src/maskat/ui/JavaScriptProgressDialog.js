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
 * @class JavaScriptの進捗ダイアログを表示するクラスです。
 *
 * @name maskat.ui.JavaScriptProgressDialog
 * @extends maskat.ui.ProgressDialog
 */
maskat.lang.Class.declare("maskat.ui.JavaScriptProgressDialog")
	.extend("maskat.ui.ProgressDialog", {

	/** @scope maskat.ui.JavaScriptProgressDialog.prototype */

	/**
	 * javascriptの進捗ダイアログコンストラクタです。
	 *
	 * @param title ダイアログのタイトル文字列
	 * @param message ダイアログメッセージ文字列
	 * @param total 終了進捗値(オプション、正数) 、または、
	 *              doneを実行するまで終了しない処理中表示(POSITIVE_INFINITY)
	 */
	initialize: function(title, message, total) {
	
		/* 引数を内部メンバとして設定 */
		this.base.apply(this, arguments);
		
		/* 表示タイプの判定 */
		if (this.total == Number.POSITIVE_INFINITY) {
			this.endlessMode = true;
		} else {
			this.endlessMode = false;
		}
		
		/* totalのデフォルト設定 */
		if (!this.total) {
			this.total = 100;
		}
		
		/* 改行文字列の置換 */
		this.setMessage(this.message);
		
		/* ウインドウサイズを取得 (最小サイズ幅:250 高:50)  */
		this.getOffset(250, 50);
		
		/* カレントの進捗値 */
		this.count = 0;
	},

	/**
	 * javascriptの進捗ダイアログをPOPUPして表示します。
	 *
	 */
	open: function () {
	
		/* ダイアログボックス表示 */
		if (!this.popup || this.popup.closed) {
			var windowParameter = "width=" + this.width;
			windowParameter += ",height=" + this.height;
			windowParameter += ",resizable=no,scrollbars=no,directories=no,location=no,menubar=no,status=no,toolbar=no";
			this.popup = window.open("", this.title, windowParameter); 
		} else {
		    /*  既にウィンドウが開いている場合はフォーカスを当てる */
		    this.popup.focus();
		    return;
		}
		
		var doc = this.popup.document;

		/* Title, Bodyの設定 */
		doc.open();
		doc.write("<head><title>" + this.title + "</title></head>");
		doc.close();
		doc.bgColor = "#DCDCDC"
		
		/* メッセージの表示 */
		this.divMsg = doc.createElement ("div");
		this.divMsg.id = "processingMessage";
		this.setMessage(this.message);
		doc.body.appendChild(this.divMsg);
		
		/* 進捗バーの位置・サイズ算出 */
		this.barWidth = this.width * 0.9;
		var barHeight = 16; 
		var barTop = this.height - (barHeight + 20);
		var barLeft = this.width * 0.02;
		
		/* 進捗バー表示枠の設定(共通) */
		var progressFrame = doc.createElement("div");
		progressFrame.id = "progressFrame";
		progressFrame.style.top = barTop;
		progressFrame.style.position = "absolute";
		
		if (this.endlessMode) {
			/* 進捗バー表示枠の設定 */
			progressFrame.style.left = (this.width - this.barWidth) / 2;

			/* 進捗バーの設定 */
			var imgTag = doc.createElement("img");
			imgTag.src = maskat.location + "core/images/endless_progress.gif";
			imgTag.width = this.barWidth;
			imgTag.height = 14;
			
			/* 進捗バーの追加 */
			progressFrame.appendChild(imgTag);
			doc.body.appendChild(progressFrame);
		} else {
			/* 進捗率の設定 */
			var rateMargin = 35;
			var rateText = doc.createElement("div");
			rateText.id = "rate";
			rateText.style.position = "absolute";
			rateText.style.top = barTop;
			rateText.style.left = barLeft;
			rateText.innerHTML = "0%";
			
			/* 進捗率表示領域の確保 */
			this.barWidth = this.barWidth - rateMargin;
			
			/* 進捗バー表示枠の設定 */
			progressFrame.style.left = barLeft + rateMargin;
			progressFrame.style.width = this.barWidth;
			progressFrame.style.height = barHeight;
			progressFrame.style.backgroundColor = "white"; 
			progressFrame.style.borderColor = "black";
			progressFrame.style.borderStyle = "solid";
			progressFrame.style.borderWidth = "1px"; 
			progressFrame.className = "progressFrame";
			
			/* 進捗バーの設定 */
			var progressBar = doc.createElement("div");
			progressBar.id = "progressBar";
			progressBar.style.top = barTop;
			progressBar.style.left = barLeft + rateMargin;
			progressBar.style.width = 0;
			progressBar.style.height = barHeight;
			var barColor = "#003399";
			progressBar.style.backgroundColor = barColor;
			progressBar.style.borderColor = barColor;
			progressBar.style.borderStyle = "solid";
			progressBar.style.borderWidth = "1px"; 
			progressBar.style.position = "absolute";
			progressBar.className = "progressBar";
			
			/* 進捗率、進捗バーの追加 */
			doc.body.appendChild(rateText);
			doc.body.appendChild(progressFrame);
			doc.body.appendChild(progressBar);
		}
	},
	
	/**
	 * javascriptの進捗状況ウィンドウの進捗状況を更新します。
	 *
	 * @param count 進捗総数（正数） 
	 */
	setProgress: function(count) {
		
		/* 値の補正 */
		if (count < 0) {
			this.count = 0;
		} else if (count > this.total) {
			this.count = this.total;
		} else {
			this.count = count;
		}
		
		/* 表示の更新 */
		this.updateProgress();
		
		/* 表示の終了 */
		if (this.count >= this.total) {
		   this.close();
		}
		
	},
	
	/**
	 * javascriptの進捗状況ウィンドウの進捗状況を加算更新します。
	 *
	 * @param addValue 進捗数（正数）
	 */
	worked: function(addValue) {
	    this.setProgress(Number(addValue) + Number(this.count));
	},
	
	/**
	 * 進捗状況ウィンドウを閉じるための前処理を実行します。
	 *
	 */
	done: function() {
		if (this.endlessMode) {
			this.close();
		} else {
			this.setProgress(this.total);
		}
	},
	
	
	/**
	 * 進捗状況ウィンドウを閉じます。
	 *
	 */
	 close: function() {
		/* 更新対象の存在チェック */
		if (!this.popup || this.popup.closed) {
		    return;
		}
	    
		/* 進捗状況ウィンドウの破棄 */
		this.popup.window.close();
		this.popup = null;
		this.count = 0;
	 },
	
	
	/**
	 * 進捗状況ウィンドウの進捗状況を更新します。
	 *
	 */
	updateProgress: function() {
	
		/* 進捗率表示無し */
		if (this.endlessMode) {
			return;
		}
		
		/* 更新対象の存在チェック */
		if (!this.popup || this.popup.closed) {
		    return;
		}
		
		/* 進捗率の計算 */
		var rate = this.count * 100 / this.total;
		this.popup.document.getElementById("rate").innerHTML 
					= Math.round(rate) + "%"; 
		
		/* 進捗バーの更新 */
		this.popup.document.getElementById("progressBar").style.width 
					= (this.barWidth * rate) / 100;
	    this.popup.focus();
	},
	
	/**
	 * メッセージを表示するdivを作成し、ダイアログサイズを算出します
	 *
	 * @param minWidth 最小幅
	 * @param minHeight 最小高さ
	 */
	getOffset: function(minWidth, minHeight) {
		var div = document.createElement("div");
		div.innerHTML = this.message;
		div.style.position = "absolute";
		div.style.visibility = "hidden";
		div.style.whiteSpace = "nowrap";
		div.id = "processingMessage";
		
		document.body.appendChild(div);
		
		this.width = div.offsetWidth < minWidth ? minWidth
		                 : div.offsetWidth;
		this.width *= 1.05;
		this.height = div.offsetHeight < minHeight ? minHeight
		                 : div.offsetHeight;
		this.height += 50;
		
		document.body.removeChild(div);
		div = null;
	},

	/**
	 * 表示中のメッセージを置き換えます
	 * 制限として、メッセージの長さによるウィンドウのリサイズは行いません
	 *
	 * @param message 置き換え後のメッセージ文字列
	 */
	setMessage: function(message) {
		
		this.message = message.replace(/\r?\n/g, "<br>"); 
		
		/* ウィンドウが存在し、閉じれれていない場合 */
		if (this.popup && !this.popup.closed) {
			this.divMsg.innerHTML = this.message;
		    /*  フォーカスを当てる */
	    	this.popup.focus();
		}
	}

});
