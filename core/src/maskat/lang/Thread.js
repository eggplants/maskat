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
 * setInterval 関数を利用した擬似スレッド処理を行うクラスです。
 * 指定されたオブジェクトのメソッドを、一定間隔で繰り返し実行します。
 *
 * @name maskat.lang.Thread
 */
maskat.lang.Class.declare("maskat.lang.Thread", {

	/** @scope maskat.lang.Thread.prototype */

	/**
	 * コンストラクタです。
	 *
	 * @param object オブジェクト
	 * @param method メソッドとして呼び出す関数、またはメソッド名の文字列
	 * @param args メソッド実行時に引数として与える配列
	 * @param interval 呼び出し間隔
	 */
	initialize: function(object, method, args, interval) {
		this.object = object;
		
		switch (typeof(method)) {
		case "string":
			this.method = object[method];
			break;
		case "function":
			this.method = method;
			break;
		}
		
		this.args = args;
		this.interval = interval;
		this.intervalId = undefined;
	},

	/**
	 * スレッドの実行を開始します。
	 */
	start: function() {
		if (!this.isRunning()) {
			var self = this;
			this.intervalId = setInterval(function() {
				self.method.apply(self.object, self.args || []);
			}, this.interval);
		}
	},
	
	/**
	 * スレッドを停止します。
	 */
	stop: function() {
		if (this.isRunning()) {
			clearInterval(this.intervalId);
			delete this.intervalId;
		}
	},

	/**
	 * スレッドが実行中かどうかを返します。
	 *
	 * @returns スレッドが実行中の場合は インターバルID、それ以外の場合は undefined
	 */
	isRunning: function() {
		return this.intervalId;
	}

});
