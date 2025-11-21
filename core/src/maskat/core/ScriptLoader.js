/*
 * Copyright (c)  2006-2007 Maskat Project.
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
 * 複数の JavaScript ファイルを指定した順序で同期してロードするための
 * ユーティリティです。
 * 
 * @name maskat.core.ScriptLoader
 */ 
maskat.lang.Class.declare("maskat.core.ScriptLoader", {

	/** @scope maskat.core.ScriptLoader.prototype */

	/**
	 * コンストラクタです。
	 * 
	 * @param urls JavaScriptファイルのurlの配列
	 */
	initialize: function(urls) {
		this.urls = urls || [];
		this.callback = null;
	},

	/**
	 * 引数のJavaScriptファイルのurlをurlsに追加します。
	 * 
	 * @param url JavaScriptファイルのurl
	 */
	add: function(url) {
		this.urls[this.urls.length] = url;
	},
	
	/**
	 * 引数のcallback関数をonloadに代入し、loadNextを実行する。 
	 * 
	 * @param callback CallBack関数
	 */
	start: function(callback) {
		this.onload = callback;
		this.loadNext();
	},
	
	/**
	 * urlsにあるJavaScriptファイルをHTMLのhead属性の子要素として
	 * 追加しロードを行う。全てのJavaScriptのロード完了後に
	 * callback関数を実行する。
	 */
	loadNext: function() {
		/* すべてのロードが完了した場合にはコールバックを実行 */
		if (this.urls.length == 0) {
			this.onload();	
			return;
		}

		/* script 要素を生成 */
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = this.urls.shift();

		/* ロード完了時に後続のスクリプトをロードするように設定 */
		var self = this;
		var complete = false;
		script.onload = function() {
			if (!complete) {
				complete = true;
				self.loadNext();
			}
		};
		script.onreadystatechange = function() {
			if (this.readyState == "complete" || this.readyState == "loaded") {
				this.onload();
			}
		};

		/* head 要素の子要素に追加してロードを開始する */
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(script);
		script.onreadystatechange();
	},

	/**
	 * callback関数
	 */
	onload: function() {
		/* NOP */
	}

});
