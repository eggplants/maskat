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
 * @class ローカルデータバインディングを実行するクラスです。
 * 処理開始時にコールバックメソッドを実行します。
 * 処理終了時にコールバックメソッドを実行します。
 *
 * @name maskat.event.LocalEventHandler
 * @extends maskat.event.EventHandler
 */ 
maskat.lang.Class.declare("maskat.event.LocalEventHandler")
	.extend("maskat.event.EventHandler", {

	/** @scope maskat.event.LocalEventHandler.prototype */

	/**
	 * コンストラクタです。
	 */
	initialize: function() {
		this.base.apply(this, arguments);
	},

	/**
	 * ローカルイベントの処理を行います。
	 *
	 * ローカルイベントハンドラはブラウザ上の JavaScript 関数によってイベント
	 * を処理します。レイアウト内のマスカット部品や変数のデータを相互に代入
	 * したり、任意の JavaScript 関数を実行することが可能です。
	 *
	 * @param event マスカット部品で発生したイベント
	 */
	handle: function(event){
		/* ローカルデータバインディングを実行 */
		if (this.unmarshaller) {
			this.unmarshaller.unmarshal(null, event.layout);
		}

		/* イベントハンドラの終了処理を実行 */
		this.finishHandle(event);
	}
	
});
