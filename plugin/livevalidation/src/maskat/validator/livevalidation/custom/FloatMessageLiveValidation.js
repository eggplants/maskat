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
 * 即時検証(単項目チェック)時にフォーカスされている項目のみエラーメッセージを
 * 表示します。
 * 一括検証時には該当するすべてのエラーメッセージを表示します。
 */
maskat.lang.Class.declare(
	"maskat.validator.livevalidation.custom.FloatMessageLiveValidation")
	.extend("maskat.validator.livevalidation.custom.CustomLiveValidation", {

	_static: {

		/**
		 * 複数項目の入力値の一括検証を行います。
		 *
		 * 本クラスではLiveValidationクラスと同じ処理をします。
		 *
		 * @param {Array} validations
		 *         検証対象となるLiveValidationオブジェクトの配列
		 * @return 検証結果
		 * @type boolean
		 */	
		massValidate: function(validations) {
			var returnValue = true;
			returnValue = LiveValidation.massValidate(validations);
			return returnValue;
		}
	},
	
	
	/**
	 * 適用するスタイルシートのクラス名を設定します。
	 */
	setStyleClass: function() {
		this.validClass = 'LV_valid_float';
	    this.invalidClass = 'LV_invalid_float';
	    this.messageClass = 'LV_validation_message_float';
	    this.validFieldClass = 'LV_valid_field_float';
	    this.invalidFieldClass = 'LV_invalid_field_float';
	},

	/**
	 * イベント起動時よりwait(msec)分遅らせて検証を実行します。 
	 */
	deferValidation: function(e) {
		if (this.wait >= 300) {
			this.removeMessageAndFieldClass();
		}
		var self = this;
	   	var selfValidate = function(){
    		if(self.focused ){ 
    			self.validate();
    		}
		}
		if (this.timeout) {
			clearTimeout(self.timeout);
		}
		this.timeout = setTimeout( function(){ selfValidate()}, self.wait); 
	}, 
	
	/**
	 * フォーカスアウト時の処理を実行します。
	 *
	 * 本クラスではフォーカスアウト時に入力値検証を実行しますが、
	 * エラーメッセージの表示は行いません。
	 */
	doOnBlur: function(e) {
		var self = this;
		this.focused = false;
		this.validate(e);
		setTimeout(function () {
			self.removeMessage();
		}, 0);
	},
	
	/**
	 * フォーカスイン時の処理を実行します。
	 *
	 * 本クラスでは入力値検証が実行されていない状態でフォーカスインした場合には
	 * 何も処理を行いません。
	 * 既に入力値検証を実行した結果、エラーとなっている項目にフォーカスインした
	 * 場合にはエラーメッセージを表示するため、validateメソッドを実行します。
	 */
	doOnFocus: function(e) {
		this.focused = true;
		if (this.validationFailed) {
			this.validate(e);
		}
	},

	/**
	 * メッセージ領域を削除します。
	 */	
	removeMessage: function() {
		if (this.messageArea && this.messageArea.parentNode ) {
			// 2010/12/03 LiveValidation メモリリーク対応 ここから
			this.messageArea.onclick = null;
			// 2010/12/03 LiveValidation メモリリーク対応 ここまで
			this.messageArea.parentNode.removeChild(this.messageArea);
		}
	},
	
	/**
	 * メッセージ領域をDOMに追加します。
	 *
	 * @param {HTMLElement} elementToInsert
	 *                body直下に追加されたメッセージ表示のためのDIV 
	 */
	insertMessage: function(elementToInsert) {
		this.removeMessage();
		this.messageArea = elementToInsert;
		if ((this.displayMessageWhenEmpty && 
				(this.elementType == LiveValidation.CHECKBOX || this.element.value == ''))
			|| this.element.value != ''){
			var className = this.validationFailed ? this.invalidClass : this.validClass;
			elementToInsert.className += ' ' + this.messageClass + ' ' + className;
			document.body.appendChild(this.messageArea);
		}
	},
	
	/**
	 * HTML要素の位置とメッセージ長から、メッセージの表示位置を設定します。
	 *
	 * HTML要素の横に表示できない(描画領域を超えてしまう)場合は、
	 * 検証対象となる項目の下にメッセージを表示します。
	 *
	 * @return メッセージ表示領域の位置（LEFTとTOP）
	 * @type  Object	  
	 */
	getMessagePosition: function() {
		var element = this.element;
		
		//メッセージ位置を調整するためのマージン
		if (!this.messageMargin) {
			this.messageMargin = { top: 10, left: 10, right: 20 };
			var prop = maskat.app.getProperty("maskat.core.plugins");
			if (prop && prop.livevalidation) {
				var liveValidationProp = prop.livevalidation;
				if (liveValidationProp["floatMessageMarginLeft"]) {
					this.messageMargin.left =
						liveValidationProp["floatMessageMarginLeft"];
				}
				if (liveValidationProp["floatMessageMarginRight"]) {
					this.messageMargin.right =
						liveValidationProp["floatMessageMarginRight"];
				}
				if (liveValidationProp["floatMessageMarginTop"]) {
					this.messageMargin.top =
						liveValidationProp["floatMessageMarginTop"];
				}
			} 
		}
		
		/************** メッセージ表示幅の計算 *******************************/
		var dom = this.getMessageElement();
		dom.style.position = "absolute";
		dom.style.visibility = "hidden";
		dom.style.whiteSpace = "nowrap";
		var className = this.validationFailed ? this.invalidClass :
			this.validClass;
		dom.className = this.messageClass + ' ' + className;
		document.body.appendChild(dom);
		// メッセージ表示幅
		var messageLength = dom.offsetWidth || 0;
		document.body.removeChild(dom);
		dom = null;
		
		/************** コントロール要素の表示位置とサイズの計算 *************/
		var inputWidth = element.offsetWidth || 0;
		var inputHeight = element.offsetHeight || 0;
		var elementPosition = maskat.validator.livevalidation.util
			.HTMLElementUtil.getAbsolutePosition(element);	
		var messageAreaTop = elementPosition.top || 0;
		var messageAreaLeft = elementPosition.left|| 0;
		
		// メッセージ表示位置の設定
		var bodyWidth = document.body.offsetWidth || 0;
		var messageFieldLeft = messageAreaLeft + inputWidth
			+ this.messageMargin.left;
		var messageFieldRight =  messageFieldLeft + messageLength
			+ this.messageMargin.right; 
		var messageFieldTop = messageAreaTop;
		
		// メッセージ右端がbodyからはみ出る場合は、項目下にメッセージを表示
		if (messageFieldRight > bodyWidth) {
			messageFieldTop += inputHeight + this.messageMargin.top;
			messageFieldLeft -= inputWidth;
			messageFieldRight = messageFieldLeft + messageLength;
			
			// 項目下にメッセージ表示しても画面右側にはみ出る場合、
			// メッセージの右端を画面右端にそろえる
			if (messageFieldRight > bodyWidth) {
				messageFieldLeft = bodyWidth - messageLength
					- this.messageMargin.right;
			}
		}
		return { left: messageFieldLeft + "px", top: messageFieldTop + "px"};
	},
	
	/**
	 * メッセージ領域を生成します。
	 *
	 * @return エラーメッセージをAppendしたメッセージエリア
	 * @type HTMLElement
	 */
	createMessageArea: function() {
		var self = this;
		
		var msgArea = this.getMessageElement();
		var msgPosition = this.getMessagePosition();
		var style = msgArea.style;
		style.position="absolute";
		style.top = msgPosition.top;
		style.left = msgPosition.left; 

		msgArea.onclick = function() {
			self.removeMessage();
		}

		return msgArea; 
	},
	
	/**
	 * メッセージ文字列をセットしたHTML要素を返却します。
	 *
	 * @return メッセージ文字列をセットしたHTML要素
	 * @type HTMLElement
	 */
	getMessageElement: function() {
		var element = document.createElement('div');
		element.innerHTML = this.getMessage();
		return element;
	}
});
