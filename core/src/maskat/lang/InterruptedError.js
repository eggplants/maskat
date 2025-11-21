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
 * マスカットフレームワーク内部で利用される割り込みエラークラスです。
 * 呼び出し元の関数の処理に割り込んで、処理を中断または分岐させたい場合に
 * スローします。
 *
 * <p>
 * 一般に、try-catch ブロックによる例外処理をプログラムの実行フロー制御に
 * 使用するとプログラムの可読性が下がり、保守が困難になります。マスカット
 * フレームワークで規定された利用法を除いて、このクラスをアプリケーション
 * 内で利用することは推奨しません。
 * </p>
 *
 * @name maskat.lang.InterruptedError
 * @extends maskat.lang.Error
 */
maskat.lang.Class.declare("maskat.lang.InterruptedError").extend("maskat.lang.Error", {

	/** @scope maskat.lang.InterruptedError.prototype */

	/**
	 * コンストラクタです。
	 *
	 * @param key エラーメッセージのメッセージキー
	 * @param param エラーのパラメータ
	 * @param cause このエラーの原因となった下位レベルのエラー
	 */
	initialize: function(key, param, cause){
		this.base(key, param, cause);
	}
});
