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
 * マスカットにおける画面の描画単位であるレイアウトを表現します。
 *
 * @name maskat.layout.Layout
 * @extends maskat.layout.Widget
 */
maskat.lang.Class.declare("maskat.layout.Layout")
	.extend("maskat.layout.Widget", {
	
	/** @scope maskat.layout.Layout.prototype */
	
	/**
	 * コンストラクタです。
	 */
	initialize: function(){
		this.base();
		this.layoutId = null;
		this.div = null;
		this.widgets = {};
		this.scope = window;
		this.widgetVariableType = "wrapped";
		this.listeners = null;
		this.tabIndexes = [];
		this._widgets = {};
	},
	
	/**
	 * このレイアウトを指定された HTML 要素の子要素に描画します。
	 *
	 * @param element レイアウトを読み込む先の HTML 要素
	 * @param visible 読み込み後にレイアウト表示する場合は true、
	 *                非表示の場合は false
	 */
	load: function(element, visible) {
		this.div = document.createElement("div");
		this.div.id = this.layoutId;
		this.div.style.position = "absolute";
		this.div.style.width = "100%";
		this.div.style.zIndex = element.childNodes.length + 1;
		this.div.style.visibility = "hidden";
		element.appendChild(this.div);

        this.accept(new maskat.layout.WidgetCreationVisitor(this));
		this.tabIndexes = this.createTabIndexes();
		this.setVisible(visible);
		
		this.loaded = true;
		this.notifyEvent("onload");
	},

	/**
	 * このレイアウトをメモリから解放します。
	 */
	unload: function() {
		this.notifyEvent("onunload");
		this.loaded = false;
		this.setVisible(false);
		this.accept(new maskat.layout.WidgetDisposalVisitor(this));

		if (this.scope === window) {
			for (var name in this._widgets) {
				this.removeWidget(name);
			}
		}
	},

	/**
	 * このレイアウトを表示します。
	 */
	show: function() {
		this.setVisible(true);
		this.notifyEvent("onshow");
	},

	/**
	 * このレイアウトを非表示にします。
	 */
	hide: function() {
		this.notifyEvent("onhide");
		this.setVisible(false);
	},

	/**
	 * このレイアウトにイベントリスナを追加します。
	 * 
	 * @param listener イベントリスナ
	 */
	addEventListener: function(listener) {
		if (!this.listeners) {
			this.listeners = [];
		}
		this.listeners[this.listeners.length] = listener;
	},

	/**
	 * このレイアウトに登録されたイベントリスナにマスカット部品で発生した
	 * イベントをディスパッチします。
	 * 
	 * @param event イベント
	 */
	dispatchEvent: function(event) {
		if (!this.listeners || !this.loaded) {
			return;
		}
		for (var i = 0, len = this.listeners.length; i < len; i++) {
			this.listeners[i].handleEvent(event);
		}
	},

	/**
	 * このレイアウトのレイアウト ID を取得します。
	 * 
	 * <p>
	 * レイアウト ID はマスカットアプリケーション内で一意の値となる必要が
	 * あります。
	 * </p>
	 *
	 * @returns レイアウト ID
	 */
	getWidgetId: function(){
		return this.layoutId;
	},

	/**
	 * このレイアウトに含まれるマスカット部品を取得します。
	 *
	 * @param widgetId マスカット部品 ID
	 * @returns 指定した部品 ID に対応するマスカット部品、
	 *          そのようなマスカット部品が存在しない場合は undefined
	 */
	getWidget: function(widgetId) {
		return this.widgets[widgetId];
	},

	/**
	 * このマスカット部品が参照している Ajax 部品を返します。
	 *
	 * @returns このマスカット部品が参照している Ajax 部品
	 */
	unwrap: function(){
		return this;
	},
	
	/**
	 * このレイアウトに含まれるマスカット部品を登録します。
	 *
	 * @param widget マスカット部品
	 */
	addWidget: function(widget) {
		var widgetId = widget.getWidgetId();
		if (typeof(widgetId) == "undefined" || widgetId == "") {
			return;
		}

		/* レイアウトにマスカット部品を登録 */
		this.widgets[widgetId] = widget;

		/* レイアウトにマスカット部品を登録 (マスカット 1.4.4 互換) */
		if (!this.components) {
			this.components = {};
		}
		if (widget !== this) {
			this.components[widgetId] = widget.unwrap();
		}

		/* レイアウト変数にマスカット部品を登録 */
		switch (this.widgetVariableType) {
		case "wrapped":
			this.scope[widgetId] = widget;
			break;
		case "unwrapped":
			this.scope[widgetId] = widget.unwrap();
			break;	
		}
		this._widgets[widgetId] = true;

		if (widget != this) {
			this.tabIndexes[this.tabIndexes.length] = widget;
		}
	},

	/**
	 * このレイアウトに含まれるマスカット部品を破棄します。
	 *
	 * @param widget マスカット部品
	 */
	removeWidget: function(widget) {
		var widgetId = typeof(widget) == "string" ? widget : widget.getWidgetId();
		if (typeof(widgetId) == "undefined" || widgetId == "") {
			return;
		}
		var remove = function(scope, name) {
			if (scope[name]) {
				try {
					scope[name] = null;
					delete scope[name];
				} catch (e) { /* suppress */ }
			}
		}
		remove(this.widgets, widgetId);
		remove(this.components, widgetId);
		remove(this.scope, widgetId);
		remove(this._widgets, widgetId);
	},

	/**
	 * レイアウトに新しい変数を宣言します。
	 *
	 * @param name 変数名
	 * @param value 初期値
	 * @throws {maskat.lang.Error} 同じ名前の変数がすでに宣言されている場合
	 */
	defineVariable: function(name, value) {
	 	/** 
	 	 * 変数名が階層構造を有する場合、
	 	 * 最後尾の"."の前をデータバインド対象のスコープ、
	 	 * "."の後を変数名としデータバインドを行う。
	 	 */
		var segments = name.split(".");
		var prop = segments.pop();
		var path = segments.join(".");
		
		/* データバインド対象のスコープを取得する */
		var parent = undefined;
		if (path) {
			parent = maskat.lang.Object.find(path, this.scope);
		} else {
			parent = this.scope;
		}
		/**
		 * スコープが存在しない、またはデータバインド対象の変数が
		 * すでに宣言されている場合はエラーする
		 */
		if (!parent || (prop in parent)) {
			throw new maskat.lang.Error("DUPLICATED_VARIABLE",
				{ layoutId: this.layoutId, name: name });	
		}
		
		 parent[prop] = value;
	},

	/**
	 * 変数の値を取得します。
	 *
	 * @param name 変数名
	 * @param value 初期値
	 * @throws {maskat.lang.Error} 変数が未定義の場合
	 */
	getVariable: function(name) {
	 	/** 
	 	 * 変数名が階層構造を有する場合、
	 	 * 最後尾の"."の前をデータバインド対象のスコープ、
	 	 * "."の後を変数名としデータバインドを行う。
	 	 */
		var segments = name.split(".");
		var prop = segments.pop();
		var path = segments.join(".");
		
		/* データバインド対象のスコープを取得する */
		var parent = undefined;
		if (path) {
			parent = maskat.lang.Object.find(path, this.scope);
		} else {
			parent = this.scope;
		}
		/**
		 * スコープが存在しない、またはデータバインド対象の変数が
		 * 宣言されていない場合はエラーとする
		 */
		if (!parent || !(prop in parent)) {
			throw new maskat.lang.Error("UNDEFINED_VARIABLE",
				{ layoutId: this.layoutId, name: name });
		}
		
		return parent[prop];
	},

	/**
	 * 変数の値を設定します。
	 *
	 * @param name 変数名
	 * @param value 値
	 * @throws {maskat.lang.Error} 変数が未定義の場合
	 */
	setVariable: function(name, value) {
	 	/** 
	 	 * 変数名が階層構造を有する場合、
	 	 * 最後尾の"."の前をデータバインド対象のスコープ、
	 	 * "."の後を変数名としデータバインドを行う。
	 	 */
		var segments = name.split(".");
		var prop = segments.pop();
		var path = segments.join(".");
			
		/* データバインド対象のスコープを取得する */
		var parent = undefined;
		if (path) {
			parent = maskat.lang.Object.find(path, this.scope);
		} else {
			parent = this.scope;
		}
		/**
		 * スコープが存在しない、またはデータバインド対象の変数が
		 * 宣言されていない場合はエラーとする
		 */
		if (!parent || !(prop in parent)) {
			throw new maskat.lang.Error("UNDEFINED_VARIABLE",
				{ layoutId: this.layoutId, name: name });	
		}
		
		parent[prop] = value;
	},

	/**
	 * このレイアウト自体への参照を返します。
	 *
	 * @returns このレイアウト自体への参照
	 */
	getLayout: function(){
		return this;
	},
	
	/**
	 * このレイアウトが参照している HTML 要素を返します。
	 *
	 * @returns このマスカット部品が参照している HTML 要素
	 */
	getElement: function(){
		return this.div;
	},

	/**
	 * このレイアウトが保持している情報を破棄します。
	 */
	dispose: function() {
		this.div.parentNode.removeChild(this.div);
		delete this.div;
		delete this.tabIndexes;
	},
	
	/**
	 * このレイアウトに含まれるマスカット部品のうち、タブインデックスを
	 * 持つものについて、タブインデックスの順序にソートされた配列を生成
	 * します。
	 */
	createTabIndexes: function() {
		var indexes = [];
		var widget = null;
		var index = null;
		var indexKeys = [];
		
		for (var i = 0, l = this.tabIndexes.length; i < l; i++) {
			widget = this.tabIndexes[i];
			index = widget.getTabIndex();
			if (widget && index > -1) {
				if (!indexes[index]) {
					indexes[index] = [];
					indexKeys[indexKeys.length] = index;
				}
				indexes[index][indexes[index].length] = widget.getWidgetId();
			}
		}
		var tabIndexes = [];
		indexKeys.sort(function(a, b) {
			  return (parseInt(a) > parseInt(b)) ? 1 : -1;
		});

		for (var i = 0, m = indexKeys.length; i < m; i++) {
			index = indexes[indexKeys[i]];
			Array.prototype.push.apply(tabIndexes, index);
		}
		return tabIndexes;
	},

	/**
	 * このレイアウトに含まれるマスカット部品のうち、タブインデックスを
	 * 持つものについて、タブインデックスの順序にソートされた配列を返却
	 * します。
	 */
	getTabIndexes: function() {
		return this.tabIndexes;
	},

	/**
	 * このマスカット部品の表示、非表示を定義します。
	 *
	 * @param enable 表示の場合は true、非表示の場合は false
	 */
	setVisible: function(visible){
		var element = this.getElement();
		if (element && element.style) {
			element.style.visibility = visible ? "inherit" : "hidden";
			element.style.display = visible ? "" : "none";
		}
		if (visible) {
			var maxZIndex = 0;
			var zIndex = element.style.zIndex;
			var children = element.parentNode.childNodes;
			
			for (var i = 0, len = children.length; i < len; i++) {
				if (children[i].style) {
					var index = children[i].style.zIndex;
					if (index) {
						if (index > maxZIndex) {
							maxZIndex = index;
						}
						if (index > zIndex) {
							children[i].style.zIndex--;
						}
					}
				}
			}
			element.style.zIndex = maxZIndex;
		}
	},

	/**
	 * このレイアウトに指定されたイベントが存在するか判定します
	 *
	 * @param widgetId 部品名
	 * @param type イベントタイプ
	 * @returns 存在する場合には true 存在しない場合には false を返します
	 */
	containsEvent: function(widgetId, type) {
		for (var i = 0, len = this.listeners.length; i < len; i++) {
			var dispatcher = this.listeners[i];
			var handler = maskat.lang.Object.find([widgetId, type],
				dispatcher.handlers);
			if (handler) {
				return true;
			}
		}
		return false;
	}
});
