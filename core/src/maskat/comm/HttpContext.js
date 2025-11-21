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
 * Ajax クライアントの内部で実行される個々の HTTP 要求・応答の組み合わせと
 * 通信状態をオブジェクト (送信コンテキスト) として表現します。
 *
 * <p>
 * 送信コンテキストは以下のいずれかの状態を持ちます:
 * </p>
 * <ul>
 *   <li>INIT: 初期状態</li>
 *   <li>READY: HTTP 要求の送信準備が完了した状態</li>
 *   <li>WAIT: HTTP 要求の応答待ちの状態</li>
 *   <li>COMPLETE: HTTP 要求の応答を受信した状態を表す定数</li>
 *   <li>ERROR: HTTP 要求の処理時にエラーが発生した状態</li>
 * </ul>
 *
 * <p>
 * 送信コンテキストの使用例を以下に示します。この例ではサーバに対してテキスト
 * ファイルの取得を非同期で要求し、応答の受信時にアラードダイアログでその内容
 * を表示します。
 * </p>
 * <pre>
 * var context = new maskat.comm.HttpContext("GET", "/foo.txt", { async: true });
 * context.onComplete = function() {
 *     alert(this.responseMessage);
 * };
 * context.send();
 * </pre>
 *
 * @name maskat.comm.HttpContext
 */ 
maskat.lang.Class.declare("maskat.comm.HttpContext", {

	_static: {
		/** @scope maskat.comm.HttpContext */

		/** 初期状態を表す定数 */
		INIT: 1,

		/** HTTP 要求の送信準備が完了した状態を表す定数 */
		READY: 2,

		/** HTTP 要求の応答待ちの状態を表す定数 */
		WAIT: 3,

		/** HTTP 要求の応答を受信した状態を表す定数 */
		COMPLETE: 4,

		/** HTTP 要求の処理時にエラーが発生した状態を表す定数 */
		ERROR: 5,

		/** HTTP 要求の応答待ちタイムアウトが発生した状態を表す定数 */
		TIMEOUT: 6
	},
	
	/** @scope maskat.comm.HttpContext.prototype */
	
	/**
	 * コンストラクタです。
	 *
	 * @param method HTTP 要求メソッド ("GET", "POST", "UPDATE", "DELETE" など)
	 * @param url 接続先の URL
	 * @param param 通信パラメータ
	 * <pre>
	 * {
	 *     async:
	 *         同期・非同期通信を制御するフラグ (true: 非同期／false: 同期) 
	 *     timeout:
	 *         タイムアウト時間(ms)
	 *         0 または未指定の場合はタイムアウトを発生させない
	 *     requestHeaders:
	 *         HTTP 要求ヘッダを格納したハッシュ
	 * }
	 * </pre>
	 */
	initialize: function(method, url, param){
		this.status = maskat.comm.HttpContext.INIT;
		
		this.url = url;
		this.method = method || "GET";
		this.async = param.async;
		this.sentAt = null;
		this.timeout = param.timeout? param.timeout : 0;
		this.requestHeaders = {};
		this.requestMessage = param.request;
		this.responseHeaders = [];
		this.responseMessage = "";
		this.error = null;
		
		this.requestHeaders["Content-Type"] = "application/xml";
		this.requestHeaders["If-Modified-Since"] = "Thu, 01 Jun 1970 00:00:00 GMT";

		var headers = param.headers;
		if (headers) {
			for (var i = 0, len = headers.length; i < len; i++) {
				this.requestHeaders[headers[i].name] = headers[i].value;
			}
		}
	},

	/**
	 * HTTP 要求をサーバに送信します。
	 */
	send: function() {
		maskat.comm.CommunicationManager.getInstance().enqueue(this);
	},

	/**
	 * コンテキストの通信ステータスを設定します。
	 *
	 * @param status 新しい通信ステータス
	 */
	setStatus: function(status) {
		if (this.status != status) {
			try {
				this.stateChanged(status);
			} finally {
				this.status = status;
			}
		}
	},

	/**
	 * このコンテキストの通信ステータスが変更されたことを通知します。
	 *
	 * @param status 新しい通信ステータス
	 */
	stateChanged: function(status){
		switch (status) {
		case maskat.comm.HttpContext.READY:
			this.onReady();
			break;
		case maskat.comm.HttpContext.WAIT:
			this.onWait();
			break;
		case maskat.comm.HttpContext.COMPLETE:
			this.onComplete();
			break;
		case maskat.comm.HttpContext.TIMEOUT:
			this.onTimeout();
			break;
		case maskat.comm.HttpContext.ERROR:
			this.onError();
			break;
		default:
			break;
		}
	},

	/**
	 * 送信キューがキューイングされた場合に呼び出されるコールバックメソッドです。
	 */
	onReady: function(){
		/* NOP */
	},
	
	/**
	 * HTTP 要求を送信する直前に呼び出されるコールバックメソッドです。
	 */
	onWait: function(){
		/* NOP */
	},
	
	/**
	 * HTTP 応答を受信した直後に呼び出されるコールバックメソッドです。
	 */
	onComplete: function(){
		/* NOP */
	},
	
	/**
	 * HTTP 要求の応答待ちがタイムアウトした場合に呼び出されるコールバック
	 * メソッドです。
	 */
	onTimeout: function(){
		/* NOP */
	},

	/**
	 * 通信エラー発生時に呼び出されるコールバックメソッドです。
	 *
	 * このメソッドの実行時は、コンテキストの error プロパティで発生した
	 * エラーを参照することができます。
	 */
	onError: function(){
		/* NOP */
	},

	/**
	 * HTTP 要求の応答待ちがタイムアウトしているかどうかを返します。
	 *
	 * @returns 応答待ちがタイムアウトしている場合は true
	 */
	isTimeout: function(){
		if (!this.sentAt || !this.timeout) {
			return false;
		}
		var now = (new Date()).getTime();
		return (now - this.sentAt) >= this.timeout;
	}
	
});


