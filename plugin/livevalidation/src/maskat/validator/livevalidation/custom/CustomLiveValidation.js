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
 * LiveValidation プラグイン用のカスタムLiveValidationクラスです。
 *
 * 独自拡張を行う場合は本クラスを継承してください。 
 */
maskat.lang.Class.declare(
	"maskat.validator.livevalidation.custom.CustomLiveValidation")
	.extend("LiveValidation", {
	
	_static: {
	
		/**
		 * 複数項目の入力値の一括検証を行います。
		 *
		 * @param {Array} validations
		 *         検証対象となるLiveValidationオブジェクトの配列
		 * @return 検証結果
		 * @type boolean
		 */
		massValidate: function (validations) {
			// massValidate は各クラスで実装すること。
			return LiveValidation.massValidate(validations);
		}
	},
	
	/**
	 * このクラスのコンストラクタです。
	 * 
	 * @param {HTMLElement} element 検証対象のコントロール要素
	 * @param {Object} optionsObj コンストラクタ引数
	 * @see LiveValidation#initialize(element, optionsObj)
	 */
	initialize: function(element, optionsObj){
		
		this.element = element;
		
		// コンストラクタ引数にマスカット部品の情報があればセットする。
		if (optionsObj.layout) {
			this.layout = optionsObj.layout;
			this.component = optionsObj.component;
		}

		// 適用するスタイルシートのクラス名を設定
		this.setStyleClass();

		// 検証ルール
		this.validations = [];
		
		// HTML要素の種別
		this.elementType = this.getElementType();
		
		// LiveValidationの初期化オプションの設定
		var options = optionsObj || {};
		this.setLvOptions(options);
		
		// 検証成功時/エラー時の後処理の設定
		this.setOnValidFunction(options);
		this.setOnInvalidFunction(options);
		
		// 検証実行のトリガーとなるイベントの設定
		this.setValidationEvents();
	},
	
	/**
	 * 適用するスタイルシートのクラス名を設定します。
	 */
	setStyleClass: function() {
		this.validClass = 'LV_valid';
	    this.invalidClass = 'LV_invalid';
	    this.messageClass = 'LV_validation_message';
	    this.validFieldClass = 'LV_valid_field';
	    this.invalidFieldClass = 'LV_invalid_field';
	},

	/**
	 * LiveValidation の動作オプションを設定します。
	 *
	 * @param {Object} optionObj LiveValidationの動作オプション
	 *                             (省略可能　default:{})
	 */
	setLvOptions: function(optionsObj) {
		var options = optionsObj || {};
		this.validMessage = options.validMessage || 'Thankyou!';
		this.insertAfterWhatNode = options.insertAfterWhatNode || this.element;
		this.onlyOnBlur =  options.onlyOnBlur || false;
		this.wait = options.wait || 500;
		this.onlyOnSubmit = options.onlyOnSubmit || false;
	},

	
	/**
	 * メッセージ領域を生成します。
	 *
	 * @return メッセージ領域
	 * @type HTMLElement
	 */
	createMessageArea: function() {
		var span = document.createElement('span');
		span.innerHTML = this.getMessage();
		return span;
	},
	
	/**
	 * メッセージ文字列を取得します。
	 *
	 * 改行文字(\n)が設定されている場合はbrタグに変換します。
	 *
	 * @return 改行コードの処理を行ったメッセージ文字列
	 * @type string
	 */
	getMessage: function() {
		var msg = this.message || this.validations[0].params.failureMessage;
		return msg.replace(/\\n/g, "<br />");
	},
	
	/**
	 * 入力値検証対象のHTMLElementにイベントハンドラを追加します。
	 *
	 * HTMLElementに紐づいている既存のハンドラがあれば、LiveValidation用のハンドラと
	 * 共存させます。
	 *
	 * @param eventType {string} - イベント種別(DOMレベル0)
	 * @param handler {function} - 設定したいイベントハンドラ 
	 */
	addEventHandler: function (eventType, handler) {
		var self = this;
		var originalHandler;
		// 2010/12/03 LiveValidation メモリリーク対応 ここから
		var listener = function(event) {
			try {
				handler(event);
			} catch (e) {
				// バリデーション実行時にエラーが発生した場合は
				var message = e.getMessages ? e.getMessages().join('\n') :
					e.message;
				var logger = maskat.log.LogFactory.getLog(
					"maskat.validator.livevalidation"); 
				logger.error(message);
			}
			
			if (typeof(originalHandler) == 'function') {
				originalHandler(event);
			}
			// Rialto側でCLASSを上書きしてしまう不具合に対応
			self.addFieldClass();
		}

		if (this.element.attachEvent) {
			this.element.attachEvent(eventType, listener);

			// IE6 メモリリーク対応
			if (maskat.validator.livevalidation.isIE == 6) {
				var layout = maskat.app.getLayout(this.layout);
				var layoutId = layout.getWidgetId();
				var dispatcher = {
					handleEvent: function(event) {
						if (event.type == "onunload" && event.layoutId == layoutId) {
							handler = null;
							self = null;
						}
					}
				};
				layout.addEventListener(dispatcher);
			}

		} else {
			originalHamdler = this.element[eventType];
			this.element[eventType] = listener;
		}
		// 2010/12/03 LiveValidation メモリリーク対応 ここまで
	},

	/**
	 * 検証成功時の後処理を設定します。
	 *
	 * @param {Object} options オプションオブジェクト
	 */
	setOnValidFunction : function(options) {
		this.onValid = options.onValid || function () {
			this.removeMessage();
			this.addFieldClass();
			
			if (this.isMassValidate) {
				this.isMassValidate = false;
			}
			
			if (this.layout) {
				var layout = maskat.app.getLayout(this.layout);
				if (!layout) {
					return;
				}
				var widget = layout.getWidget(this.component);
				
				if (widget.unwrap && widget.unwrap()) {
					var original = widget.unwrap();
					if (original._setStateClass) {
						var state = false;
						if (original.isValid) {
							state = original.isValid();
						}
						original.state = "";
						original._setStateClass();
					
						if (this.element.type == "radio") {
							var group = layout.getWidget(widget.group)._groups;
							for (var radioName in group) {
								var radio = group[radioName].unwrap();
								radio.state = "";
								if (radio._setStateClass) {
									radio._setStateClass();
								}
								radio.optionalNode[0].style.backgroundColor = "";
							}
						} else if (this.elementType == 4) {
							original.optionalNode[0].style.backgroundColor = "";
						} else {
							if (original.isValid && !state) {
								original.state = "Error";
								original._setStateClass();
							}
						}
					}
				} else if (widget._groups) {
					var group = widget._groups;
					for (var radioName in group) {
						var radio = group[radioName].unwrap();
						radio.state = "";
						if (radio._setStateClass) {
							radio._setStateClass();
						}
						radio.optionalNode[0].style.backgroundColor = "";
					}
				}
			}
		};
	},
	
	/**
	 * 検証エラー時の後処理を設定します。
	 *
	 * @param {Object} options オプションオブジェクト
	 */
	setOnInvalidFunction: function(options) {
		this.onInvalid = options.onInvalid || function () {
			this.insertMessage ( this.createMessageArea() );
			this.addFieldClass();
			
			if (this.layout) {
				var layout = maskat.app.getLayout(this.layout);
				if (!layout) {
					return;
				}
				var widget = layout.getWidget(this.component);
				
				if (widget.unwrap && widget.unwrap()) {
					var original = widget.unwrap();
					if (original._setStateClass) {
						original.state = "Error";
						original._setStateClass();
					
						if (this.element.type == "radio") {
							var group = layout.getWidget(widget.group)._groups;
							for (var radioName in group) {
								var radio = group[radioName].unwrap();
								radio.state = "";
								if (radio._setStateClass) {
									radio._setStateClass();
								}
								radio.optionalNode[0].style.backgroundColor = "#F9F7BA";
							}
						} else if (this.elementType == 4) {
							original.optionalNode[0].style.backgroundColor = "#F9F7BA";
						}
					}
				} else if (widget._groups) {
					var group = widget._groups;
					for (var radioName in group) {
						var radio = group[radioName].unwrap();
						radio.state = "";
						if (radio._setStateClass) {
							radio._setStateClass();
						}
						radio.optionalNode[0].style.backgroundColor = "#F9F7BA";
					}
				}
			}
		};
	},
		
	/**
	 *　入力値検証を実行するイベントの設定をします。
	 */
	setValidationEvents: function() {
		var self = this;
		var KEY_CODE_TAB = 9;
		var KEY_CODE_SHIFT = 16;
		
		if(!this.onlyOnSubmit){
			switch(this.elementType){
			case LiveValidation.CHECKBOX:
				this.addEventHandler("onclick", function(e) {
					self.validate();
				});
				this.addEventHandler("onblur", function(e) {
					self.doOnBlur();
				});
			case LiveValidation.SELECT:
				this.addEventHandler("onchange", function(e) {
					self.validate();
				});
				break;
			default:
				this.addEventHandler("onfocus", function(e) {
					self.doOnFocus();
				});
				
				if(!this.onlyOnBlur) {
					this.addEventHandler("onkeyup", function(e) {
						var theEvent = e ? e : window.event;
						switch (theEvent.keyCode) {
						case KEY_CODE_TAB:
						case KEY_CODE_SHIFT:
							// Tabキーの場合は入力値検証を行わない。
							return true;
						default:
							break;
						}
						self.deferValidation(); 
					});
				}
				this.addEventHandler("onblur", function(e) {
					self.doOnBlur();
				});
				break;
			}
		}
	},
	
	/**
	 * 入力値検証を実行します。
	 * 
	 * @return 検証結果
	 * @see LiveValidation#validate
	 */
	validate : function() {
		try {
			var self = this;
			var isValid = this.doValidations();
			// マスカット部品の場合
			if (this.layout) {
				var layout = maskat.app.getLayout(this.layout);
				if (!layout) {
					return;
				}
				var widget = layout.getWidget(this.component);
				// 即時検証の場合
				if (!this.isMassValidate) {
					// 単独部品の場合
					if (widget.unwrap && widget.unwrap()) {
						var original = widget.unwrap();
						if (original._setStateClass &&
								(this.element.type == "radio" || this.elementType == 4)) {
							setTimeout(function() {
								if(widget.getValue()){
									self.onValid();
								} else {
									self.onInvalid(); 
								}
							}, 0);
							// 即時検証の場合、戻り値は不要。
							return undefined;
						}
					// グループ部品の場合
					} else if (widget._groups) {
						if(widget.getValue()){
							this.onValid();
							if (widget.removeMessage) {
								widget.removeMessage();
								widget.removeMessage = undefined;
								widget.messageArea = undefined;
							}
						} else {
							this.onInvalid(); 
							widget.removeMessage = this.removeMessage;
							widget.messageArea = this.messageArea;
						}
						// 即時検証の場合、戻り値は不要。
						return undefined;
					}
				// 一括検証、かつ、グループ部品の場合
				} else if (widget._groups) {
					var result = false;
					
					// グループに所属する部品の数を算出
					if (!widget.length) {
						widget.length = 0;
						for (var i in widget._groups) {
							widget.length++;
						}
					}
					// グループに所属する部品のうち、入力値検証済み部品の数を算出
					if (!widget.validated) {
						widget.validated = 0;
					}
					widget.validated++;
					
					// 入力値検証に成功した場合、同じグループの結果反映は行わない。
					if (isValid) {
						if (!widget.isValid) {
							widget.isValid = isValid;
						}
						result = true;
					}

					// グループに所属する全ての部品について入力値検証が終了した場合、
					// 初期化処理を行う。
					if (widget.length == widget.validated) {
						if (widget.isValid) {
							this.onValid();
							widget.isValid = undefined;
							if (widget.removeMessage) {
								widget.removeMessage();
								widget.removeMessage = undefined;
								widget.messageArea = undefined;
							}
						} else {
							this.onInvalid();
							widget.removeMessage = this.removeMessage;
							widget.messageArea = this.messageArea;
						}
						widget.validated = 0;
					}
					
					this.isMassValidate = false;
					
					return result;
				}
			}
			// HTML要素、または、ラジオボタン以外の一括検証の場合
			if (isValid) {
				this.onValid();
				return true;
			} else {
				this.onInvalid(); 
		  		return false;
			}
		} catch (e) {
			if (this.layout) {
				throw new maskat.lang.Error(
					"LIVEVALIDATION_COMPONENT_VALIDATION_ERROR",
					{ layout: this.layout, widget: this.component }, e);
			} else {
				throw new maskat.lang.Error(
					"LIVEVALIDATION_COMPONENT_VALIDATION_ERROR_HTML",
					{ id: this.element.id }, e);
			}
		}
	}
});
