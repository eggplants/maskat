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
 * XMLHttpRequest のプーリング機構を持つ通信マネージャです。
 *
 * <p>
 * 送信キューにコンテキスト (maskat.comm.HttpContext のインスタンス) を追加
 * することにより通信がスケジューリングされ、通信処理の各段階でコンテキスト
 * のコールバック関数が実行されます。
 * </p>
 * 
 * @name maskat.comm.CommunicationManager
 */
maskat.lang.Class.declare("maskat.comm.CommunicationManager", {
	
	_static: {
		/** @scope maskat.comm.CommunicationManager */

		/** 送信キューを処理する間隔 (ms) */
		sendInterval: 100,

		/** HTTP 応答待ちのタイムアウトを確認する間隔 (ms) */
		timeoutInterval: 500,

		/** XMLHttpRequest のプールサイズ */
		poolSize: 2,

		/**
		 * このクラスの唯一のインスタンスを返します。(Singleton パターン)
		 *
		 * @returns このクラスの唯一のインスタンス
		 */
		getInstance: function() {
			var self = arguments.callee;
			if (!self.instance) {
				self.instance = new this(this.sendInterval,
					this.timeoutInterval, this.poolSize);
			}
			return self.instance;
		}
	},
	
	/** @scope maskat.comm.CommunicationManager.prototype */
	
	/**
	 * コンストラクタです。
	 *
	 * @param sendInterval 送信キューを処理する間隔 (ms)
	 * @param timeoutInterval HTTP 応答待ちのタイムアウトを確認する間隔 (ms)
	 * @param poolSize XMLHttpRequest のプールサイズ
	 */
	initialize: function(sendInterval, timeoutInterval, poolSize){
		this.queue = [];
		this.waitings = [];
		this.completed = [];
		this.locked = false;

		/* HTTP 要求送信スレッドの生成 */		
		this.senderThread = new maskat.lang.Thread(
			this,
			this.processRequest,
			null,
			sendInterval || 100);

		/* タイムアウト確認スレッドの生成 */		
		this.timeoutThread = new maskat.lang.Thread(
			this,
			this.checkTimeout,
			null,
			timeoutInterval || 500);

		/* XMLHttpRequest プールの生成 */		
		this.initPool(poolSize || 2);
	},
	
	/**
	 * XMLHttpRequest をプールから取得します。
	 * プールがすべて利用されている場合には新しいインスタンスを生成します。
	 *
	 * @returns XMLHttpRequest のインスタンス
	 */
	getXMLHttpRequest: function() {
		if (this.pool.length) {
			return this.pool.shift();
		}
		return maskat.util.CrossBrowser.createXMLHttpRequest();
	},

	/**
	 * XMLHttpRequest のプールをパラメータで指定されたサイズで初期化します。
	 *
	 * @param size XMLHttpRequest のプールサイズ 
	 */
	initPool: function(size) {
		this.poolSize = size;
		this.pool = [];
		for (var i = 0; i < size; i++) {
			this.pool[this.pool.length] = maskat.util.CrossBrowser.createXMLHttpRequest();
		}
	},
	
	/**
	 * XMLHttpRequest のプールサイズをパラメータで指定されているサイズまで
	 * 縮小します。
	 */
	shrinkPool: function() {
		for (var i = this.poolSize, len = this.pool.length; i < len; i++) {
			delete this.pool[i];
		}
		this.pool.length = this.poolSize;
	},
	
	/**
	 * HTTP コンテキストを送信キューに追加し、通信をスケジュールします。
	 *
	 * @param context 送信コンテキスト
	 */
	enqueue: function(context){
		this.queue[this.queue.length] = context;
		/*
		 * 送信キューが空の場合は送信スレッドは停止状態しているため、
		 * スレッドを開始する
		 */
		if (this.queue.length == 1) {
			this.senderThread.start();
		}
	},

	/**
	 * 送信待ちキューからコンテキストを取得し、HTTP 要求を実行します。
	 *
	 * このメソッドは HTTP 要求送信スレッドから、パラメータで指定された
	 * インターバルで起動されます。
	 */
	processRequest: function() {
		/* 他のコンテキストが同期通信中の場合はロック開放まで待機 */
		if (this.locked) {
			return;
		}

		/* 同期通信の場合はロックを取得 */
		var context = this.queue.shift();
		this.locked = !context.async;

		/* 送信キューが空になった場合、送信スレッドを停止する */
		if (!this.queue.length) {
			this.senderThread.stop();
		}

		/* XMLHttpRequest にパラメータとコールバック関数を設定 */
		try {
			var xhr = this.getXMLHttpRequest();
			context.xhr = xhr;
			context.setStatus(maskat.comm.HttpContext.READY);
			
			var self = this;
			xhr.open(context.method, context.url, true);
			xhr.onreadystatechange = function(){
				self.processResponse(context);
			};
		} catch (e) {
			this.finishProcess(context, e);
			return;
		}
		
		/*
		 * リクエストヘッダの設定:
		 * 
		 * XHR をプールから再利用した場合でも、open() メソッドを実行すると
		 * 以前に設定されていたリクエストヘッダはクリアされる
		 */
		var headers = context.requestHeaders;
		if (headers) {
			for (var n in headers) {
				xhr.setRequestHeader(n, headers[n]);
			}
		}

		/*
		 * 応答待ちリストが空の場合、タイムアウト監視スレッドは停止状態なので
		 * スレッドを開始する
		 */
		if (!this.waitings.length) {
			this.timeoutThread.start();
		}

		/* HTTP 要求を送信し、コンテキスト応答待ちリストに追加する */
		this.waitings[this.waitings.length] = context;
		context.sentAt = (new Date()).getTime();
		
		xhr.send(context.requestMessage);
        
		try {
			context.setStatus(maskat.comm.HttpContext.WAIT);
			this.processResponse(context);
		} catch (e) {
			/*
			 * openされたXHRはsend完了もしくはabortされるまで占有されます。
			 * FireFoxではopen後のabortで発生するreadyStateはcomplete(4)
			 */
			if (context.xhr) {
				try {
					context.xhr.onreadystatechange = null;
				} catch (ex) {
					context.xhr.onreadystatechange = function() {};
				}
				context.xhr.abort();
			}
			this.finishProcess(context, e);
			return;
		}
		
		/*
		 * Firefox の同期通信は送信処理が終わるまで send 関数から復帰せず、
		 * onreadystatechange 関数を呼び出さない
		 */
/*
		if (navigator.appName == "Netscape" && !context.async) {
			if (context.status == maskat.comm.HttpContext.WAIT) {
				this.processResponse(context);
			}
		}
 */
	},
	
	/**
	 * サーバからの HTTP 応答時に通信ステータスを確認し、送信コンテキストの
	 * コールバック関数を実行します。
	 *
	 * @param context 送信コンテキスト
	 */
	processResponse: function(context) {
		var xhr = context.xhr;
		/*
		 * FireBugを利用している場合、処理済リクエストのonreadystatechange
		 * が再度呼び出される。context.xhrは既に削除されており存在しない。
		 */
		if (!xhr || context.status != maskat.comm.HttpContext.WAIT) {
			return;
		}
		var error;
		if (xhr.readyState == 4) {
			try {
				maskat.util.CrossBrowser.checkHttpError(xhr, { url: context.url });
				
				if (xhr.status == 200) {
					maskat.util.CrossBrowser.checkParseError(xhr.responseXML);
				}
				context.responseMessage = xhr.responseText;
				context.responseXML = xhr.responseXML;
				context.responseHeaders = this.parseResponseHeaders(
						xhr.getAllResponseHeaders());

				/*
				 * ロック中 (同期通信中) に非同期処理が完了した場合には
				 * 同期通信の完了を待つ
				 */
				if (context.async && this.locked) {
					this.completed[this.completed.length] = context;
				} else {
					context.setStatus(maskat.comm.HttpContext.COMPLETE);
				}
			} catch (e) {
				error = e;

			} finally {
				this.finishProcess(context, error);
			}
		}
	},
	
	/**
	 * レスポンスヘッダ文字列を解析し、ヘッダ名と値のペアを要素とする配列を
	 * 返します。
	 *
	 * @param headers すべてのレスポンスヘッダを含んだ文字列
	 * <pre>
	 *     "name1:value1\nname2:value2\n..."
	 * </pre>
	 *
	 * @returns レスポンスヘッダの解析済み配列
	 * <pre>
	 *     {
	 *         name1: "value1",
	 *         name2: "value2",
	 *         ...
	 *     }
	 * </pre>
	 */
	parseResponseHeaders: function(headers) {
		if (!headers) {
			return null;
		}

		var result = {};
		var lines = headers.split(/\r?\n/);
		var pair;
		for (var i = 0, len = lines.length; i < len; i++) {
			if (lines[i].length > 1) {
				/* レスポンスヘッダ行を名前／値ペアに分割する */
				pair = lines[i].split(/\s*:\s*/);
				if (typeof(pair[1]) == "undefined") {
					pair[1] = "";
				}
				if (result[pair[0]]) {
					result[pair[0]] = result[pair[0]] + " " +
						pair[1].replace(/, /g, " ");
				} else {
					result[pair[0]] = pair[1].replace(/, /g, " ");
				}
			}
		}
		return result;
	},

	/**
	 * 指定した送信コンテキストに関する通信処理を終了し、使用していたリソース
	 * を解放します。
	 *
	 * @param context 通信が終了したコンテキスト
	 * @param error 発生したエラー（正常時はundefined)
	 */
	finishProcess: function(context, error) {
		
		/* XMLHttpRequest をプールに戻す */
		if (context.xhr) {
			this.pool[this.pool.length] = context.xhr;
			delete context.xhr;
		}
		/* 応答待ちリストからコンテキストを削除 */
		for (var i = 0, len = this.waitings.length; i < len; i++) {
			if (context === this.waitings[i]) {
				this.waitings.splice(i, 1);
				break;
			}
		}
		
		/* 応答待ちリストが空の場合、タイムアウト監視スレッドを停止 */
		if (!this.waitings.length) {
			this.waitings.length = 0;
			this.timeoutThread.stop();
			this.shrinkPool();
		}

		/*
		 * 同期通信が終了した場合、ロックフラグの解除を待っている非同期通信の
		 * 結果をリリースする
		 */
		if (!context.async) {
			for (var i = 0, len = this.completed.length; i < len; i++) {
				try {
					this.completed[i].setStatus(maskat.comm.HttpContext.COMPLETE);
				} catch (e) {
					this.completed[i].error = e;
					try {
						this.completed[i].setStatus(maskat.comm.HttpContext.ERROR);
					} catch (ex) { /* suppress */ }
				}
			}
			this.completed.length = 0;
			this.locked = false;
		}
		/*
		 * エラー発生による finishProcess 呼び出し
		 * 処理中断 (InterruptedError) による呼び出しはステータス変更を行わない
		 */
		if (error && !(error instanceof maskat.lang.InterruptedError)) {
			context.error = error;
			try {
				context.setStatus(maskat.comm.HttpContext.ERROR);
			} catch (e) { /* suppress */ }
		}
	},

	/**
	 * HTTP 応答待ちのキューを走査し、タイムアウト時間が経過している場合に
	 * タイムアウト処理を発生させます。
	 *
	 * <p>
	 * このメソッドはタイムアウト処理スレッドから、パラメータで指定された
	 * インターバルで起動されます。
	 * </p>
	 */
	checkTimeout: function() {
		var context;
		for (var i = 0, len = this.waitings.length; i < len; i++) {
			context = this.waitings[i];
			if (context.isTimeout()) {
				try {
					context.setStatus(maskat.comm.HttpContext.TIMEOUT);
				} catch (e) {
					context.error = e;
				}

				/*
				 * Internet Explorer で abort メソッドを実行した場合、
				 * onreadystatechange 関数が呼び出されます。このとき xhr の
				 * status プロパティは 0 に設定されます。
				 *
				 * FireFox では NS_ERROR_NOT_AVAILABLE エラーが発生するため、
				 * onreadystatechange関数を無効にしてから abort メソッドを
				 * 実行します。
				 */
				try {
					context.xhr.onreadystatechange = null;
				} catch (ex) {
					context.xhr.onreadystatechange = function() {};
				}
				context.xhr.abort();
				this.finishProcess(context);
			}
		}
	}
});

