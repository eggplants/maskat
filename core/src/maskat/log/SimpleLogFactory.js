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
 * ログ出力 API として {@link maskat.log.SimpleLog} クラスを利用するための
 * ログファクトリの実装クラスです。
 *
 * <p>
 * このファクトリはマスカットのプロパティファイルの設定値に応じて出力する
 * ログレベルを切り替える機能を持っています。
 * </p>
 *
 * @name maskat.log.SimpleLogFactory
 * @extends maskat.log.LogFactory
 */
maskat.lang.Class.declare("maskat.log.SimpleLogFactory")
	.extend("maskat.log.LogFactory", {

	/** @scope maskat.log.SimpleLogFactory.prototype */

	/**
	 * コンストラクタです。
	 */
	initialize: function() {
		/* ログレベルの文字列 ("INFO", "DEBUG" 等) を取得 */
		this.defaultLevel = maskat.app.getProperty("log.default.level");
	},

	/**
	 * デフォルトのロガーオブジェクトを生成します。
	 *
	 * @param name ロガーオブジェクトの名前
	 */
	createLog: function(name) {
		/* ログレベルの文字列 ("INFO", "DEBUG" 等) を取得 */
		var level = maskat.app.getProperty("log." + name + ".level")
			|| this.defaultLevel;
		var focus = maskat.app.getProperty("log.popup.focus");
		return new maskat.log.SimpleLog(name, maskat.log.Log[level], focus);
	}

});
