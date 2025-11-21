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
 * HTML要素に関するユーティリティクラスです。
 */
maskat.lang.Class.declare("maskat.validator.livevalidation.util.HTMLElementUtil", {

	_static: {

		/**
		 * HTML要素の描画領域中の絶対位置を取得します。
		 *
		 * @param {HTMLElement} element 絶対位置を取得したいHTML要素  
		 * @return 描画領域中での絶対位置 ({left: 左端, top: 上端}) 
		 * @type Object
		 */
		getAbsolutePosition: function (element) {
			var elem = element;
			var x = 0;
			var y = 0;
			while (elem) {
				x += elem.offsetLeft || 0;
				y += elem.offsetTop  || 0;
				elem = elem.offsetParent;
			}
			return {left: x, top: y};
		}
	}
});
