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
 * エラーメッセージを一括表示エリアに出力するLiveValidationクラスです。
 *
 * 本クラスを利用する際にはバリデーション定義XMLにメッセージ出力先を
 * 定義する必要があります。
 */ 
maskat.lang.Class.declare(
	"maskat.validator.livevalidation.custom.BulkMessageLiveValidation")
	.extend("maskat.validator.livevalidation.custom.CustomLiveValidation", {
	
	_static: {
	
		/**
		 * メッセージ格納用DOMノードのIDのプレフィックス。
		 */
		MESSAGE_CONTAINER_ID_PREFIX: 'LiveValidationPlugin_bulkMessageContainer_',
		
		/**
		 * 複数項目の入力値の一括検証を行います。
		 * 
		 * 本クラスでは、メッセージエリアから全てのメッセージをいったん削除し、
		 * 検証エラーとなった項目のエラーメッセージのみ表示させます。
		 *
		 * @param {Array} validations
		 *         検証対象となるLiveValidationオブジェクトの配列
		 * @return 検証結果
		 * @type boolean
		 */
		massValidate : function (validations) {
			var returnValue = true;
			var messageContainers = {};
			for (var i=0 , length = validations.length ; i < length ; i++) {
				// 重複で処理をすることを回避するため、一時的にハッシュマップに退避
				var messageContainerNode = validations[i].messageContainerNode;
				if (messageContainerNode && messageContainerNode.id) {
					messageContainers[messageContainerNode.id] = messageContainerNode;
				}
			}
			
			for (var id in messageContainers) {
				var msgContainer = messageContainers[id];
				var deleteElementArray = [];
				
				for(var i=0, length=msgContainer.childNodes.length; i<length; i++){
					if (msgContainer.childNodes[i].className 
						&& msgContainer.childNodes[i].className.indexOf("LV_validation_message") != -1 ){
						deleteElementArray.push(msgContainer.childNodes[i]);
					}
				}
				for (var i = 0 , length = deleteElementArray.length ; i < length ; i++) {
					msgContainer.removeChild( deleteElementArray[i]);
				}
				
			}
			
			try {
				var returnValue = LiveValidation.massValidate(validations);
				return returnValue;
			} catch(e) {
				throw new maskat.lang.Error(
					"LIVEVALIDATION_BULKMESSAGE_MASSVALIDATE_ERROR", {}, e);
			}
		}
		
	},

	/**
	 * 適用するスタイルシートのクラス名を設定します。
	 */
	setStyleClass: function() {
		this.validClass = 'LV_valid_bulk';
	    this.invalidClass = 'LV_invalid_bulk';
	    this.messageClass = 'LV_validation_message_bulk';
	    this.validFieldClass = 'LV_valid_field_bulk';
	    this.invalidFieldClass = 'LV_invalid_field_bulk';
		this.messageContainerNodeClass = 'bulkMessageContainerNode';
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

		// 一括メッセージ出力先
		var params = {};
		if (this.layout && optionsObj.messageAreaLayoutName) {
			// マスカットの場合
			var layoutName = optionsObj.messageAreaLayoutName;
			var componentName = optionsObj.messageAreaComponentName;
			if (layoutName == "") {
				throw new maskat.lang.Error(
					"LIVEVALIDATION_BULKMESSAGE_MISSING_LAYOUT_ID");
			}
			if (!componentName || componentName == "") {
				throw new maskat.lang.Error(
					"LIVEVALIDATION_BULKMESSAGE_MISSING_WIDGET_ID");
			}
			params["layoutName"] = layoutName;
			params["componentName"] = componentName;
		
		} else if (optionsObj.messageAreaElementId) {
			// HTMLに対して適用した場合。
			var elementId = optionsObj.messageAreaElementId;
			if (!elementId || elementId == "") {
				throw new maskat.lang.Error(
					"LIVEVALIDATION_BULKMESSAGE_MISSING_ELMENT_ID");
			}
			params["elementId"] = elementId;
		
		} else {
			throw new maskat.lang.Error(
				"LIVEVALIDATION_BULKMESSAGE_MISSING_MESSAGEAREA");
		
		}
		
		this.messageContainerNode = this.getMessageContainerNode(params);
		this.insertAfterWhatNode = this.getInsertAfterWhatNode(
			this.messageContainerNode); 
			
		this.onlyOnBlur =  options.onlyOnBlur || false;
		this.wait = options.wait || 500;
		this.onlyOnSubmit = options.onlyOnSubmit || false;
	},	

	/**
	 * メッセージ格納領域のDIV要素を取得します。
	 *
	 * 存在しない場合は新たに作成して返却します。
	 *
	 * @param {Object} params メッセージ出力先情報
	 * 			マスカット連携時:
	 *          {
	 *          	layoutName: メッセージ出力先レイアウト,
	 *              componentName: メッセージ出力先マスカット部品
	 *          }
	 
	 *          単体利用時:
	 *          {
	 *               elementId: メッセージ出力先HTML要素のID属性
	 *          }
	 * @return メッセージ出力先配下のメッセージ格納領域
	 * @type HTMLElement
	 */
	getMessageContainerNode: function(params) {

		var messageAreaNode;
		var messageContainerId;
		
		if (params.layoutName) {
			var layout = maskat.app.getLayout(params.layoutName);
			if (!layout || !(layout instanceof maskat.layout.Layout)) {
				throw new maskat.lang.Error(
					"LIVEVALIDATION_BULKMESSAGE_INVALID_LAYOUT_ID",
					{ layout: params.layoutName });
			}
		
			var widget = layout.getWidget(params.componentName);
			if (!widget || !(widget instanceof maskat.layout.Widget)) {
				throw new maskat.lang.Error(
					"LIVEVALIDATION_BULKMESSAGE_INVALID_WIDGET_ID",
					{ layout: params.layoutName, widget: params.componentName });
					
			}
			try{
				if (widget.unwrap && widget.unwrap()) {
					var original = widget.unwrap();
					if (original.getHtmlExt) {
						messageAreaNode = original.getHtmlExt().firstChild;
					} else {
						messageAreaNode = original.domNode;
					}
				}
			} catch(e){
				throw new maskat.lang.Error(
					"LIVEVALIDATION_BULKMESSAGE_INVALID_MESSAGEAREA_MASKAT",
					{ layout: params.layoutName, widget: params.componentName });
			}
			messageContainerId = 
				maskat.validator.livevalidation.custom.BulkMessageLiveValidation.
					MESSAGE_CONTAINER_ID_PREFIX + params.layoutName + '_'
					+ params.componentName;
		} else if (params.elementId) {
			messageAreaNode = document.getElementById(params.elementId)
			messageContainerId = maskat.validator.livevalidation.custom
				.BulkMessageLiveValidation.MESSAGE_CONTAINER_ID_PREFIX
				+ params.elementId;
		}
		
		if (!messageAreaNode ) {
			if (params.layoutName) {
				throw new maskat.lang.Error(
					"LIVEVALIDATION_BULKMESSAGE_INVALID_MESSAGEAREA_MASKAT",
					{ layout: params.layoutName, widget: params.componentName });
			} else if (params.elementId) {
				throw new maskat.lang.Error(
					"LIVEVALIDATION_BULKMESSAGE_INVALID_MESSAGEAREA_HTML",
					{ id: params.elementId }); 
			}
		}
		
		// メッセージ格納領域を取得
		var containerNode = document.getElementById(messageContainerId);
		if (!containerNode) {
			containerNode = document.createElement('div');
			containerNode.setAttribute('id', messageContainerId);
			
			//ContainerNodeにClassNameを追加
			containerNode.className = this.messageContainerNodeClass ;
			
			try{
				messageAreaNode.appendChild(containerNode);
			} catch(e){
			
				if (params.layoutName) {
					throw new maskat.lang.Error(
						"LIVEVALIDATION_BULKMESSAGE_CREATE_MESSAGE_CONTAINER_ERROR_MASKAT",
						{ layout: params.layoutName, widget: params.componentName });
				} else if (params.elementId) {
					throw new maskat.lang.Error(
						"LIVEVALIDATION_BULKMESSAGE_CREATE_MESSAGE_CONTAINER_ERROR_HTML",
						{ id: params.elementId }); 
				}
			}
		}
		
		return containerNode;
	},
	
	/**
	 * メッセージ追加位置を示すノードを取得します。
	 *
	 * @param {HTMLElement} messageContainerNode メッセージ格納領域
	 * @return メッセージ格納領域に追加されたメッセージ追加位置を示すノード
	 * @type HTMLElement 
	 */
	getInsertAfterWhatNode: function(messageContainerNode) {
		var returnNode = document.createElement('div');
		messageContainerNode.appendChild(returnNode);
		
		return returnNode;
	},

	/**
	 * メッセージ領域を生成します。
	 *
	 * @return エラーメッセージをセットしたメッセージ領域
	 * @type HTMLElement
	 */
	createMessageArea: function() {
		var div = document.createElement('div');
		div.innerHTML = this.getMessage();
		return div;
	},
	
	/**
	 * フォーカスアウト時の処理を実行します。
	 */
	doOnBlur: function(e) {
		this.focused = false;
		this.validate(e);
	},
	
	/**
	 * フォーカスイン時の処理を実行します。
	 */
	doOnFocus: function(e) {
		this.focused = true;
		if (this.validationFailed) {
			this.validate(e);
		}
	}
});
