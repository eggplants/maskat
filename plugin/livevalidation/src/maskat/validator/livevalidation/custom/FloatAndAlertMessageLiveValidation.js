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
 * 検証エラー時にフロートメッセージを表示するLiveValidationクラスです。
 *
 * 本クラスでは一括検証時にフロートメッセージを表示せず、ダイアログAPIで
 * エラーメッセージを一括出力します。
 */
maskat.lang.Class.declare(
	"maskat.validator.livevalidation.custom.FloatAndAlertMessageLiveValidation")
	.extend("maskat.validator.livevalidation.custom.FloatMessageLiveValidation", {
	
	_static: {
	
		/**
		 * 複数項目の入力値の一括検証を行います。
		 *
		 * 本クラスでは、エラーメッセージをDialogでまとめて表示します。
		 *
		 * @param {Array} validations
		 *         検証対象となるLiveValidationオブジェクトの配列
		 * @return 検証結果
		 * @type boolean
		 */	
		massValidate: function(validations) {
			var returnValue = true;
			var messageArray = [];
			var valid;
			var validation;
			
			for(var i = 0, len = validations.length; i < len; ++i ){
				if (validations[i] instanceof Array) {
					valid = false;
					for (var j in validations[i]) {
						validations[i][j].isMassValidate = true;
						if (validations[i][j].validate(true)) {
							valid = true;
							break;
						}
					}
					validation = validations[i][0];
				} else {
					validations[i].isMassValidate = true;
					valid = validations[i].validate(true);
					validation = validations[i];
				}
				if(returnValue){
					returnValue = valid;
				}
				if(!valid) {
					messageArray.push(validation.getMessage());
				}
			}
			if(messageArray.length > 0) {
				maskat.ui.Dialog.openAlert("入力値検証エラー",
					messageArray.join("\n"), maskat.ui.Dialog.ERROR);
			}
			return returnValue;
		}
	},
	
	/**
	 * 検証エラー時の後処理(onInvalid)を設定します。
	 * 
	 * @param {object} options コンストラクタの第二引数(optionsObj)
	 */
	setOnInvalidFunction: function(options) {
		this.onInvalid = options.onInvalid || function(){
			if(!this.isMassValidate) {
				// 単項目チェック
				this.insertMessage( this.createMessageArea() );
			} else {
				// 一括チェック時
				this.removeMessage();
				this.isMassValidate = false;
      		}
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
	 * メッセージ文字列を取得します。
	 *
	 * バリデーション定義XMLのmessageタグに定義した内容を元に
	 * 下記の通り改行コードの処理をします。
	 *
	 * 即時検証: 改行文字(\n)をbrタグに変換します。
	 * 一括検証: 改行文字(\n)で文字列を改行します。
	 *
	 * @return 改行コードを処理したメッセージ文字列
	 * @type string
	 */
	getMessage: function() {
		var msg = this.message || this.validations[0].params.failureMessage;
		if (this.isMassValidate) {
			return msg.replace(/\\n/g, "\n");
		} else {
			return msg.replace(/\\n/g, "<br />");
		}
	}
	
});
