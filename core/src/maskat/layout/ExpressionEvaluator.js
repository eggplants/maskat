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
 * @class
 * データバインドで JavaScript 式をサポートするための疑似部品です。 
 *
 * <h2>データの取得</h2>
 * <p>
 * 要求メッセージのデータ取得元にこの部品を指定し、データ取得メソッド名に
 * 任意の JavaScript 式を指定します。
 * </p>
 *
 * <h2>データの格納</h2>
 * <p>
 * 応答メッセージのデータ格納先にこの部品を指定し、データ設定メソッド名に
 * 任意の JavaScript 式を指定します。
 * </p>
 *
 * @name maskat.layout.ExpressionEvaluator
 * @extends maskat.layout.Widget
 */ 
maskat.lang.Class.declare("maskat.layout.ExpressionEvaluator")
	.extend("maskat.layout.Widget", {

	/** @scope maskat.layout.ExpressionEvaluator.prototype */

    createWidget: function(parent) {
    	/* NOP */
    },

	getWidgetId: function(){
		return this.name;
	},

	getValue: function(key){
		return eval(key);
	},
	
	setValue: function(value, key){
		eval(key + " = value");
	}

});
