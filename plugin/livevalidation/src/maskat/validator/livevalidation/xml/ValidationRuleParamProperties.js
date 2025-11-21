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
 * バリデーション定義XMLのparam属性で定義された検証ルールのパラメータの
 * 型変換を行うためのクラスです。
 */
maskat.lang.Class.declare(
	"maskat.validator.livevalidation.xml.ValidationRuleParamProperties")
	.extend("maskat.util.Properties", {
	
	_static: {
	
		/**
		 * このクラスの唯一のインスタンスを返します。(Singleton パターン)
		 *
		 * @return このクラスの唯一のインスタンス
		 */
		getInstance: function() {
			var self = this;
			if (!self.instance) {
				self.instance = new this();
			}
			return self.instance;
		}
	},

	/**
	 * このクラスのコンストラクタです。
	 */
	initialize: function(){
		this.base(maskat.util.CrossBrowser.loadJSONFrom(
			maskat.location + "livevalidation/validationRuleParams.json"));
	},
	
	/**
	 * プロパティキーと値が対になったオブジェクトから、プロパティ値を
	 * すべて読み込みます。
	 *
	 * 値のセット時に既存のプロパティ値をクリアします。
	 *
	 * @param values プロパティキーと値が対になったオブジェクト 
	 */
	setProperties: function(values) {
		
		// value をクリアする。
		this.values = {};
		
		for (var key in values) {
			this.setProperty(key, values[key]);
		}
	}
});
