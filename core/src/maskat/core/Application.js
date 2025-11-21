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
 * マスカットアプリケーションの実行状態を管理するクラスです。
 *
 * <p>
 * マスカットアプリケーションの起動プロセス (maskat.bootstrap) によって、
 * コンテナ HTML の読み込み完了時にこのクラスの唯一のインスタンスが生成
 * されて maskat.app プロパティへ格納されます。
 * </p>
 * <p>
 * ユーザ定義の JavaScript 関数では、この maskat.app オブジェクトを経由
 * してレイアウトやマスカット部品を操作することができます。
 * </p>
 *
 * @name maskat.core.Application
 */ 
maskat.lang.Class.declare("maskat.core.Application")
	.extend("maskat.core.Plugin", {

	_static: {
		/** @scope maskat.core.Application */
		
		/**
		 * クラスの静的イニシャライザです。
		 *
		 * Application はマスカットのプラグインとして実装されているため、
		 * プラグインマネージャにクラスを登録します。
		 */
		initialize: function() {
			maskat.core.Plugin.register(this);
		}
	},

	/** @scope maskat.core.Application.prototype */

	/**
	 * 新しいアプリケーションのインスタンスを生成します。
	 */
	initialize: function(){
		this.base();
	
		this.layouts = {};
		this.stylesheets = null;
		this.scripts = null;
		this.controller = null;
		this.error = null;
		
		this.properties = new maskat.util.Properties({
			"comm.sendInterval": {
				type: "number",
				defaultValue: 100
			},
			"comm.timeoutInterval": {
				type: "number",
				defaultValue: 500
			},
			"comm.poolSize": {
				type: "number",
				defaultValue: 2
			},
			"controller.src": {
				type: "string",
				defaultValue: "transition.xml"
			},
			"dialog.factory": {
				type: "string",
				defaultValue: "maskat.ui.JavaScriptDialogFactory"
			},
			"log.popup.focus": {
				type: "boolean",
				defaultValue: false
			},
			"log.default.level": {
				type: "string",
				defaultValue: "INFO"
			},
			"log.factory": {
				type: "string",
				defaultValue: "maskat.log.SimpleLogFactory"
			},
			"variable.scope": {
				type: "enum",
				defaultValue: "global",
				values: [ "global", "layout" ]
			},
			"variable.widget": {
				type: "enum",
				defaultValue: "unwrapped",
				values: [ "wrapped", "unwrapped", "none" ]
			},
			"schema.validation": {
				type: "boolean",
				defaultValue: true
			}
		});
	},

	/**
	 * プラグイン識別子を返します。
	 * 
	 * @returns プラグイン識別子
	 */
	getPluginId: function() {
		return "core";
	},

	/**
	 * プラグインのバージョン識別子を返します。
	 * 
	 * @returns プラグインのバージョン識別子
	 */
	getVersion: function() {
		return maskat.version;
	},

	isLoaded: function(){
		return this.loaded;
	},

	load: function(){
		this.loaded = true;
	
		/* 通信マネージャのパラメータを設定 */
		var comm = maskat.comm.CommunicationManager;
		comm.sendInterval = this.getProperty("comm.sendInterval");
		comm.timeoutInterval = this.getProperty("comm.timeoutInterval");
		comm.poolSize = this.getProperty("comm.poolSize");
		maskat.schemaValidation = this.getProperty("schema.validation");

		/* キーイベントハンドラを設定 */
		var keyHandler = function(event) {
			maskat.key.KeyEventManager.getInstance().handle(event);
		};
		maskat.util.CrossBrowser.addEventListener(document, "keydown", keyHandler);
		maskat.util.CrossBrowser.addEventListener(document, "keypress", keyHandler);
		maskat.util.CrossBrowser.addEventListener(document, "keyup", keyHandler);
	},
	
	start: function() {
		/* ログファクトリを設定 */
		var className, type;
		try {
			className = this.getProperty("log.factory");
			type = maskat.util.Converter.convert("function", className);
			maskat.log.LogFactory.factory = new type();
		} catch (e) {
			throw new maskat.lang.Error("LOG_FACTORY_INIT_FAILED",
				{ className: className }, e);
		}

		/* ダイアログファクトリを設定 */
		try {
			className = this.getProperty("dialog.factory");
			type = maskat.util.Converter.convert("function", className);
			maskat.ui.Dialog.factory = new type();
		} catch (e) {
			throw new maskat.lang.Error("DIALOG_FACTORY_INIT_FAILED",
				{ className: className }, e);
		}
	},

	/**
	 * アプリケーションの実行を開始します。
	 */
	run: function(){
		/* アプリケーションコントローラを起動 */
		try {
			this.loadController(this.getProperty("controller.src"));
		} catch (e) {
			maskat.app.handleError(e);
		}
		if (this.controller) {
			this.controller.start();
		}
	},

	/**
	 * 画面遷移定義 XML を読み込んで、アプリケーションコントローラを
	 * 構成します。
	 * 
	 * @param url 画面遷移定義 XML の URL
	 */
	loadController: function(url){
		var controller;
		try {
			controller = maskat.control.TransitionXMLReader.getInstance().load(url);
			controller.setApplication(this);
			this.controller = controller;
		} catch (e) {
			var cause = e.cause;
			if (e.cause && e.cause.key == "HTTP_404") {
				/*
				 * 画面遷移定義 XML が見つからない (HTTP ステータス 404) の
				 * 場合はエラーではなく、警告メッセージを表示
				 */
				var logger = maskat.log.LogFactory.getLog("maskat.core");
				logger.warn(e.getMessages ? e.getMessages().join("\n") : e.message);
			} else {
				/* その他の例外は呼び出し元にスロー */
				throw e;
			}
		}
	},
	
	/**
	 * 指定したレイアウト ID に対応するレイアウトを取得します。
	 * 
	 * @param layoutId レイアウト ID
	 * 
	 * @returns 指定したレイアウト ID に対応するレイアウト、
	 *          そのようなレイアウトが存在しない場合は undefined
	 */
	getLayout: function(layoutId){
		return this.layouts ? this.layouts[layoutId] : undefined;
	},
	
	/**
	 * 指定したレイアウト ID に対応するレイアウトをロードします。
	 * 
	 * @param layoutURL レイアウト定義 XML の URL
	 * @param eventURL イベント定義 XML の URL
	 * @param element レイアウトをロードする HTML 要素
	 * @param visible レイアウトを表示する場合は true、非表示の場合は false
	 * 
	 * @returns ロードされたレイアウト
	 */
	loadLayout: function(layoutURL, eventURL, element, visible){
		var layout;

		/* すでにロード済みの場合、レイアウトの表示／非表示を設定する */
		for (var name in this.layouts) {
			layout = this.layouts[name];
			if (layout.url == layoutURL) {
				if (visible) {
					layout.show();
				} else {
					layout.hide();
				}
				return layout;
			}
		}	

		/* レイアウトを新規にロードする */
		layout = maskat.layout.LayoutXMLReader.getInstance().load(layoutURL);
		layout.url = layoutURL;
		this.layouts[layout.getWidgetId()] = layout;

		/* レイアウト変数のスコープを設定 */
		switch (this.getProperty("variable.scope")) {
		case "global":
			layout.scope = window;
			break;
		case "layout":
			layout.scope = {};
			break;
		}

		/* レイアウト変数へのマスカット部品の登録方法を設定 */
		layout.widgetVariableType = this.getProperty("variable.widget");

		if (eventURL) {
			var dispatcher = maskat.event.EventXMLReader.getInstance().load(eventURL);
			layout.addEventListener(dispatcher);
			dispatcher.setController(this.controller);
		}

		layout.load(element, visible);
		return layout;
	},
	
	/**
	 * 指定したレイアウト ID に対応するレイアウトをアンロードします。
	 * 
	 * @param layoutId レイアウト ID
	 */
	unloadLayout: function(layoutId){
		var layout = this.getLayout(layoutId);
		if (layout) {
			layout.unload();
			delete this.layouts[layoutId];
		}
	},
	
	/**
	 * 現在の HTML 文書に新しい CSS スタイルシートを読み込みます。
	 * 
	 * @param url CSS スタイルシート (*.css) の URL
	 */
	loadStyleSheet: function(url){
		if (this.stylesheets && this.stylesheets[url]) {
			return;
		}
		
		/* head 要素の子要素として style 要素を追加 */
		var link = document.createElement("link");
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = url;
		
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(link);
		
		if (!this.stylesheets) {
			this.stylesheets = {};
		}
		this.stylesheets[url] = link;
	},
	
	/**
	 * 現在の HTML 文書に新しい JavaScript ファイルを読み込みます。
	 *
	 * <p> 
	 * 非同期読み込みの場合、このメソッドの呼び出し直後には JavaScript が
	 * 解析されていないため、読み込んだスクリプトの内容を利用できません。
	 * このため、setTimeout 関数などを用いて解析を待つ必要があります。
	 * </p>
	 * 
	 * @param url JavaScript ファイル (*.js) の URL
	 * @param async 非同期読み込みの場合は true
	 */
	loadJavaScript: function(url, async){
		if (this.scripts && this.scripts[url]) {
			return;
		}
		var script;
		if (async) {
			/* head 要素の子要素として script 要素を追加 */
			script = document.createElement("script");
			script.type = "text/javascript";
			script.src = url;
			var head = document.getElementsByTagName("head")[0];
			head.appendChild(script);
			
		} else {
			/*
			 * HTTP GET メソッドで取得した JavaScript ソースコードを
			 * グローバルスコープで評価する
			 */
			try {
				var source = maskat.util.CrossBrowser.getTextFrom(url);
				script = this.loadJavaScriptFromString(source);
				/*
				 * デバッグモードの場合、同期ロード後に非同期で読み込む
				 * ことで、Firebug などでのデバッグ実行を可能にする。
				 * ただし、同一のファイルを重複して読み込むため、
				 * JS ファイル直下に記載された処理は重複して実行される。
				 */ 
				if (maskat.debug) {
					this.loadJavaScript(url, true);
				}
			} catch (e) {}
		}
		if (!this.scripts) {
			this.scripts = {};
		}
		this.scripts[url] = script;
	},

	/**
	 * 現在の HTML 文書に JavaScript ソース文字列を読み込みます。
	 * 
	 * @param source JavaScript ソースコード文字列
	 */
	loadJavaScriptFromString: function(source){
		/* head 要素の子要素として script 要素を追加 */
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.text = source;
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(script);
		return script;
	},

	/**
	 * キーバインド定義 XML を読み込んで、レイアウトにキーイベントハンドラ
	 * を設定します。
	 * 
	 * @param url キーバインド定義XMLファイル の URL
	 */
	loadKeyBinding: function(url){
		var keybinding = maskat.key.KeyBindingXMLReader.getInstance().load(url);
		var layout = maskat.app.getLayout(keybinding.layout);

		/* デフォルト (グローバル) のキーバインドを設定 */
		var binds = keybinding["default"] && keybinding["default"].binds; 
		if (typeof(layout) == "undefined" ){
			throw new maskat.lang.Error("KEYBINDING_ERROR", { widget: keybinding.layout });
		} else if (typeof(binds) != "undefined") {
			for (var i = 0, l = binds.length; i < l; i++) {
				layout.addKeybind(binds[i]);
			}
		}
		
		/* コンポーネントごとのキーバインドを設定 */
		if (typeof(keybinding.components) != "undefined") {
			for (var widgetId in keybinding.components) {
				var widget = layout.getWidget(widgetId);
				var binds = keybinding.components[widgetId].binds;

				if (typeof(widget) == "undefined" ){
					throw new maskat.lang.Error("KEYBINDING_ERROR", { widget: widgetId });
				} else if(typeof(binds) != "undefined"){
					for (var j = 0, m = binds.length; j < m; j++) {
						widget.addKeybind(binds[j]);
					}
				}
			}
		}
	},

	/**
	 * マスカットアプリケーションの実行中に発生したエラーを処理します。
	 *
	 * @param error エラーオブジェクト
	 */
	handleError: function(error) {
		if (maskat.error && maskat.error instanceof maskat.lang.Error) {
			if (maskat.error.getCauseError() != error) {
				/* エラーを maskat.error プロパティに記憶 */
				maskat.error = error;
			}
		} else {
			/* エラーを maskat.error プロパティに記憶 */
			maskat.error = error;
		}
		/* エラーの根本原因を再スローし、window.onerror 関数へ引き継ぐ */
		var e = error;
		while (e.cause) {
			e = e.cause;
		}
		throw e;
	}

});
