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
 * LiveValidation プラグインのPluginクラスです。
 */
maskat.lang.Class.declare(
	"maskat.validator.livevalidation.LiveValidationPlugin")
	.extend("maskat.core.Plugin", {
	
	_static: {
		initialize: function() {
			maskat.core.Plugin.register(this);
		}
	},
	
	/**
	 * プラグイン識別子を返します。
	 * 
	 * @return プラグイン識別子
	 */
	getPluginId: function() {
		return "livevalidation";
	},

	/**
	 * プラグインのバージョン識別子を返します。
	 * 
	 * @return プラグインのバージョン識別子
	 */
	getVersion: function() {
		return "2.3.0.@build@";
	},

	/**
	 * プラグインのロードが完了したかどうかを返します。
	 * 
	 * このメソッドが true を返すまでマスカットアプリケーションの実行は
	 * 開始しません。
	 * 
	 * @return ロードが完了していれば true、それ以外の場合は false
	 */
	isLoaded: function() {
		return this.loaded;
	},
	
	/**
	 * プラグインに必要なリソースをロードします。
	 * 
	 * @param app このプラグインを使用するマスカットアプリケーション
	 */
	load: function() {
		maskat.app.loadJavaScript(
			maskat.location + "livevalidation/livevalidation_standalone.js", false);
		this.setupLoadValidationCommand();
		this.loaded = true;
	},
	
	/**
	 * LiveValidation プラグインの実行を開始します。
	 */
	start: function() {
		if (navigator.userAgent.indexOf("MSIE") != -1) {
			var isIE = parseFloat(navigator.appVersion.split("MSIE ")[1]) || undefined;
			if (isIE >= 8 && document.documentMode != 5) {
				isIE = document.documentMode;
			}
			maskat.validator.livevalidation.isIE = Math.floor(isIE);
		}
		this.patch();
		
		// LiveValidation用のCSS定義を優先させるため、
		// start 内でスタイルシートをロードする。
		maskat.app.loadStyleSheet(
			maskat.location + "livevalidation/css/livevalidation_plugin.css");
	
		// LiveValidationライブラリのロード後に派生クラスへの継承処理を行う。
		var baseValidator =
			maskat.validator.livevalidation.custom.CustomLiveValidation;
		baseValidator.inherit(LiveValidation, baseValidator.properties); 
		
		// LiveValidation プラグインのメッセージ定義をロードする。
		maskat.util.Message.loadTemplates(
			maskat.location + "livevalidation/messages.json");
	},
	
	patch: function() {
		// ラジオボタングループ対応
		LiveValidation.massValidate = function(validations) {
			var returnValue = true;
			for(var i = 0, len = validations.length; i < len; ++i ){
				if (validations[i] instanceof Array) {
					var valid = false;
					for (var j in validations[i]) {
						validations[i][j].isMassValidate = true;
						if (validations[i][j].validate(true)) {
							valid = true;
							break;
						}
					}
				} else {
					validations[i].isMassValidate = true;
					valid = validations[i].validate(true);
				}
				if(returnValue) returnValue = valid;
			}
			return returnValue;
		}
	},
	
	
	/**
	 * 画面遷移定義XMLでloadValidationタグを使用するための設定を行います。
	 */
	setupLoadValidationCommand: function() {
		var tagName = "loadValidation";
		var child = { property: "commands", repeat: true };
		var element = {
			type: maskat.validator.livevalidation.control.LoadValidationCommand,
			attributes: {
				xmlFile: {	type: "string",	required: true,	property: "url"	}
			}
		};

		var reader = maskat.control.TransitionXMLReader.getInstance(); 
		reader.addElementBinding("", tagName, element);
		
		var init = reader.bindings[""]["init"];
		init.addChildBinding(tagName, child);
		
		var transition = reader.bindings[""]["transition"];
		transition.addChildBinding(tagName, child);
	}
});
