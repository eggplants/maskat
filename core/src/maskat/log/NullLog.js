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
 * ログ出力を全く行わないダミーのログ実装クラスです。
 *
 * @name maskat.log.NullLog
 * @extends maskat.log.Log
 */
 maskat.lang.Class.declare("maskat.log.NullLog").extend("maskat.log.Log", {

	_static: {
		/** @scope maskat.log.NullLog */
	
		/**
		 * このクラスの唯一のインスタンスを返します。(Singleton パターン)
		 *
		 * @returns このクラスの唯一のインスタンス
		 */
		getInstance: function() {
			var self = arguments.callee;
			if (!self.instance) {
				self.instance = new this();
			}
			return self.instance;
		}
	},
	getLevel: function() {
		return maskat.log.Log.FATAL;
	},
	
	trace: function(message, error) {
		/* NOP */
	},

	debug: function(message, error) {
		/* NOP */
	},

	info: function(message, error) {
		/* NOP */
	},

	warn: function(message, error) {
		/* NOP */
	},

	error: function(message, error) {
		/* NOP */
	},

	fatal: function(message, error) {
		/* NOP */
	}

});
