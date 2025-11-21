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
 * ログ出力に使用するロギングフレームワークを切り替えるためのファクトリを
 * 定義する抽象クラスです。
 *
 * <p>
 * ログファクトリには指定された名前をもとに、適切なロガーオブジェクトを
 * 生成して返却する責任があります。
 * </p>
 *
 * @name maskat.log.LogFactory
 */
maskat.lang.Class.declare("maskat.log.LogFactory", {

	_static: {
		/** @scope maskat.log.LogFactory */
	
		/** ロガーオブジェクトのキャッシュ */
		cache: {},

		/**
		 * ロギング API を提供するロガーオブジェクトを取得します。
		 *
		 * @param name ロガーオブジェクトの名前
		 *
		 * @returns ロガーオブジェクト
		 */
		getLog: function(name) {
			/* ロガーがキャッシュされている場合はそれを返却する */
			if (this.cache[name]) {
				return this.cache[name];
			}

			/* ログファクトリ経由でロガーを生成 */
			var log = this.getFactory().createLog(name);
			this.cache[name] = log;
			return log;
		},

		/** ロガーの生成に用いるログファクトリ */
		factory: null,

		/**
		 * ロガーの生成に用いるログファクトリを返却します。
		 *
		 * @returns ログファクトリ
		 */
		getFactory: function() {
			/* ログファクトリが未定義の場合は SimpleLogFactory を使用 */
			if (!this.factory) {
				this.factory = new maskat.log.SimpleLogFactory();
			}
			return this.factory;
		}
	},

	/** @scope maskat.log.LogFactory.prototype */

	/**
	 * ロガーオブジェクトを生成します。
	 *
	 * このメソッドは抽象メソッドです。サブクラスはこのメソッドを実装し、
	 * ロガーを返却する必要があります。
	 *
	 * @param name ロガーオブジェクトの名前
	 */
	createLog: function(name) {
		return null;
	}

});
