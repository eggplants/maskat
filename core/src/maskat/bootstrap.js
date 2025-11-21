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
 * @namespace
 * マスカットフレームワークが使用するクラス、関数、オブジェクトを格納する
 * 名前空間です。
 * 
 * <p>
 * マスカットフレームワークは多数の JavaScript ライブラリと共存することを
 * 念頭に設計されているため、コアモジュールはグローバル名前空間や組み込み
 * オブジェクトの prototype プロパティを汚染しないように設計されています。
 * ただし、プラグインが読み込むサードパーティ製の JavaScript ライブラリに
 * ついてはこの限りではありません。
 * </p>
 */
var maskat = {

	/** マスカットフレームワークのバージョン識別子 */
	version: "@version@.@build@",

	/** HTML 文書の読み込み完了後にコールバックする関数のリスト */
	loaders: [],

	/** HTML 文書からマスカットフレームワークへの相対パス */
	location: null,

	/** マスカットアプリケーションのインスタンスへの参照 */
	app: null,

	/** マスカットアプリケーションで最後に発生したエラーへの参照 */
	error: null,

	/**
	 * 起動ステージ 1:
	 *
	 * HTML 文書の読み込み完了後、onload イベントの発生より以前の段階で
	 * 実行されます。プラグインのインストールとアプリケーションの起動を
	 * 行います。
	 */
	bootstrap: function(){
		/* この関数が 1 回だけ実行されることを保証する */
		var self = arguments.callee;
		if (self.initialized) {
			return;
		}
		self.initialized = true;

		for (var i = 0, len = maskat.loaders.length; i < len; i++) {
			maskat.loaders[i].call(this);
		}
	}
};

/**
 * 起動ステージ 0:
 * 
 * この関数は maskat.js の読み込み時に実行され、HTML 文書の読み込みが
 * 完了後にできるだけ早い段階で起動ステージ 1 (bootstrap 関数) が実行
 * されるようにハンドラ関数 (bootstrap) を登録します。
 */
(function (){
	/*
	 * Internet Explorer の場合:
	 *
	 * script 要素の defer 属性と onreadystatechange イベントを利用し、
	 * onload イベントの発生前にマスカットフレームワークを初期化する
	 */
	if (navigator.userAgent.indexOf("MSIE") != -1) {
		var callback = function() {
			if (this.readyState == "complete") {
				maskat.bootstrap();
			}
		};
		document.onreadystatechange = callback;
		document.write('<script id="__init_script" defer="true" src="//:"></script>');

		if (document.getElementById) {
			var deferScript = document.getElementById("__init_script");
			if (deferScript) {
				deferScript.onreadystatechange = callback;
				/* 読み込みが既に完了しているかどうかを確認 */
				deferScript.onreadystatechange();
				deferScript = null;
			}
		}
	}
	
	/*
	 * Firefox (Gecko) , Safariの場合:
	 *
	 * DOMContentLoaded イベントを利用し、onload イベントの発生前に
	 * マスカットフレームワークを初期化する
	 */
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", maskat.bootstrap, false);
	}
	
	/* その他のブラウザでは onload イベントを利用, Safariは処理を回避する */
	if (navigator.userAgent.indexOf('Safari/') == -1) {
		window.onload = maskat.bootstrap;
	}

	/*
	 * デフォルトエラーハンドラ関数の指定
	 *
	 * ユーザがwindow.onerrorに関数を定義することで任意のエラー
	 * 処理を行うことができます
	 */
	window.onerror = function(message, url, line) {
		var logger = maskat.log.LogFactory.getLog("maskat.error");
		/*
		 * LoadJavaScriptCommandメソッドで読み込まれるJavaScriptに
		 * 文法エラーがある場合、maskat.app.handleErrorを経由しません。
		 */
		if (maskat.error) {
			message = maskat.error.getMessages ?
				maskat.error.getMessages().join("\n  Caused by: ") :
				maskat.error.message;
		}
		if (url != "" || line != 0) {
			message += "\n  url: " + url + "\n  line: " + line;
		}
		logger.error(message, maskat.error);
		
		if (maskat.error) {
			var e = maskat.error.getCauseError ?
				maskat.error.getCauseError() : maskat.error;
				
			if (e instanceof maskat.lang.Error) {
				return true;
			}
		}
		return false;
	}
	
})();
