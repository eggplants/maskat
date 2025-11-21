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
 * レイアウトのツリー構造を走査して処理を実行します。
 *
 * <p>
 * Visitor パターンを利用することにより、レイアウトやマスカット部品を
 * 変更せずに新しい処理を定義することが可能です。
 * </p>
 *
 * @name maskat.layout.WidgetVisitor
 */
maskat.lang.Class.declare("maskat.layout.WidgetVisitor", {

	/** @scope maskat.layout.WidgetVisitor.prototype */
	
	/**
	 * 指定されたマスカット部品を訪問します。
	 *
	 * <p>
	 * このメソッドはレイアウトのツリー構造の走査において行きがけ順
	 * (preorder) で呼び出されます。
	 * </p>
	 *
	 * @param widget 訪問するマスカット部品
	 * @returns 子要素を走査する場合は true, それ以外の場合は false
	 */
	visit: function(widget) {
		return true;
	},
	
	/**
	 * 指定されたマスカット部品を訪問を終了します。
	 *
	 * <p>
	 * このメソッドはレイアウトのツリー構造の走査において帰りがけ順
	 * (postorder) で呼び出されます。
	 * </p>
	 *
	 * @param widget 訪問するマスカット部品
	 */
	postVisit: function(widget) {
		/* NOP */
	}

});
