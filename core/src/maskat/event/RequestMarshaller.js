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
 * @class レイアウト内のマスカット部品から取得した値を用いて HTTP 要求メッセージを作成するクラスです
 *
 * @name maskat.event.RequestMarshaller
 */
maskat.lang.Class.declare("maskat.event.RequestMarshaller", {
	/** @scope maskat.event.RequestMarshaller.prototype */

	/**
	 * 要求メッセージの Content-Type を取得します
	 * @return 要求メッセージの Content-Type
	 */
	getContentType: function() {
	},

	/**
	 * 要求メッセージのマーシャル処理を行います
	 * @param layout レイアウト
	 * @return 要求メッセージ
	 */
	marshal: function(layout) {
	}
});
