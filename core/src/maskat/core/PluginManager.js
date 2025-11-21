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
 * プラグインの実行状態を管理するクラスです。
 *
 * @name maskat.core.PluginManager
 */ 
maskat.lang.Class.declare("maskat.core.PluginManager", {

	_static: {
	
		/** @scope maskat.core.PluginManager */
	
		/**
		 * このクラスの唯一のインスタンスを返します。(Singleton パターン)
		 *
		 * @returns このクラスの唯一のインスタンス
		 */
		getInstance: function() {
			var self = arguments.callee;
			if (!self.instance) {
				self.instance = new this();
			}
			return self.instance;
		}
	},
	
	/** @scope maskat.core.PluginManager.prototype */

	/**
	 * コンストラクタです。
	 *
	 * @param properties プロパティ
	 */
	initialize: function(properties) {
		this.plugins = {};
		this.properties = properties || {};
		this.loader = new maskat.lang.Thread(this, this.process, null, 10);
	},

	/**
	 * プラグインごとのプロパティを指定した URL から JSON フォーマットで
	 * 読み込みます。
	 *
	 * <p> 
	 * プラグインのプロパティは {@link #launch} メソッドを実行する前に
	 * 設定する必要があります。
	 * </p>
	 *
	 * @param url プロパティファイル (JSON 形式) の URL
	 */
	loadProperties: function(url){
		var properties = maskat.util.CrossBrowser.loadJSONFrom(url);

		/* マスカット 2.0 形式のプロパティ形式をサポート */
		if (properties["maskat.core.plugins"]) {
			var newprop = properties["maskat.core.plugins"];
			delete properties["maskat.core.plugins"];
			
			newprop.core = { enabled: true };
			if (properties["maskat.ui.dialog.factory"]) {
				newprop.core["dialog.factory"] = properties["maskat.ui.dialog.factory"];
				delete properties["maskat.ui.dialog.factory"];
			}

			for (var key in properties) {
				newprop.core[key.substring(7)] = properties[key];
				delete properties[key];
			}
			properties = newprop;
		}

		for (var pluginId in properties) {
			this.setProperties(pluginId, properties[pluginId]);
		}
	},

	/**
	 * 指定したプラグインのプロパティを設定します。
	 *
	 * <p> 
	 * プラグインのプロパティは {@link #launch} メソッドを実行する前に
	 * 設定する必要があります。
	 * </p>
	 * 
	 * @param pluginId プラグイン識別子
	 * @param properties プラグインのプロパティ
	 */
	setProperties: function(pluginId, properties){
		if (!this.properties[pluginId]) {
			this.properties[pluginId] = properties;
		} else {
			maskat.lang.Object.populate(this.properties[pluginId], properties);
		}
	},

	/**
	 * プロパティで有効化されているすべてのプラグインをインストールします。
	 * それらのプラグインがすべて実行状態になった段階で、引数で指定された
	 * コールバック関数を実行します。
	 *
	 * @param onReady コールバック関数
	 */
	launch: function(onReady) {
		/* 有効化されているすべてのプラグインをインストール */
		for (var pluginId in this.properties) {
			if (this.properties[pluginId].enabled) {
				this.installPlugin(pluginId);
			}
		}

		/* プラグインローダーのスレッドを起動 */
		if (!this.loader.isRunning()) {
			if (typeof(onReady) == "function") {
				this.onReady = onReady;
			}
			this.loader.start();
		}
	},

	/**
	 * プラグインローダーのスレッドから一定間隔で実行される内部メソッドです。
	 *
	 * <p>
	 * プラグインマネージャに登録されているすべてのプラグイン識別子について
	 * 以下の処理を実行します。
	 * </p>
	 * <ol>
	 *   <li>プラグインマネージャにプラグイン識別子に対応するプラグインの
	 *   インスタンスが登録されていない場合、プラグインのインストール処理
	 *   を行います。</li>
	 *   <li>プラグインがインストール済み状態 (INSTALL) の場合、プラグイン
	 *   のロード処理を実行します。</li>
	 *   <li>プラグインがロード中 (LOADING) の場合、読み込みが完了している
	 *   かどうかを確認します。読み込みが完了していれば、プラグインの状態
	 *   を READY に設定します。</li>
	 *   <li>登録されているすべてのプラグインが実行可能状態 (READY) に到達
	 *   した場合、プラグインローダーのスレッドを停止し、onReady() メソッド
	 *   をコールバックします。</li>
	 * </ol>
	 */
	process: function() {
		try {
			/* 各プラグインの状態によって処理を分岐 */
			for (var pluginId in this.plugins) {
				var plugin = this.getPlugin(pluginId); 
				if (plugin) {
					switch (plugin.getStatus()) {
					case maskat.core.Plugin.INSTALL:
						/* インストール済みの場合はロード処理を実行 */
						this.loadPlugin(pluginId);
						break;
			
					case maskat.core.Plugin.LOADING:
						/* ロード中の場合はロードが完了しているか確認 */
						if (plugin.isLoaded()) {
							plugin.setStatus(maskat.core.Plugin.READY); 
						}
						break;
					}
				} else {
					/*
					 * プラグイン (plugin.js) の自動読み込み中の場合は
					 *インストール処理を再試行
					 */
					this.installPlugin(pluginId);
				}
			}
			
			/* すべてのプラグインのロードが完了した場合、スレッドを停止 */
			if (this.isReady()) {
				this.loader.stop();
				for (var pluginId in this.plugins) {
					this.startPlugin(pluginId);
				}
			}
		} catch (e) {
			this.loader.stop();
			maskat.app.handleError(e);
		}
		if (this.isReady()) {
			this.onReady();
		}
	},

	/**
	 * すべてのプラグインのロードが完了しているかどうかを返します。
	 *
	 * @returns ロードが完了している場合は true, それ以外の場合は false
	 */
	isReady: function() {
		for (var pluginId in this.plugins) {
			var plugin = this.getPlugin(pluginId);
			if (!plugin || plugin.getStatus() < maskat.core.Plugin.READY) {
				return false;
			}
		}
		return true;
	},

	/**
	 * すべてのプラグインのロード完了時に実行されるコールバックメソッドです。
	 *
	 * <p>
	 * このメソッドはサブクラスやインスタンスメソッドでオーバーライドされる
	 * ことを意図しています。
	 * </p>
	 */
	onReady: function() {
		/* NOP */
	},

	/**
	 * 指定されたプラグイン識別子を持つプラグインを検索し、プラグインの
	 * インスタンスを返却します。
	 *
	 * @param pluginId プラグイン識別子
	 * @returns プラグインのインスタンス
	 */
	getPlugin: function(pluginId) {
		return this.plugins[pluginId];
	},

	/**
	 * 新しいプラグインをインストールします。
	 *
	 * <p>
	 * 指定されたプラグイン識別子に対応するプラグイン実装クラスがプラグイン
	 * レジストリに見つからない場合、plugin.js を現在の HTML 文書に読み込み、
	 * プラグインレジストリにプラグイン実装クラスが登録されるのを待ちます。
	 * </p>
	 *
	 * <p>
	 * プラグイン実装クラスが登録されている場合は、プラグインをインスタンス
	 * 化し、プラグインの状態をインストール済み状態 (INSTALL) に設定します。
	 * 指定されたプラグインが他のプラグインに依存している場合には、それらの
	 * プラグイン識別子をプラグインマネージャに登録します。
	 * </p>
	 *
	 * @param pluginId プラグイン識別子
	 */
	installPlugin: function(pluginId) {
		var pluginClass = maskat.core.Plugin.registry[pluginId]; 
		var plugin = this.getPlugin(pluginId);

		/* プラグインクラスが未登録の場合、plugin.js を自動的に読み込む */		
 		if (!pluginClass) {
 			if (typeof(plugin) == "undefined") {
 				var url = maskat.location + pluginId + "/plugin.js";
 				if (maskat.debug) {
 					url = url + ".uncompressed";
 				}
				maskat.app.loadJavaScript(url, true);
				this.plugins[pluginId] = false;
			}
			return;
		}

		/* プラグインを取得 (または生成) する */
		if (!plugin) {
			plugin = new pluginClass();
			this.plugins[pluginId] = plugin; 
		}

		/* すでにインストール処理を開始済みの場合は何もしない */
		if (plugin.getStatus() >= maskat.core.Plugin.INSTALL) {
			return;
		}
		plugin.setStatus(maskat.core.Plugin.INSTALL);
		plugin.setProperties(this.properties[pluginId]);

		/* 依存関係にあるプラグインをインストール */
		var dependencies = plugin.getDependencies();
		if (dependencies) {
			for (var i = 0, len = dependencies.length; i < len; i++) {
				this.installPlugin(dependencies[i]);
			}
		}
	},

	/**
	 * プラグインのロード処理を実行します。
	 *
	 * <p>
	 * 指定されたプラグインが他のプラグインに依存している場合は依存先のプラ
	 * グインのロードを先に行い、その完了を待ちます。プラグインマネージャは
	 * プラグイン実装クラスの load() メソッドを実行し、プラグインの動作状態
	 * を LOADING に設定します。
	 * <p>
	 *
	 * @param pluginId プラグイン識別子
	 */
	loadPlugin: function(pluginId) {
		var plugin = this.getPlugin(pluginId);

		/* すでにロード処理を開始済みの場合は何もしない */
		if (plugin.getStatus() >= maskat.core.Plugin.LOADING) {
			return;
		}

		/* 依存関係にあるプラグインのロード完了まで待機する */
		var dependencies = plugin.getDependencies();
		if (dependencies) {
			for (var i = 0, len = dependencies.length; i < len; i++) {
				var dependee = this.getPlugin(dependencies[i]);
				if (!dependee || dependee.getStatus() < maskat.core.Plugin.READY) {
					return;
				}
			}
		}

		/* プラグインのロード処理を実行 */
		if (!plugin.isLoaded()) {
			plugin.load();
		}
		plugin.setStatus(maskat.core.Plugin.LOADING);
	},

	/**
	 * 指定されたプラグインの実行を開始します。
	 *
	 * <p>
	 * 指定されたプラグインが他のプラグインに依存している場合、依存先のプラ
	 * グインの実行を先に行います。プラグインマネージャはプラグインの start()
	 * メソッドを実行し、動作状態を RUNNING に設定します。
	 * </p>
	 *
	 * @param pluginId プラグイン識別子
	 */
	startPlugin: function(pluginId){
		var plugin = this.getPlugin(pluginId);

		/* すでに実行中の場合は何もしない */
		if (plugin.getStatus() >= maskat.core.Plugin.RUNNING) {
			return;
		}
		plugin.setStatus(maskat.core.Plugin.RUNNING);

		/* 依存関係にあるプラグインを再帰的に実行 */
		var dependencies = plugin.getDependencies();
		if (dependencies) {
			for (var i = 0, len = dependencies.length; i < len; i++) {
				this.startPlugin(dependencies[i]);
			}
		}

		/* プラグインを実行 */
		plugin.start(this);
	}

});
