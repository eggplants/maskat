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
 * @class リモートイベントでコールバックメソッドを実行するクラスです。
 *
 * @name maskat.event.RemoteEventContext
 * @extends maskat.comm.HttpContext
 */ 
maskat.lang.Class.declare("maskat.event.RemoteEventContext")
	.extend("maskat.comm.HttpContext", {
	
	/** @scope maskat.event.RemoteEventContext.prototype */
	
	/**
	 * コンストラクタです。 
	 */
	initialize: function(handler, event){
		this.base(handler.method, handler.url, handler);
		this.handler = handler;
		this.event = event;

		if (!this.requestHeaders["maskat_layoutID"]) {
			this.requestHeaders["maskat_layoutID"] = event.layoutId;
		}
		if (!this.requestHeaders["maskat_componentID"]) {
			this.requestHeaders["maskat_componentID"] = event.widgetId;
		}
		if (!this.requestHeaders["maskat_eventID"]) {
			this.requestHeaders["maskat_eventID"] = event.type;
		}
	},
	
	onReady: function(){
		if (this.handler.onBeforeRequest) {
			this.event.stopProcess = false;
			this.event.sendXML = this.requestMessage;
			this.event.xhr = this.xhr;

			try {
				if (this.handler.logger.getLevel() <= maskat.log.Log.DEBUG) {
					this.handler.logger.debug(maskat.util.Message.format(
						"BEFORE_HANDLE",
						{functionName: this.handler.onBeforeRequest.functionName}));
				}
				try {
					this.handler.onBeforeRequest(this.event, this);
				} catch (e) {
					if (!(e instanceof maskat.lang.InterruptedError)) {
						throw new maskat.lang.Error("BEFORE_HANDLE_ERROR",
							{functionName: this.handler.onBeforeRequest.functionName}, e);
					}
					throw e;
				}
				if (this.event.stopProcess) {
					throw new maskat.lang.InterruptedError("INTERRUPTION_ERROR");
				}
				
			} catch (e) {
				this.event.cancel = true;
				if (e instanceof maskat.lang.InterruptedError) {
					if (this.handler.logger.getLevel() <= maskat.log.Log.INFO) {
						var msg = e.getMessages ? e.getMessages().join("\n") : e.message;
						this.handler.logger.info(msg);
					}
				}
				throw e;
			}
		}
		if (this.handler.logger.getLevel() <= maskat.log.Log.DEBUG) {
			this.handler.logger.debug(maskat.util.Message.format(
					"REQUEST_MESSAGE", {url: this.url, message: this.requestMessage}));
		}
	},
	
	onWait: function(){
		if (!this.async) {
			this.dialogThread = new maskat.lang.Thread(
				this,
				this.monitorProgress,
				null,
				200);
			
			this.dialogThread.start();
		}
	},

	monitorProgress: function(){
		/*
		 * 初回でWAIT状態の場合
		 */
		if (!this.dialog && this.status == maskat.comm.HttpContext.WAIT) {
			this.dialog = maskat.ui.Dialog.openProgress(
				"",
				maskat.util.Message.format("SYNC_EVENT_IN_PROGRESS"),
				Infinity);
		/*
		 * COMPLETE, ERROR, TIMEOUTの場合
		 */
		} else if (this.status > maskat.comm.HttpContext.WAIT) {
			if (this.dialog) {
				this.dialog.done();
			}
			this.dialogThread.stop();
		}
	},

	onComplete: function(){
		try {
			if (this.handler.logger.getLevel() <= maskat.log.Log.DEBUG) {
				var time = (new Date()).getTime() - this.sentAt;
				this.handler.logger.debug(maskat.util.Message.format(
					"RESPONSE_MESSAGE", {message: this.responseMessage, time: time}));
			}
			if (this.handler.onAfterResponse) {
				this.event.stopProcess = false;
				this.event.recvDOM = this.responseXML;
				this.event.xhr = this.xhr;

				if (this.handler.logger.getLevel() <= maskat.log.Log.DEBUG) {
					this.handler.logger.debug(maskat.util.Message.format(
						"AFTER_HANDLE",
						{functionName: this.handler.onAfterResponse.functionName}));
				}
				try {
					this.handler.onAfterResponse(this.event, this);

				} catch (e) {
					if (!(e instanceof maskat.lang.InterruptedError)) {
						throw new maskat.lang.Error("AFTER_HANDLE_ERROR",
							{functionName: this.handler.onAfterResponse.functionName}, e);
					}
					throw e;
				}
				if (this.event.stopProcess) {
					throw new maskat.lang.InterruptedError("INTERRUPTION_ERROR");
				}
			}
			this.handler.handleResponse(this.event, this);
			
		} catch (e) {
			this.event.cancel = true;
			if (e instanceof maskat.lang.InterruptedError) {
				if (this.handler.logger.getLevel() <= maskat.log.Log.INFO) {
					var msg = e.getMessages ? e.getMessages().join("\n") : e.message;
					this.handler.logger.info(msg);
				}
			} else {
				throw e;
			}
		}
	},
	
	onTimeout: function(){
		this.handler.handleRequestTimeout(this.event, this);
	},

	onError: function(){
		this.handler.handleError(this.event, this.error);
	}

});
