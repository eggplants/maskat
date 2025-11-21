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
 * @class イベント発生元のマスカット部品名、およびイベントの種類から、適切なイベントハンドラを起動するクラスです。
 *
 * @name maskat.event.EventHandler
 */ 
maskat.lang.Class.declare("maskat.event.EventHandler", {
	
	/** @scope maskat.event.EventHandler.prototype */
	
	/**
	 * コンストラクタです。
	 */
	initialize: function(){
		this.dispatcher = null;
		this.onStart = null;
		this.onFinish = null;
		this.logger = maskat.log.LogFactory.getLog("maskat.event");
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
	},

	/**
	 * イベントハンドラの開始処理を実行します。
	 *
	 * イベントハンドラ開始時のコールバック関数を実行し、確認ダイアログが
	 * 設定されている場合はダイアログを表示します。コールバック関数や確認
	 * ダイアログで処理の中止が要求された場合、それ以降のイベントの処理は
	 * 行われません。
	 * 
	 * @param event マスカット部品で発生したイベント
	 */
	startHandle: function(event){
		
		if (this.logger.getLevel() <= maskat.log.Log.INFO) {
			this.logger.info(maskat.util.Message.format("EVENT_START", {
				widget: event.widgetId,
				type: event.type
			}));
		}
		/* コールバック関数 (start) を実行 */
		if (this.onStart) {
			event.stopProcess = false;
			try {
				if (this.logger.getLevel() <= maskat.log.Log.DEBUG) {
					this.logger.debug(maskat.util.Message.format(
						"START_HANDLE", {functionName: this.onStart.functionName}));
				}
				this.onStart(event);
			} catch (e) {
				if (!(e instanceof maskat.lang.InterruptedError)) {
					throw new maskat.lang.Error("START_HANDLE_ERROR",
							{functionName: this.onStart.functionName}, e);
				} else {
					throw e;
				}
			}
			if (event.stopProcess) {
				throw new maskat.lang.InterruptedError("INTERRUPTION_ERROR");
			}
		}

		/* 入力値検証を実行 */
		if (!this.validate(event)) {
			event.cancel = true;
			return;
		}

		if (this.confirmDialog) {
			/* 確認ダイアログを表示 */
			var self = this;
			var dialog = event.layout.getWidget(this.confirmDialog);
			dialog.proceed = function (e) { self.handle(event); }
			dialog.setVisible(true);
		} else {
			this.handle(event);
		}
	},

	/**
	 * マスカット部品で発生したイベントの処理を行います。
	 *
	 * イベントハンドラのサブクラスでは、このメソッドをオーバーライドして
	 * イベント処理を実装する必要があります。なお、イベント処理の完了後に
	 * finishHandle(event) メソッドが実行されるように実装してください。
	 *
	 * @param event マスカット部品で発生したイベント
	 */
	handle: function(event){
		this.finishHandle(event);
	},

	/**
	 * イベントハンドラの終了処理を実行します。
	 *
	 * イベントハンドラ終了時のコールバック関数を起動し、終了ダイアログが
	 * 設定されている場合はダイアログを表示します。
	 * 
	 * @param event マスカット部品で発生したイベント
	 */
	finishHandle: function(event){
		/* コールバック関数 (finish) を実行 */
		if (this.onFinish) {
			try {
				if (this.logger.getLevel() <= maskat.log.Log.DEBUG) {
					this.logger.debug(maskat.util.Message.format(
						"FINISH_HANDLE", {functionName: this.onFinish.functionName}));
				}
				this.onFinish(event);
			} catch (e) {
				throw new maskat.lang.Error("FINISH_HANDLE_ERROR",
					{functionName: this.onFinish.functionName}, e);
			}
		}

		/* 終了ダイアログを表示 */
		if (this.endDialog) {
			var dialog = event.layout.getWidget(this.endDialog);
			dialog.setVisible(true);
		}

		/* 画面遷移の分岐先を Ajax 部品から取得 (マスカット 1.4.4 互換) */
		var widget = event.widget.unwrap();
		if (!event.branch && widget) {
			event.branch = widget.branch || "";
		}

		if (this.dispatcher) {
			this.dispatcher.finishHandle(event);
		}
		if (this.logger.getLevel() <= maskat.log.Log.INFO) {
			this.logger.info(maskat.util.Message.format("EVENT_FINISH", {
				widget: event.widgetId,
				type: event.type
			}));
		}
	},

	/**
	 * 入力データを検証します。
	 *
	 * このメソッドはイベントハンドラの処理が開始する前に呼び出されます。
	 * 検証に失敗した場合、ハンドラは実行されません。エラーメッセージを
	 * 表示する責任は、validate メソッドの実装側にあります。
	 *
	 * @returns 入力値検証に成功した場合は true、失敗した場合は false
	 */
	validate: function(event){
		return true;
	}
	
});
