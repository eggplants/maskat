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
 * @class HTTP 応答メッセージ から取得した値をレイアウト内のマスカット部品に設定するクラスです。
 *
 * @name maskat.event.ResponseUnmarshaller
 */ 
maskat.lang.Class.declare("maskat.event.ResponseUnmarshaller", {

	/** @scope maskat.event.ResponseUnmarshaller.prototype */

	/**
	 * 応答メッセージの Content-Type を取得します
	 * @return 応答メッセージの Content-Type
	 */
	getContentType: function() {
	},

	/**
	 * 応答メッセージを解析可能な形式へ変換します
	 * @param context 通信終了後のコンテキスト
	 * @return 変換した応答メッセージ
	 */
	normalize: function(context) {
		return context.responseXML || context.responseMessage;
	},

	/**
	 * 応答メッセージからエラー情報を取得します
	 * @param response 応答メッセージ
	 * @return エラーオブジェクト
	 */
	getError: function(response) {
	},

	/**
	 * 応答メッセージのアンマーシャル処理を行います
	 * @param response 応答メッセージ
	 * @param layout レイアウト
	 */
	unmarshal: function(response, layout) {
	}
});

