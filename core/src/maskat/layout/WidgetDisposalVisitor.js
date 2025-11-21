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
 * レイアウトのツリー構造を走査し、下位の要素から順番にマスカット部品の
 * 破棄処理を実行します。
 *
 * @name maskat.layout.WidgetDisposalVisitor
 * @extends maskat.layout.WidgetVisitor
 */
maskat.lang.Class.declare("maskat.layout.WidgetDisposalVisitor")
	.extend("maskat.layout.WidgetVisitor", {

	/** @scope maskat.layout.WidgetDisposalVisitor.prototype */

	/**
	 * コンストラクタです。
	 *
	 * @param layout マスカット部品の破棄処理を実行するレイアウト 
	 */
	initialize: function(layout) {
		this.layout = layout;
	},

	postVisit: function(widget) {
		try {
			this.layout.removeWidget(widget);
			widget.dispose();
		} catch (e) { /* suppress */ }
	}

});
