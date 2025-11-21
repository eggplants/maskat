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
maskat.lang.Class.declare("maskat.log.log4javascript.Log4javascriptXMLReader")
	.extend("maskat.xml.XMLObjectBinder", {
	_static: {
		/**
		 * このクラスの唯一のインスタンスを返します。(Singleton パターン)
		 *
		 * @return このクラスの唯一のインスタンス
		 */
		getInstance: function() {
			var self = arguments.callee;
			if (!self.instance) {
				self.instance = new this();
			}
			return self.instance;
		}
	},
	
	/**
	 * コンストラクタ
	 *
	 * @param base.document log4javascript.xmlファイルのスキーマ定義
	 */
	initialize: function() {
		this.base({
			"#document": {
				children: {
					log4javascript: {}
				}
			},
			log4javascript: {
				attributes: {
					enabled: { type: "boolean", defaultValue: true },
					showStackTraces: { type: "boolean", defaultValue: false }
				},
				children: {
					logger: {property: "loggers", repeat: true },
					popUpAppender: {property: "appenders", repeat: true },
					inPageAppender: {property: "appenders", repeat: true },
					browserConsoleAppender: {property: "appenders", repeat: true },
					alertAppender: {property: "appenders", repeat: true },
					ajaxAppender: {property: "appenders", repeat: true }
				}
			},
			logger: {
				type: maskat.log.log4javascript.LoggerConfig,
				attributes: {
					name: { type: "string", required: true },
					level: {
						type: "enum",
						values: ["TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"],
							defaultValue: "DEBUG"
					}
				},
				children: {
					appenderRef: {property: "appenders", repeat: true }
				}
			},
			appenderRef: {
				attributes: {
					name: { type: "string" , required: true}
				}
			},
			popUpAppender: {
				type: maskat.log.log4javascript.PopUpAppenderConfig,
				attributes: {
					name: { type: "string", required: true },
					lazyInit: { type: "boolean", defaultValue: true },
					threshold: {
						type: "enum",
						values: ["ALL", "TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"],
							defaultValue: "ALL"
					},
					focusPopUp: { type: "boolean", defaultValue: false },
					useOldPopUp: { type: "boolean", defaultValue: true },
					complainAboutPopUpBlocking: { type: "boolean", defaultValue: true },
					newestMessageAtTop: { type: "boolean", defaultValue: false },
					scrollToLatestMessage: { type: "boolean", defaultValue: true },
					width: { type: "number", defaultValue: 600 },
					height: { type: "number", defaultValue: 400 },
					reopenWhenClosed: { type: "boolean", defaultValue: false },
					maxMessages: { type: "number" }
				},
				children: {
					nullLayout: {property: "layout"},
					simpleLayout: {property: "layout"},
					xmlLayout: {property: "layout"},
					jsonLayout: {property: "layout"},
					httpPostDataLayout: {property: "layout"},
					patternLayout: {property: "layout"}
				}
			},
			inPageAppender: {
				type: maskat.log.log4javascript.InPageAppenderConfig,
				attributes: {
					name: { type: "string", required: true },
					div: { type: "string", defaultValue: "inPageConsole" },
					lazyInit: { type: "boolean", defaultValue: true },
					threshold: {
						type: "enum",
						values: ["ALL", "TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"],
							defaultValue: "ALL"
					},
					initiallyMinimized: { type: "boolean", defaultValue: false },
					newestMessageAtTop: { type: "boolean", defaultValue: false },
					scrollToLatestMessage: { type: "boolean", defaultValue: true },
					width: { type: "string", defaultValue: "100%" },
					height: { type: "string", defaultValue: "250px" },
					maxMessages: { type: "number"}
				},
				children: {
					nullLayout: {property: "layout"},
					simpleLayout: {property: "layout"},
					xmlLayout: {property: "layout"},
					jsonLayout: {property: "layout"},
					httpPostDataLayout: {property: "layout"},
					patternLayout: {property: "layout"}
				}
			},
			browserConsoleAppender: {
				type: maskat.log.log4javascript.BrowserConsoleAppenderConfig,
				attributes: {
					name: { type: "string", required: true },
					threshold: {
						type: "enum",
						values: ["ALL", "TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL"],
							defaultValue: "ALL"
					}
				},
				children: {
					nullLayout: {property: "layout"},
					simpleLayout: {property: "layout"},
					xmlLayout: {property: "layout"},
					jsonLayout: {property: "layout"},
					httpPostDataLayout: {property: "layout"},
					patternLayout: {property: "layout"}
				}
			},
			alertAppender: {
				type: maskat.log.log4javascript.AlertAppenderConfig,
				attributes: {
					name: { type: "string", required: true }
				},
				children: {
					nullLayout: {property: "layout"},
					simpleLayout: {property: "layout"},
					xmlLayout: {property: "layout"},
					jsonLayout: {property: "layout"},
					httpPostDataLayout: {property: "layout"},
					patternLayout: {property: "layout"}
				}
			},
			ajaxAppender: {
				type: maskat.log.log4javascript.AjaxAppenderConfig,
				attributes: {
					name: { type: "string", required: true },
					url: { type: "string", required: true },
					timed: { type: "boolean", defaultValue: false },
					waitForResponse: { type: "boolean", defaultValue: false },
					batchSize: { type: "number", defaultValue: 1 },
					timerInterval: { type: "number" },
					requestSuccessCallback: { type: "string" },
					failCallback: { type: "string" }
				},
				children: {
					nullLayout: {property: "layout"},
					simpleLayout: {property: "layout"},
					xmlLayout: {property: "layout"},
					jsonLayout: {property: "layout"},
					httpPostDataLayout: {property: "layout"},
					patternLayout: {property: "layout"}
				}
			},
			nullLayout: {
				type: maskat.log.log4javascript.NullLayoutConfig
			},
			simpleLayout: {
				type: maskat.log.log4javascript.SimpleLayoutConfig
			},
			xmlLayout: {
				type: maskat.log.log4javascript.XmlLayoutConfig
			},
			jsonLayout: {
				type: maskat.log.log4javascript.JsonLayoutConfig,
				attributes: {
					readable: { type: "boolean", defaultValue: false },
					loggerKey: { type: "string", defaultValue: "logger" },
					timeStampKey: { type: "string", defaultValue: "timestamp" },
					levelKey: { type: "string", defaultValue: "level" },
					messageKey: { type: "string", defaultValue: "message" },
					exceptionKey: { type: "string", defaultValue: "exception" },
					urlKey: { type: "string", defaultValue: "url" }
				}
			},
			httpPostDataLayout: {
				type: maskat.log.log4javascript.HttpPostDataLayoutConfig,
				attributes: {
					loggerKey: { type: "string", defaultValue: "logger" },
					timeStampKey: { type: "string", defaultValue: "timestamp" },
					levelKey: { type: "string", defaultValue: "level" },
					messageKey: { type: "string", defaultValue: "message" },
					exceptionKey: { type: "string", defaultValue: "exception" },
					urlKey: { type: "string", defaultValue: "url" }
				}
			},
			patternLayout: {
				type: maskat.log.log4javascript.PatternLayoutConfig,
				attributes: {
					pattern: { type: "string", defaultValue: "%d{HH:mm:ss} %-5p - %m{1}%n" }
				}
			}
		});
	},
	
	/**
	 * 設定ファイル(log4javascript.xml)の値より、全てのロガーを生成します。
	 *
	 * @param url 設定ファイルのパス
	 */
	load: function(url) {
		var appenders = [];
		var doc = maskat.util.CrossBrowser.getXMLDocumentFrom(url);
		var config = this.read(doc);
		
		log4javascript.setEnabled(config.enabled);
		log4javascript.setShowStackTraces(config.showStackTraces);
		var logger;

		/* configのLoggers数分を生成する */
		for (var i = 0; i < config.loggers.length; i++) {
			var log = config.loggers[i];
			logger = log.createLogger();
			/* 各LoggerのappendRef数分を生成する */
			for (var j = 0; j < log.appenders.length; j++) {
				var append = log.appenders[j];
				var appender = null;
				if (appenders[append.name]) {
					/* appenderすでに生成された場合、生成されたinstanceを使う */
					appender = appenders[append.name];
				} else {
					/* appender生成されない場合、生成する */
					for (var k = 0; k < config.appenders.length; k++) {
						if (config.appenders[k].name == append.name) {
							/* config.appendersからappenderを生成する */
							appender = config.appenders[k].createAppender();
							appenders[append.name] = appender;
							break;
						}
					}
				}
				/* appenderをLoggerに追加する */
				if (appender) {
					logger.addAppender(appender); 
				}
			}
		}
		
	}
});
