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
 * レイアウトのツリー構造を走査し、上位の要素から順番にマスカット部品の
 * 生成処理を実行します。
 *
 * @name maskat.layout.WidgetCreationVisitor
 * @extends maskat.layout.WidgetVisitor
 */
maskat.lang.Class.declare("maskat.layout.WidgetCreationVisitor")
	.extend("maskat.layout.WidgetVisitor", {

	/** @scope maskat.layout.WidgetCreationVisitor.prototype */
	
	/**
	 * コンストラクタです。
	 *
	 * @param layout マスカット部品の生成処理を実行するレイアウト 
	 */
	initialize: function(layout) {
		this.layout = layout;
		this.stack = [];
	},

	visit: function(widget) {
		/*
		 * スタックの内容はレイアウトからのパス (マスカット部品の列) であり、
		 * この部品の親はスタックのトップから取得できる
		 */
		var parent;
		if (this.stack.length > 0) {
			parent = this.stack[this.stack.length - 1];
		}
	
		/* マスカット部品の生成処理を行い、レイアウトに登録する */
		widget.createWidget(parent);
		widget.setParent(parent);
		this.layout.addWidget(widget);

		/* 訪問したマスカット部品をスタックに積む */
		this.stack[this.stack.length] = widget;
		return true;
	},
	
	postVisit: function(widget) {
		widget.postCreateWidget();
		var element = widget.getElement();
		if (element) {
			element._layoutId = widget.getLayout().getWidgetId();
			element._widgetName = widget.getWidgetId();
		}
		this.stack.pop();
	}

});
