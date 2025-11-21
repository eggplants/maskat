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
 * @class マスカット部品で発生したイベントをディスパッチするクラスです。
 *
 * @name maskat.event.EventDispatcher
 */ 
maskat.lang.Class.declare("maskat.event.EventDispatcher", {
	
	/** @scope maskat.event.EventDispatcher.prototype */
	
	/**
	 * コンストラクタです。 
	 */
	initialize: function(){
		this.url = null;
		this.headers = null;
		this.handlers = {};
		this.controller = null;
		this.layout = null;
		this.logger = maskat.log.LogFactory.getLog("maskat.event");
	},

	setController: function(controller){
		this.controller = controller;
	},

	setLayout: function(layout){
		/* レイアウトのイベントハンドラを登録 */
		this.handlers[layout.getWidgetId()] = this.events;

		var widget;
		var handler;
		for (var widgetId in this.handlers) {
			/*
			 * 参照整合性チェック:
			 *
			 * イベント定義 XML に記述されたマスカット部品がレイアウトに
			 * 存在しない場合には警告メッセージを出力する
			 */
			widget = layout.getWidget(widgetId) || layout.getVariable(widgetId);
			if (typeof(widget) == "undefined") {
				if (this.logger.getLevel() <= maskat.log.Log.WARN) {
					this.logger.warn(maskat.util.Message.format("MISSING_WIDGET", {
						layoutId: layout.getWidgetId(),
						widgetId: widgetId
					}));
				}
			}

			/* イベントハンドラの参照を解決する */
			for (var eventType in this.handlers[widgetId]) {
				handler = this.handlers[widgetId][eventType];
				handler.setDispatcher(this);
				if (handler.ref) {
					this.resolveHandlerReference(handler);
				}
			}
		}
	},

	resolveHandlerReference: function(handler){
		var eventRef = this.eventRefs[handler.ref];

		if (eventRef.headers) {
			handler.headers = eventRef.headers.concat(handler.headers || []);
		}

		if (!handler.marshaller) {
			handler.marshaller = eventRef.marshaller;
		}

		if (!handler.unmarshaller) {
			handler.unmarshaller = eventRef.unmarshaller;
		}
	},

	handleEvent: function(event){
		if (event.widget == event.layout && event.type == "onload") {
			this.setLayout(event.layout);
		}

		var handler = maskat.lang.Object.find([event.widgetId, event.type],
			this.handlers);
			
		if (handler) {
			try {
				handler.startHandle(event);
			} catch (e) {
				event.cancel = true;
				if (e instanceof maskat.lang.InterruptedError) {
					if (this.logger.getLevel() <= maskat.log.Log.INFO) {
						var msg = e.getMessages ? e.getMessages().join("\n") : e.message;
						this.logger.info(msg);
					}
				} else {
					maskat.app.handleError(e);
				}
			}
		}
	},

	finishHandle: function(event) {
		if (!event.cancel && this.controller) {
			this.controller.handleEvent(event);
		}
	}

});
