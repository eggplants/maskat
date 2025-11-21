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
 * ログ出力 API を定義する抽象クラスです。
 *
 * @name maskat.log.Log
 */
maskat.lang.Class.declare("maskat.log.Log", {
	
	_static: {
		/** @scope maskat.log.Log */
		
		/** トレースのログレベルを表す定数 */
		TRACE: 1,

		/** デバッグのログレベルを表す定数 */
		DEBUG: 2,

		/** 情報のログレベルを表す定数 */
		INFO: 3,

		/** 警告のログレベルを表す定数 */
		WARN: 4,

		/** エラーのログレベルを表す定数 */
		ERROR: 5,

		/** 致命的エラーのログレベルを表す定数 */
		FATAL: 6
	},
	
	/** @scope maskat.log.Log.prototype */
	
	/**
	 * コンストラクタです。 
	 */
	initialize: function() {
		/* NOP */
	},

	/**
	 * ログレベルを取得します
	 * @returns ログレベル
	 */
	getLevel: function() {
		/* NOP */
	},

	/**
	 * トレースログを記録します。
	 *
	 * @param message ログメッセージ
	 * @param error エラーオブジェクト (省略可能)
	 */
	trace: function(message, error) {
		/* NOP */
	},

	/**
	 * デバッグログを記録します。
	 *
	 * @param message ログメッセージ
	 * @param error エラーオブジェクト (省略可能)
	 */
	debug: function(message, error) {
		/* NOP */
	},

	/**
	 * 情報ログを記録します。
	 *
	 * @param message ログメッセージ
	 * @param error エラーオブジェクト (省略可能)
	 */
	info: function(message, error) {
		/* NOP */
	},

	/**
	 * 警告ログを記録します。
	 *
	 * @param message ログメッセージ
	 * @param error エラーオブジェクト (省略可能)
	 */
	warn: function(message, error) {
		/* NOP */
	},

	/**
	 * エラーログを記録します。
	 *
	 * @param message ログメッセージ
	 * @param error エラーオブジェクト (省略可能)
	 */
	error: function(message, error) {
		/* NOP */
	},

	/**
	 * 致命的エラーログを記録します。
	 *
	 * @param message ログメッセージ
	 * @param error エラーオブジェクト (省略可能)
	 */
	fatal: function(message, error) {
		/* NOP */
	}

});
