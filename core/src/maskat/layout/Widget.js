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
 * すべてのマスカット部品の基底クラスです。
 *
 * <p>
 * マスカット部品のインスタンスはアプリケーション画面に表示される個々の部品
 * と対応し、レイアウトをルートとするツリー構造を構成します。通常、この構造
 * はレイアウト定義 XML を読み込むことで生成されます。
 * </p>
 * 
 * <h2>Ajax 部品のラッピング</h2>
 * <p>
 * マスカットフレームワークでは Ajax アプリケーションの画面で利用する部品
 * を独自に開発・提供することが目的ではないため、サードパーティ製の Ajax
 * ライブラリを薄くラップしたものを部品として利用します。
 * Ajax 部品をラップするためのクラス (Ajax 部品ラッパー) は Widget クラス
 * を継承して実装する必要があり、Ajax 部品に対して以下の機能を追加します。
 * </p>
 * <ul>
 *   <li>レイアウト定義 XML に記述された設定値やタグの親子関係を利用して
 *   Ajax 部品を生成する機能</li>
 *   <li>イベント定義 XML に記述された設定値を利用して Ajax 部品に対する
 *   データの設定・取得を行う機能</li>
 * </ul>
 *
 * <h2>Ajax 部品の生成</h2>
 * <p>
 * 部品の生成時には {@link maskat.layout.Layout#load} メソッドが生成した
 * {@link maskat.layout.WidgetCreationVisitor} オブジェクトにより、以下の
 * 順番で部品の生成メソッドが実行されます。
 * </p>
 * 
 * <ol>
 *   <li>createWidtet(parent)</li>
 *   <li>setParent(parent)</li>
 *   <li>(… XML の子要素として記述した部品の生成処理 …)</li>
 *   <li>postCreateWidget()</li>
 * </ol>
 * 
 * <p>
 * 1. および 2. では親となるマスカット部品が引数 parent として渡されます。
 * マスカット部品の実装クラスでは、利用する Ajax ライブラリの特性に応じて
 * HTML DOM の親子関係をいずれかのタイミングで接続します。
 * </p>
 * 
 * <ul>
 *   <li>多くのライブラリでは、DOM の親子関係を接続した状態で Ajax 部品の
 *   コンストラクタに HTML 要素を渡すことを要求します。この場合には 1. で
 *   HTML 要素の生成と親要素への接続を行い、Ajax 部品を生成します。</li>
 *   <li>Ajax 部品の生成後、親となる Ajax 部品に対して追加メソッドを実行
 *   することで、ライブラリ側で DOM の親子関係を設定する場合もあります。
 *   このような場合、1. で Ajax 部品の生成を行い、2. で部品の追加メソッド
 *   を実行します。</li>
 * </ul>
 * 
 * <p>
 * 生成した Ajax 部品は、マスカット部品の実装クラスの unwrap() メソッドに
 * よって取得可能です。
 * </p>
 *
 * @name maskat.layout.Widget
 */
maskat.lang.Class.declare("maskat.layout.Widget", {

	/** @scope maskat.layout.Widget.prototype */

	/** デフォルトのデータ取得元となるメソッド名またはプロパティ名 */
	defaultGetter: "value",

	/** デフォルトのデータ格納先となるメソッド名またはプロパティ名 */
	defaultSetter: "value",

	/**
	 * コンストラクタです。
	 */
	initialize: function(){
		this.parent = null;
		this.children = null;
		this.tabIndex = -1;
		this.keybinds = null;
	},
	
	/**
	 * このマスカット部品を格納しているレイアウトを取得します。
	 *
	 * <p>
	 * マスカット部品はツリー構造による包含関係の階層を持っており、この
	 * ツリー構造におけるルートノードがレイアウトとなります。
	 * </p>
	 *
	 * @returns このマスカット部品を格納しているレイアウト
	 */
	getLayout: function(){
		var parent = this.getParent();
		return parent ? parent.getLayout() : null;
	},
	
	/**
	 * このマスカット部品の親となるマスカット部品を取得します。
	 *
	 * @returns このマスカット部品の親となるマスカット部品
	 */
	getParent: function(){
		return this.parent;
	},
	
	/**
	 * このマスカット部品の親となるマスカット部品を設定します。
	 *
	 * @param parent このマスカット部品の親となるマスカット部品
	 */
	setParent: function(parent){
		this.parent = parent;
	},
	
	/**
	 * このマスカット部品に子ノードとなるマスカット部品を追加します。
	 *
	 * @param parent 子ノードとなるマスカット部品
	 */
	addChild: function(child){
		if (!this.children) {
			this.children = [];
		}
		this.children[this.children.length] = child;
		child.setParent(this);
	},
	
	/**
	 * このマスカット部品の子ノードの配列を取得します。
	 *
	 * @returns このマスカット部品の子ノードの配列
	 */
	getChildren: function(){
		return this.children;
	},
	
	/**
	 * このマスカット部品の部品 ID を取得します。
	 * 
	 * <p>
	 * 部品 ID はレイアウト内で一意の値となる必要があります。
	 * </p>
	 *
	 * @returns このマスカット部品の部品 ID
	 */
	getWidgetId: function(){
		return null;
	},
	
	/**
	 * このマスカット部品が参照している Ajax 部品を返します。
	 * 
	 * @deprecated このメソッドは以前のバージョンとの互換性のために残されて
	 *               おり、将来的に廃止される予定です。unwrap メソッドの使用
	 *               を推奨します。
	 * @returns このマスカット部品が参照している Ajax 部品
	 */
	getWidget: function(){
		/*
		 * サブクラスが unwrap() メソッドをオーバーライドしている場合、
		 * unwrap() メソッドへ処理を移譲する
		 */
		if (this.unwrap != maskat.layout.Widget.prototype.unwrap) {
			return this.unwrap();
		}
		return null;
	},
	
	/**
	 * このマスカット部品が参照している Ajax 部品を返します。
	 *
	 * @returns このマスカット部品が参照している Ajax 部品
	 */
	unwrap: function(){
		return this.getWidget();
	},
	
	/**
	 * このマスカット部品が参照する Ajax 部品を生成し、その Ajax 部品への
	 * 参照を返します。
	 *
	 * @param parent このマスカット部品の親となるマスカット部品
	 * @returns 生成した Ajax 部品
	 */
	createWidget: function(parent){
		return null;
	},
	
	/**
	 * Ajax 部品を生成後の後処理を行います。
	 */
	postCreateWidget: function(){
	},
	
	/**
	 * このマスカット部品が使用しているリソースを開放します。
	 */
	dispose: function(){
		maskat.lang.Object.dispose(this);
	},
	
	/**
	 * このマスカット部品が参照している HTML 要素を返します。
	 *
	 * @returns このマスカット部品が参照している HTML 要素
	 */
	getElement: function(){
		return null;
	},
	
	/**
	 * このマスカット部品の内部にある DOM ツリーに対し、指定した HTML 要素を
	 * 適切な位置へ格納します。
	 *
	 * @param element 追加する HTML 要素
	 */
	appendChildElement: function(element){
		var parent = this.getElement();
		if (parent) {
			parent.appendChild(element);
		}
	},
	
	/**
	 * このマスカット部品に含まれるコントロール要素を返します。
	 *
	 * </p>
	 * コントロール要素は HTML DOM 要素のうち、以下のいずれかのクラスに属する
	 * ものです。
	 * </p>
	 *
	 * <ul>
	 *   <li>HTMLAnchorElement</li>
	 *   <li>HTMLInputElement</li>
	 *   <li>HTMLSelectElement</li>
	 *   <li>HTMLTextAreaElement</li>
	 * </ul>
	 *
	 * <p>
	 * 詳細については Document Object Model (DOM) Level 2 Specification を
	 * 参照してください。
	 * </p>
	 *
	 * @returns このマスカット部品に含まれるコントロール要素
	 * @see <a href="http://www.w3.org/TR/2000/CR-DOM-Level-2-20000510/html.html">
	 *      Document Object Model (DOM) Level 2 Specification</a>
	 */
	getControlElement: function(){
		return null;
	},
	
	/**
	 * このマスカット部品が保持しているデータ値を取得します。
	 *
	 * @param key データ取得キー
	 * @returns このマスカット部品が保持しているデータ値
	 */
	getValue: function(key){
		if (typeof(key) == "undefined") {
			key = this.defaultGetter;
		}
	
		if (typeof(this[key]) == "function") {
			return this[key]();
		} else {
			return this[key];
		}
	},
	
	/**
	 * このマスカット部品にデータ値を格納します。
	 *
	 * @param value このマスカット部品に格納するデータ値
	 * @param key データ設定キー
	 */
	setValue: function(value, key){
		if (typeof(key) == "undefined") {
			key = this.defaultSetter;
		}

		if (typeof(this[key]) == "function") {
			this[key](value);
		} else {
			this[key] = value;
		}
	},

	/**
	 * このマスカット部品にデータ値をリセットします。
	 */
	clear: function(){
		this.setValue(undefined);
	},
	
	/**
	 * このマスカット部品に対するキーイベントを処理します。
	 *
	 * @param event キーイベント
	 *
	 * @returns 部品がキーイベントを処理した場合は false、それ以外は true
	 */
	handleKeyEvent: function(event){
		return true;
	},

	/**
	 * このマスカット部品が、引数で指定されたキーイベントに対応するキー
	 * バインドを持っている場合、そのキーバインドを返します。
	 * 
	 * @param event
	 *            キーイベント
	 * @returns キーイベントに対応するキーバインド 
	 */
	getKeybind: function(event) {
		if (this.keybinds) {
			for (var i = 0, len = this.keybinds.length; i < len; i++) {
				var keybind = this.keybinds[i];
				if (keybind.match(event)) {
					return keybind;
				}
			}
		}
		return undefined;
	},

	/**
	 * このマスカット部品にキーバインド追加します。
	 * 
	 * @param keybind
	 *            キーバインド
	 */
	addKeybind: function(keybind) {
		var layout = this.getLayout();
		
		/* キーバインド文字列を解析してキーコードを生成 */
		keybind.decode();

		/* コマンドと部品を接続する */
		if (keybind.commands) {
			for (var i = 0, len = keybind.commands.length; i < len; i++) {
				var command = keybind.commands[i];
				if (command.target) {
					var targetWidgetId = command.target;
					command.target = layout.getWidget(targetWidgetId);
					if (typeof(command.target) == "undefined") {
						throw new maskat.lang.Error("KEYBINDING_ERROR", { widget: targetWidgetId });
					}
				}
			}
		}

		if (!this.keybinds) {
			this.keybinds = [];
		}
		this.keybinds[this.keybinds.length] = keybind;
	},

	/**
	 * このマスカット部品にフォーカスを設定します。
	 */
	setFocus: function(){
		var element = this.getControlElement();
		if (element && typeof(element.focus) == "function") {
			element.focus();
		}
	},
	
	/**
	 * このマスカット部品のフォーカス移動が可能かを返します。
	 *
	 * @returns 部品にフォーカスを移動できる場合はtrue、できない場合はfalse
	 */
	canFocus: function(){
		return this.tabIndex > -1 && this.isEnabled();
	},
	
	/**
	 * このマスカット部品が表示されているかどうかを返します。
	 *
	 * @returns 表示の場合は true、非表示の場合は false
	 */
	isVisible: function(){
		var element = this.getElement();
		if (element) {
			if (element.style && element.style.display == "none") {
				return false;
			} else {
				var currentStyle = element.currentStyle || document.defaultView.getComputedStyle(element, null);
				if (currentStyle["display"] == "none") {
					return false;
				}
			}
		}
		var visibility;

		while (element && (!visibility || visibility == "inherit")) {
			if (element && element.style && element.style.visibility) {
				/* 要素に可視性が設定されている場合、その値を取得 */
				visibility = element.style.visibility;
			} else {
				/* 要素の可視性を計算する */
				var style = element.currentStyle || document.defaultView.getComputedStyle(element, null);
				visibility = style["visibility"];
			}
			element = element.parentNode;

			if (!element || element.nodeType == 9 || element.nodeType == 11) {
				return true;
			}
		}
		return visibility == "visible";
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
		}
	},

	/**
	 * このマスカット部品が有効かどうかを返します。
	 *
	 * @returns 有効の場合はtrue、無効の場合は false
	 */
	isEnabled: function(){
		var element = this.getControlElement();
		if (element && typeof(element.disabled) != "undefined") {
			return !element.disabled;
		}
		return true;
	},
	
	/**
	 * このマスカット部品が有効かどうかを設定します。
	 *
	 * @param enable 有効の場合は true、無効の場合は false
	 */
	setEnabled: function(enabled){
		var element = this.getControlElement();
		if (element && typeof(element.disabled) != "undefined") {
			element.disabled = !enabled;
		}
	},
	
	/**
	 * このマスカット部品のタブインデックスを返します。
	 *
	 * @returns タブインデックス
	 */
	getTabIndex: function(){
		return this.tabIndex;
	},
	
	/**
	 * このマスカット部品のタブインデックスグループ名を返します。
	 *
	 * @returns タブインデックスグループ名
	 */
	getTabIndexGroupName: function(){
		return this.tabIndexGroupName;
	},
	
	/**
	 * このマスカット部品で発生したイベントをリスナに通知します。
	 *
	 * @param eventType イベントタイプ
	 * @param args イベント引数
	 */
	notifyEvent: function(eventType, args){
		var layout = this.getLayout();
		var event = new maskat.event.Event(layout, this, eventType);
		event.arguments = args;
		layout.dispatchEvent(event);
	},
	
	/**
	 * マスカット部品のツリー構造を走査する WidgetVisitor を受け入れます。
	 *
	 * @param visitor 受け入れる WidgetVisitor のインスタンス
	 */
	accept: function(visitor){
		var visitChildren = visitor.visit(this);
		var children = this.getChildren();
		if (visitChildren && children) {
			for (var i = 0, len = children.length; i < len; i++) {
				if (children[i] instanceof maskat.layout.Widget) {
					children[i].accept(visitor);
				}
			}
		}
		visitor.postVisit(this);
	}

});
