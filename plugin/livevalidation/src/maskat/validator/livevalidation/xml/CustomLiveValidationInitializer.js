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
 * ValidationXMLReaderでパースされた設定ファイル情報を元に
 * マスカット部品にLiveValidaitonを適用するためのクラスです。
 */
maskat.lang.Class.declare(
	"maskat.validator.livevalidation.xml.CustomLiveValidationInitializer")
	.extend("maskat.validator.livevalidation.xml.LiveValidationInitializer", {

	/**
	 * このクラスのコンストラクタです。
	 *
	 * @param {Object} config 設定ファイル情報
	 */	
	initialize: function(config, layout) {
		
		this.config = config;
		this.validationTargetNodeName = "components";
		this.defaultValidatorClass = 
			maskat.validator.livevalidation.custom.FloatAndAlertMessageLiveValidation;
		this.validations = {};
		this.layout = layout;
		this.logger = maskat.log.LogFactory.getLog(
			"maskat.validator.livevalidation.xml.CustomLiveValidationInitializer");
	},
	
	/**
	 * 検証対象のコントロール要素を取得します。
	 *
	 * @param id {string} component タグの id 属性値
	 * @return 検証対象のコントロール要素
	 */
	getControlElement: function(id) {
		var widget = this.layout.getWidget(id);
		
		if (!widget || !widget.getControlElement) {
			throw new maskat.lang.Error("LIVEVALIDATION_INVALID_WIDGET_ID",
				{ layout: this.config.layout, widget: id });
		}
		
		var controlElement = widget.getControlElement();
		if (!controlElement) {
			throw new maskat.lang.Error(
				"LIVEVALIDATION_CONTROL_ELEMENT_UNDEFINED",
				{ layout: this.config.layout, widget: id });
		}
		
		return controlElement;
	},

	/**
	 * 複数項目の一括検証を実施するイベントを設定します。
	 *  
	 * @see maskat.validator.livevalidation.xml
	 *            .LiveValidationInitializer#setMassValidateEvent()
	 */	
	setMassValidationEventHandler: function(
		id, eventType, validatorClass, lvArray) {

		// massValidate イベントの実装確認
		if (!validatorClass.massValidate
				|| typeof(validatorClass.massValidate) != 'function') {
			throw new maskat.lang.Error("LIVEVALIDATION_MASSVALIDATE_UNDEFINED");
		}
		
		// イベントハンドラの取得処理
		var listeners = this.layout.listeners
		if (!listeners || !listeners.length || !listeners[0]) {
			throw new maskat.lang.Error("LIVEVALIDATION_INVALID_EVENT_HANDLER",
				{ layout: this.config.layout, widget: id, eventType: eventType });
			
		}
		
		var handlers = listeners[0].handlers[id];
		if (!handlers) {
			throw new maskat.lang.Error("LIVEVALIDATION_INVALID_EVENT_HANDLER",
				{ layout: this.config.layout, widget: id, eventType: eventType });
		}
		
		var handler = handlers[eventType];
		if (!handler) {
			throw new maskat.lang.Error("LIVEVALIDATION_INVALID_EVENT_HANDLER",
				{ layout: this.config.layout, widget: id, eventType: eventType });
		}
		
		// イベントハンドラ関数の設定
		handler.validate = function(event) {
			try {
				return validatorClass.massValidate(lvArray);
			} catch (e) {
				var message = maskat.util.Message.format(
					"LIVEVALIDATION_MASS_VALIDATION_ERROR", {}, e) + '\n';
				message += e.getMessages ? e.getMessages().join('\n') : e.message;
				var logger = maskat.log.LogFactory.getLog(
					"maskat.validator.livevalidation");
				logger.error(message);
				return false;
			} 
		}
	}
});
