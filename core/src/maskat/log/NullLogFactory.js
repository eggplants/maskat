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
 * ログ出力 API として {@link maskat.log.NullLog} クラスを利用するための
 * ログファクトリの実装クラスです。
 *
 * @name maskat.log.NullLogFactory
 * @extends maskat.log.LogFactory
 */
maskat.lang.Class.declare("maskat.log.NullLogFactory")
	.extend("maskat.log.LogFactory", {

	/** @scope maskat.log.NullLogFactory.prototype */

	/**
	 * ログ出力を全く行わないダミーのログ実装を返します。
	 *
	 * @param name ロガーオブジェクトの名前
	 */
	createLog: function(name) {
		return maskat.log.NullLog.getInstance();
	}

});
