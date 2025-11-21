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
 * @class リモートイベントで行われるローカルデータバインディングを実行するクラスです。
 *
 * @name maskat.event.RemoteEventHandler
 * @extends maskat.event.EventHandler
 */ 
maskat.lang.Class.declare("maskat.event.RemoteEventHandler")
	.extend("maskat.event.EventHandler", {
	
	/** @scope maskat.event.RemoteEventHandler.prototype */
	
	/**
	 * コンストラクタです。
	 */
	initialize: function(){
		this.base.apply(this, arguments);
		this.url = null;
		this.method = "POST";
		this.headers = null;
		this.onBeforeRequest = null;
		this.onAfterResponse = null;
		this.onRequestTimeout = null;
		this.marshaller = null;
		this.unmarshaller = null;
	},

	/**
	 * このイベントハンドラを管理するイベントディスパッチャを設定します。
	 * マスカット部品で発生したイベントは最初にイベントディスパッチャに
	 * 通知され、適切なハンドラが起動されます。
	 *
	 * イベントディスパッチャはレイアウト内のイベント処理に共通する設定を
	 * 保持しています。
	 *
	 * @param dispatcher イベントディスパッチャ
	 */
	setDispatcher: function(dispatcher){
		this.dispatcher = dispatcher;

		/* リモート URL の省略時はデフォルト URL を使用 */
		if (!this.url) {
			this.url = dispatcher.url;
		}

		/* グローバルヘッダを追加 */
		if (dispatcher.headers) {
			this.headers = dispatcher.headers.concat(this.headers || []);
		}
	},

	/**
	 * リモートイベントの処理を行います。
	 *
	 * リモートイベントハンドラはサーバとの XML HTTP 通信によってイベントを
	 * 処理します。レイアウト内のマスカット部品や変数のデータを抽出して要求
	 * メッセージを生成し、サーバに HTTP 要求を送信します。
	 *
	 * @param event マスカット部品で発生したイベント
	 */
	handle: function(event) {
		if (this.marshaller) {
			if (!this.headers) {
				this.headers = [];
			}
			this.headers[this.headers.length] = {
				name:"Content-Type",
				value:this.marshaller.getContentType()
			};
		}
		try {
			/* 要求メッセージのデータバインディングを実行 */
			var context = new maskat.event.RemoteEventContext(this, event);
			context.requestMessage = this.marshal(event.layout);
			context.send();
		} catch (e) {
			event.cancel = true;
			if (!(e instanceof maskat.lang.InterruptedError)) {
				throw new maskat.lang.Error("REQUEST_BIND_ERROR", {
					widgetId: event.widgetId,
					type: event.type
				}, e);
			}
		}
	},

	marshal: function(layout) {
		if (this.marshaller) {
			return this.marshaller.marshal(layout);
		}
		return undefined;
	},

	/**
	 * 応答メッセージの受信処理を行います。
	 *
	 * リモートイベントハンドラは応答メッセージの情報を抽出し、レイアウト内の
	 * マスカット部品や変数に格納します。
	 *
	 * @param event マスカット部品で発生したイベント
	 * @param context 通信終了後のコンテキスト
	 */
	handleResponse: function(event, context){
		/* 応答メッセージのデータバインディングを実行 */
		try {
			var response, errors;
			if (this.unmarshaller) {
				response = this.unmarshaller.normalize(context);
				errors = this.unmarshaller.getError(response);
			}
			if (errors) {
				if (this.unmarshaller.onErrorTele) {
					try {
						if (this.logger.getLevel() <= maskat.log.Log.DEBUG) {
							this.logger.debug(maskat.util.Message.format(
								"HANDLE_ERRORMESSAGE",
								{functionName: this.unmarshaller.onErrorTele.functionName,
								 message: maskat.lang.Object.encodeJSON(errors)}));
						}
						context.errorMessages = errors;
						this.unmarshaller.onErrorTele(event, context);
					} catch (e) {
						if (!(e instanceof maskat.lang.InterruptedError)) {
							throw new maskat.lang.Error("HANDLE_ERRORMESSAGE_ERROR",
								{functionName: this.unmarshaller.onErrorTele.functionName}, e);
						}
						throw e;
					}
				} else {
					throw new maskat.lang.InterruptedError("ERROR_MESSAGE_RECEIVED",
						{message: maskat.lang.Object.encodeJSON(errors)});
				}
			} else {
				this.unmarshal(response, event.layout);
			}
			
		} catch (e) {
			event.cancel = true;
			if (!(e instanceof maskat.lang.InterruptedError)) {
				throw new maskat.lang.Error("RESPONSE_BIND_ERROR", {
					widgetId: event.widgetId,
					type: event.type
				}, e);
			}
			throw e;
		}
		/* イベントハンドラの終了処理を実行 */
		this.finishHandle(event);
	},

	unmarshal: function(response, layout) {
		if (response && this.unmarshaller) {
			this.unmarshaller.unmarshal(response, layout);
		}
	},

	/**
	 * 応答メッセージ待ちのタイムアウト処理を行います。
	 *
	 * 応答メッセージ待ち状態のまま指定されたタイムアウト時間が経過した場合、
	 * タイムアウト処理が起動されます。
	 *
	 * @param event マスカット部品で発生したイベント
	 * @param context 通信終了後のコンテキスト
	 */
	handleRequestTimeout: function(event, context) {
		event.cancel = true;
		if (this.onRequestTimeout) {
			try {
				if (this.logger.getLevel() <= maskat.log.Log.DEBUG) {
					this.logger.debug(maskat.util.Message.format(
						"REQUEST_TIMEOUT_HANDLE",
							{functionName: this.onRequestTimeout.functionName}));
				}
					
				/* タイムアウト発生時のコールバック関数を実行 */
				this.onRequestTimeout(event, context);
			} catch (e) {
				context.error = e;
				this.handleError(event,
					new maskat.lang.Error("REQUEST_TIMEOUT_ERROR",
					{functionName: this.onRequestTimeout.functionName}, e));
			}
		} else {
			/* コールバック関数が指定されていない場合はログを出力 */
			this.handleError(event,
				new maskat.lang.Error("REQUEST_TIMEOUT", {
					widgetId: event.widgetId,
					type: event.type
				}));
		}
	},

	/**
	 * エラー処理を行います。
	 *
	 * @param event マスカット部品で発生したイベント
	 */
	handleError: function(event, error) {
		event.cancel = true;
		/**
		 * FirefoxではXHRのonreadystatechange関数内でエラーを
		 * throwしてもwindow.onerror関数に通知されません。
		 * setTimeout関数を利用することでwindow.onerror関数に
		 * 通知されます。
		 * https://bugzilla.mozilla.org/show_bug.cgi?id=377347
		 */
		setTimeout(function() {
			maskat.app.handleError(error);
		}, 0);
	}

});
