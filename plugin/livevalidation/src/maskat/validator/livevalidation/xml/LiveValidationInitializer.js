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
	"maskat.validator.livevalidation.xml.LiveValidationInitializer", {

	/**
	 * このクラスのコンストラクタです。
	 *
	 * @param {Object} config 設定ファイル情報
	 */	
	initialize: function(config) {
		this.validations = {};
		this.config = config;
		this.validationTargetNodeName = "elements";
		this.defaultValidatorClass = LiveValidation; 
		this.logger = maskat.log.LogFactory.getLog(
			"maskat.validator.livevalidation.xml.LiveValidationInitializer");
	},
	
	/**
	 *　設定ファイル情報を元にLiveValidationを適用します。
	 */
	init: function() {
		this.initComponentValidation();
		this.initMassValidation();
	},

	/**
	 * 単項目チェックの設定を実施します。
	 */
	initComponentValidation: function () {
		var validationTargets = this.config[this.validationTargetNodeName];
		
		for (var id in validationTargets) {
			try {
				// 適用ルールを取得します。
				var rules = validationTargets[id].rules;
				if (!rules) {
					// rule タグが存在しない場合は無視します。
					continue;
				}

				// 検証対象のHTMLElementを取得します。
				var controlElement = this.getControlElement(id);
				
				// バリデータの取得
				var validator = this.getValidator(id);
				var validatorClass = validator["class"];
				var validatorOptions = validator["options"];
				var validation;

				if (controlElement instanceof Array){
					for (var j = 0, len = controlElement.length; j < len; j++) {
						validation = new validatorClass(controlElement[j], validatorOptions);
						// 検証ルールの設定
						for (var i = 0, length = rules.length; i < length; i++) {
							this.addRule(validation, rules[i]);
						}
						if (!this.validations[id]) {
							this.validations[id] = [];
						}
						this.validations[id][j] = validation;
					}
				} else {
					validation = new validatorClass(controlElement, validatorOptions);
					// 検証ルールの設定
					for (var i = 0, length = rules.length; i < length; i++) {
						this.addRule(validation, rules[i]);
					}
					this.validations[id] = validation;
				}
			} catch (e) {
				var message;
				if (this.layout) {
					message = maskat.util.Message.format(
						"LIVEVALIDATION_INIT_FAILED_COMPONENT_VALIDATION",
						{ layout: this.config.layout, widget: id }) + '\n';
				} else {
					message = maskat.util.Message.format(
						"LIVEVALIDATION_INIT_FAILED_COMPONENT_VALIDATION_HTML",
						{ id: id }) + '\n';
				}
				message += e.getMessages ? e.getMessages().join('\n') : e.message;
				this.logger.error(message);
			}
		}
	},

	/**
	 * 一括チェックの設定を実施します。
	 */
	initMassValidation: function() {
		var validationTargets = this.config[this.validationTargetNodeName];
		
		for (var id in validationTargets) {
			try {
				var events = validationTargets[id].massValidateEvents;
				if (!events) {
					// event タグが存在しない場合は無視
					continue;
				}
			
				var validator = this.getValidator(id)
				var validatorClass = validator["class"];
			
				// イベント種別ごとに一括チェックの設定を実施します。
				for (var eventType in events) {
					var lvArray = [];
					var targets = events[eventType].targets;
					for (var validatorId in targets) {
						var lv = this.validations[validatorId];
						if (lv) {
							lvArray.push(lv);
						}
					}
					if (lvArray.length > 0) {
						this.setMassValidationEventHandler(
							id, eventType, validatorClass, lvArray);
					}
				}
			} catch (e) {
				var message;
				if (this.layout) {
					message = maskat.util.Message.format(
						"LIVEVALIDATION_INIT_FAILED_MASS_VALIDATION",
						{ layout: this.config.layout, widget: id }) + '\n';
				} else {
					message = maskat.util.Message.format(
						"LIVEVALIDATION_INIT_FAILED_MASS_VALIDATION_HTML",
						{ id: id }) + '\n';
				}
				message += e.getMessages ? e.getMessages().join('\n') : e.message;
				this.logger.error(message);
			}
		}
	},
	
	/**
	 * 検証対象のコントロール要素を取得します。
	 *
	 * @param id {string} 
	 * @return {HTMLElement}
	 */
	getControlElement: function(id) {
		var controlElement = document.getElementById(id);
		
		if (!controlElement) {
			throw new maskat.lang.Error(
				"LIVEVALIDATION_CONTROL_ELEMENT_UNDEFINED_HTML", {id: id});
		}
		 
		return controlElement;
	},
	
	/**
	 * 適用するバリデータの情報を取得します。
	 * 
	 * @param id {string} 取得対象のelementまたはcomponentタグのid属性値
	 * @return バリデータ情報
	 *    { class: バリデータクラス, options: バリデータクラスに渡すオプション }
	 */
	getValidator: function(id) {
		var defaultValidator = this.getDefaultValidator();
		var target = this.config[this.validationTargetNodeName][id];
		
		var validator = {};
		validator.options = {};
		if (target.validator && target.validator["class"]) {
			validator["class"] = target.validator["class"];
		} else {
			validator["class"] = defaultValidator["class"];
			maskat.lang.Object.populate(validator.options,
				defaultValidator.options);
		}

		if (this.layout) {
			validator.options["layout"] = this.config.layout;
			validator.options["component"] = id;
		}

		if (!target.validator) {
			return validator;
		}
		
		for (var name in target.validator) {
			if (name == 'options') {
				maskat.lang.Object.populate(
					validator.options, target.validator.options);
			} else if (name != 'class') {
				validator.options[name] = target.validator[name];
			}	
		}
		
		return validator;
	},
	
	/**
	 * デフォルトのバリデータ情報を取得します。
	 *
	 * @return デフォルトのバリデータ情報
	 * @type Object
	 */
	getDefaultValidator: function() {
	
		// 既にデフォルトのバリデータを生成している場合はそのまま返却します。
		if (this.defaultValidator) {
			return this.defaultValidator;
		}
		
		// デフォルトのバリデータを生成していない場合は生成処理を行います。
		this.defaultValidator = {};
		this.defaultValidator["class"] = this.defaultValidatorClass || LiveValidation;
		this.defaultValidator["options"] = {};
		
		// <default>タグの子要素に<validator>タグが存在しない場合は何もしません。
		if (!this.config["default"] || !this.config["default"]["validator"]) {
			return this.defaultValidator;
		}
	
		var validator = this.config["default"]["validator"];
		// バリデータクラスの設定
		if (validator["class"]) {
			this.defaultValidator["class"] = validator["class"]; 
		}		
		
		// バリデータクラスのオプションの設定		
		for (var name in validator) {
			if (name != "options" && name != "class") {
				this.defaultValidator.options[name] = validator[name];  
			}
		}
		if (validator.options) {
			maskat.lang.Object.populate(
				this.defaultValidator.options, validator.options);
		}
		
		return this.defaultValidator;
	},
	
	
	/**
	 * バリデーション関数に既定のエラーメッセージをセットします。
	 *
	 * LiveValidation　のバリデーション関数ごとに設定すべきエラーメッセージが
	 * 異なるために設定ファイルから読込まれたエラーメッセージのマッピングが必要。
	 * 
	 * param タグ内で状況別メッセージをセット済であれば上書きしません。
	 *
	 * @param {Object} params paramタグの情報
	 * @param {function} validateFunction バリデーション関数
	 * @param {string} _message エラーメッセージ
	 */	
	setDefaultMessage: function(params, validateFunction, _message) {
	
		var message = maskat.lang.String.trim(_message);
	
		if (validateFunction == Validate.Numericality) {
			// Validate.Numericality 用
			if (!params.notANumberMessage) {
				params.notANumberMessage = message;
			}
			if (!params.notAnIntegerMessage) {
				params.notAnIntegerMessage = message;
			}
			if (!params.tooHighMessage) {
				params.tooHighMessage = message;
			}
			if (!params.tooLowMessage) {
				params.tooLowMessage = message;
			}
			if (!params.wrongNumberMessage) {
				params.wrongNumberMessage = message;
			}
		} else if (validateFunction == Validate.Length) {
			// Validate.Length 用
			if (!params.tooLongMessage) {
				params.tooLongMessage = message;
			}
			if (!params.tooShortMessage) {
				params.tooShortMessage = message;
			}
			if (!params.wrongLengthMessage) {
				params.wrongLengthMessage = message;
			}
		} else {
	    	// その他
			if (!params.failureMessage) {
				params.failureMessage = message;
			}
		}
	},
	
	
	/**
 	 * LiveValidation オブジェクトにルールを追加します。。
 	 *
 	 * @param validation {LiveValidation} ルール追加対象のLiveValidationオブジェクト
 	 * @param rule {Object} 追加するルール
 	 *        {
 	 *            name    : バリデーション関数
 	 *            message : エラーメッセージ
 	 *            params  : バリデーション関数のパラメータオブジェクト
 	 *        }
 	 */
	addRule: function(validation, rule) {
		// バリデーション関数
		var validateFunction = rule.name;

		// バリデーション関数のパラメータ
		var paramsObj = {};

		try {
			// paramタグのデータを型変換して設定する。
			if (rule.params) {
				var props =	maskat.validator.livevalidation.xml
					.ValidationRuleParamProperties.getInstance();

				props.setProperties(rule.params);
				var params = props.getProperties();

				// Validate.Inclusion, Validate.Exclusion 用
				if (params['within']) {
	    			params['within'] = maskat.validator.livevalidation
	    				.util.StringUtil.split(params['within']);
				}

				// Validate.Confirmation 用
				if (params['match']) {
	    			params['match'] = this.getControlElement(params['match']);
				}

				maskat.lang.Object.populate(paramsObj, params);
			}
		} catch (e) {
			throw new maskat.lang.Error(
				"LIVEVALIDATION_CONVERT_RULE_PARAM_ERROR", {}, e);
		}

		// バリデーション関数別のエラーメッセージを設定
		var message = rule.message;
		if (message) {
			this.setDefaultMessage(paramsObj, validateFunction, message);
		}
		
		// ルールの追加
		validation.add(validateFunction, paramsObj);
	},
	
	/**
	 * 一括検証を行うイベントハンドラを設定します。
	 *
	 * 入力値検証に成功した場合は設定済のイベントハンドラを実行します。
	 * 
	 * @param id   {HTMLElement} 
	 * @param eventType {string} イベント種別(onclick, onblur, onsubmitなど)
	 * @param validatorClass
	 *                  massValidateメソッド実装済みのLiveValidation継承クラス
	 * @param lvArray
	 *          {Array<LiveValidation>} 一括検証を行う、LiveValidationオブジェクトの配列
	 */
	setMassValidationEventHandler: function(
		id, eventType, validatorClass, lvArray) {
		
		// 一括チェックイベントを設定するHTML要素を取得する。
		var target = document.getElementById(id);
		
		if (!target) {
			throw new maskat.lang.Error(
				"LIVEVALIDATION_INVALID_MASS_VALIDATION_ELEMENT", {"id":id} ); 
		}
		
		if (!validatorClass.massValidate
				|| typeof(validatorClass.massValidate) != 'function') {
			throw new maskat.lang.Error("LIVEVALIDATION_MASSVALIDATE_UNDEFINED");
		}
		
		var originalHandler = target[eventType];
		target[eventType] = function(event) {
			var result = false;
			try {
				result = validatorClass.massValidate(lvArray);
			} catch (e) {
				var message = maskat.util.Message.format(
					"LIVEVALIDATION_MASS_VALIDATION_ERROR", {}, e) + '\n';
				message += e.getMessages ? e.getMessages().join('\n') : e.message;
				var logger = maskat.log.LogFactory.getLog(
					"maskat.validator.livevalidation");
				logger.error(message);
			}
			
			if (result && typeof(originalHandler) == 'function') {
				var originalHandlerResult = originalHandler(event);
				if (typeof(originalHandlerResult) == 'boolean') {
					result = originalHandlerResult;
				}
			}
			
			return result;
		}
	}
});
