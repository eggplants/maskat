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
 * @class キーボードイベントの処理をマスカット部品で管理するクラスです。
 *
 * @name maskat.key.KeyEventManager
 */
 maskat.lang.Class.declare("maskat.key.KeyEventManager", {
	
	_static: {
	
		/** @scope maskat.key.KeyEventManager */
	
		getInstance: function() {
			var self = arguments.callee;
			if (!self.instance) {
				self.instance = new this();
			}
			return self.instance;
		}
	},
	
	/** @scope maskat.key.KeyEventManager.prototype */

	/**
	 * フォーカスを移動します。
	 *
	 * @param event 発生したイベント
	 * @param type フォーカスの種別
	 */
	moveFocus: function(event, type){
		var element = event.target || event.srcElement;
		var widget = this.getWidget(this.getRootElement(element));

		var activeLayout = widget.getLayout();
		var tabIndexes = activeLayout.getTabIndexes();

		var pos = -1;
		var name = widget.getTabIndexGroupName() || widget.name;
		for (var i = 0, len = tabIndexes.length; i < len; i++) {
			if (tabIndexes[i] == name) {
				pos = i;
				break;
			}
		}

		var next = "";
		for (var j = 0, len = tabIndexes.length; j < len; j++) {
			switch (type) {
				case "next":
					pos++;
					if (pos >= tabIndexes.length) pos = 0;
					break;
				case "previous":
					pos--;
					if (pos < 0) pos = tabIndexes.length - 1;
					break;
				case "first":
					type = "next";
					pos = 0;
					break;
				case "last":
					type = "previous";
					pos = tabIndexes.length - 1;
					break;
			}

			next = activeLayout.getWidget(tabIndexes[pos]);
			if (next.canFocus() && this.isVisible(next)) {
				try {
					next.setFocus();
					return false;
				} catch (e) {}
				return true;
			}
		}
		return false;
	},
	
	handle: function(event) {
		var element = event.target || event.srcElement;
		var widget = this.getWidget(this.getRootElement(element));

		/* widgetが存在しない場合は、処理を行なわない */
		if (!widget) {
			return;
		}
		
		/* 部品のキーイベントを処理する */
		var propagate = true;
		var layout = widget.getLayout();

		/* キーバインド定義 XML で定義された部品のキーバインドを実行 */
		if (widget != layout) {
			var keybind = widget.getKeybind(event);
			if (typeof(keybind) != "undefined") {
				keybind.execute(event);
				propagate = false;
			}
		}

		if (propagate && event.type == "keydown") {
			propagate = widget.handleKeyEvent(event);
		}

		/* キーバインド定義 XML で定義されたレイアウトのキーバインドを実行 */
		if (propagate) {
			var keybind = layout.getKeybind(event);
			if (typeof(keybind) != "undefined") {
				keybind.execute(event);
				propagate = false;
			}
		}
		
		/* タブキーによるフォーカス遷移を実行 */
		if (propagate && event.type == "keydown" && event.keyCode == 9) {
			propagate = this.moveFocus(event, event.shiftKey ? "previous" : "next");
		}

		if (!propagate) {
			/* ブラウザのデフォルト処理を停止 */
			if (event.preventDefault) {
				event.preventDefault(); /* W3C 準拠 (Firefox) */
			} else {
				event.returnValue = false; /* IE */
				/*
				 * input要素でtype属性をfileに定義している部品から発生した
				 * イベントの keyCodeを書き換えようとするとアクセス例外が発生する (IE)
				 */
				try {
					event.keyCode = null;
				} catch (e) { /* suppress */ }
			}

			/* イベント伝播を停止 */
			if (event.stopPropagation) {
				event.stopPropagation(); /* W3C 準拠 (Firefox) */
			} else {
				event.cancelBubble  = true; /* IE */
			}
		}
	},
	
	getRootElement: function(element) {
		while (element && !element._layoutId) {
			element = element.parentNode;
		}
		return element;
	},
	
	getWidget: function(element) {
		if (element) {
			var layout = maskat.app.getLayout(element._layoutId);
			return layout.getWidget(element._widgetName);
		}
		return null;
	},
	
	nextWidget: function(widget, shift) {
		var activeLayout = widget.getLayout();
		var tabIndexes = activeLayout.getTabIndexes();
		var pos = -1;
		var name = widget.getTabIndexGroupName() || widget.name;
		for (var i = 0, l = tabIndexes.length; i < l; i++) {
			if (tabIndexes[i] == name) {
				pos = i;
				break;
			}
		}
		for (var j = 0, m = tabIndexes.length; j < m; j++) {
			if (!shift) {
				pos++;
				if (pos >= tabIndexes.length) pos = 0;
			} else {
				pos--;
				if (pos < 0) pos = tabIndexes.length - 1;
			}
			var next = activeLayout.getWidget(tabIndexes[pos]);
			if (next.canFocus() && this.isVisible(next)) {
				return next;
			}
		}
		return widget;
	},
	
	isVisible: function(widget) {
		do {
			if (!widget.isVisible() || !widget.isEnabled()) {
				return false;
			}
			widget = widget.parent;
		} while (widget);
		return true;
    }
});
