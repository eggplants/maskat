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
 * 画面遷移定義XMLのloadValidationタグの処理を実行するCommandクラスです。
 */
maskat.lang.Class.declare(
	"maskat.validator.livevalidation.control.LoadValidationCommand")
	.extend("maskat.control.Command", {
	
	/**
	 * このクラスのコンストラクタです。
	 */
	initialize: function() {
		this.url = null;
	},
	
	/**
	 * 設定ファイルのロード処理を呼び出します。
	 *
	 * @param {maskat.core.Application} app
	 *             このクラスを利用するマスカットアプリケーション
	 */
	execute: function(app) {
		maskat.validator.livevalidation.xml
			.ValidationXMLReader.getInstance().load(this.url); 
	}
});
