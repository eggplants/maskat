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
 * バリデーション定義XMLをロードし、LiveValidaitionの適用処理を呼び出す
 * クラスです。
 */
maskat.lang.Class.declare(
	"maskat.validator.livevalidation.xml.ValidationXMLReader")
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
	 * このクラスのコンストラクタです。
	 */
	initialize: function() {
		this.base(this.getBindingConfiguration());
	},
	
	/**
	 * バインディング設定を取得します。
	 *
	 * @return XMLObjectBinderのバインディング設定。
	 */
	getBindingConfiguration: function() {
		return {
			"#document": {
				children: {
					livevalidation: {}
				}
			},
		
			// ルートノード
			livevalidation: {
				attributes: {
					// Maskatの場合はレイアウト名を指定する。
					layout: { type: "string" }
				},
				children: {
					// 入力値検証対象の項目
					component: { property: "components", key:"id", repeat : true },
					element:   { property: "elements",   key:"id", repeat : true },
					"default":   { property: "default" }
				}
			},
			
			"default": {
				children: {
					validator: { property: "validator" }
				}
			},
		
			// バリデータクラスの設定
			validator: {
				attributes: {
					"class": { type: "function" },
					onValid: { type: "function" },
					onInvalid: { type: "function" },
					insertAfterWhatNode: { type: "HTMLElement" },
					onlyOnBlur: { type: "boolean" },
					wait: { type: "number" },
					onlyOnSubmit: { type: "boolean" },
					validMessage: { type: "string" }
				},
				children: {
					option: { property: "options", repeat: true,
						key: 'name', value: 'value' }
				}
			},

			// バリデーション関数に渡すパラメータ
			option: {
				attributes: {
					name:  { type: "string", required: true },
					value: { type: "string", required: true }
				}
			},

			// マスカット部品用
			component: {
				attributes: {
					id: { type:"string", required:true }
				},
				children : {
					// ボタン押下時などのイベント発生時に行う複数項目の一括チェック設定用
					massValidate : { property: "massValidateEvents", repeat: true, key: "eventType" },
				
					// 項目と検証ルールの紐付け用
					rule:       { property:'rules', repeat:true}, 
					
					// バリデータクラス
					validator:  { property: "validator" }
				}
			},
		
			// LiveValidation単体(生HTML)用
			element : {
				attributes : {
					id: { type: "string", required: true }
				},
				children : {
					// ボタン押下時などのイベント発生時に行う複数項目の一括チェック設定用
					massValidate : { property: "massValidateEvents", repeat: true, key: "eventType" },
				
					// 項目と検証ルールの紐付け用
					rule:       { property: "rules", repeat:true}, 
					
					// バリデータクラス
					validator: { property: "validator" }
				}
			},
		
			// 一括チェック設定
			massValidate: {
				attributes: {
					eventType: { type: "string", required:true }
				},
				children: {
					target: { property: "targets", repeat: true, key: "ref" }
				}
			},
		
			// イベント時に一括入力チェックを行うコンポーネント群
			target: {
				attributes: {
					ref: { type: "string", required: true }
				}
			},
	
			// 単項目チェックの検証ルール	
			rule:{
				attributes : {
					// バリデーション関数の完全修飾名
					name : { type: "function", required: true }
				},
				children: {
					message: {},
					param: {
						property: "params",
						repeat: true,
						key: 'name',
						value: 'value'
					}
				}
			},
	
			// エラーメッセージ
			message: {
				children: { "#text": {property:'message' } }
			},
		
			// バリデーション関数に渡すパラメータ
			param: {
				attributes: {
					name:  { type: "string", required: true },
					value: { type: "string", required: true }
				}
			}
		};
	},
	
	/**
	 * バリデーション定義XMLをパースし、 LiveValidaitonを適用します。
	 *
	 * @param url {string} - バリデーション定義XMLのパス文字列
	 */
	load: function(url) {

		try {
			var doc = maskat.util.CrossBrowser.getXMLDocumentFrom(url);
			var config = this.read(doc);
			this.initValidation(config, url);
		} catch (e) {
			throw new maskat.lang.Error(
				"LIVEVALIDATION_LOAD_ERROR", { url: url }, e);
		}
	},
	
	/**
	 * パースされたバリデーション定義情報を元に LiveValidation を適用します。
	 *
	 * @param config {Object} パース済のバリデーション定義情報
	 * @param url {string} - バリデーション定義XMLのパス文字列
	 */
	initValidation: function(config, url) {

		if (config.components) {
			// マスカットの場合 (componentタグ)
			if (!config.layout || config.layout == "") {
				throw new maskat.lang.Error("LIVEVALIDATION_MISSING_LAYOUT_ID");
			}
			
			var layout = maskat.app.getLayout(config.layout);
			
			if (!layout || !(layout instanceof maskat.layout.Layout)) {
				throw new maskat.lang.Error("LIVEVALIDATION_INVALID_LAYOUT_ID",
					{ layout: config.layout });
			}
			
			// 2010/12/03 LiveValidation メモリリーク対応 ここから
			if (layout.LV_URL) {
				if (layout.LV_URL[url]) {
					return;
				}
			} else {
				layout.LV_URL = [];
			}
			layout.LV_URL[url] = url;
			// 2010/12/03 LiveValidation メモリリーク対応 ここまで
			
			(new maskat.validator.livevalidation.xml
				.CustomLiveValidationInitializer(config, layout)).init();
				
		} else if (config.elements) {
			// 2010/12/03 LiveValidation メモリリーク対応 ここから
			// htmlフォームにliveValidationを利用する際の重複読み込み防止
			if (maskat.validator.LV_URL) {
				if (maskat.validator.LV_URL[url]) {
					return;
				}
			} else {
				maskat.validator.LV_URL = [];
			}
			maskat.validator.LV_URL[url] = url;
			// 2010/12/03 LiveValidation メモリリーク対応 ここまで
			
			// LiveValidation 単体利用の場合 (elementタグ)
			(new maskat.validator.livevalidation.xml
				.LiveValidationInitializer(config)).init();
		}
	}
});
