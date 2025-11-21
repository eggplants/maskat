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
 * マスカットフレームワークにおけるプラグインを定義する抽象クラスです。
 * プラグインは以下の規約に従って作成する必要があります:
 *
 * <h2>プラグイン識別子</h2>
 * <p>
 * プラグインを一意に識別する任意の文字列です。プラグイン実装クラスの
 * getPluginId() メソッドはプラグイン識別子を返します。"core" という
 * 文字列はマスカットフレームワークのために予約されており、プラグイン
 * 識別子として利用することはできません。
 * </p>
 *
 * <h2>プラグインの格納位置</h2>
 * <p>
 * マスカットフレームワークのフォルダの直下にプラグイン識別子と同じ名前
 * を持つフォルダを作成し、このフォルダ内に plugin.js というファイル名で
 * JavaScript ファイルを配置します。
 * </p>
 * <pre>
 *   例) プラグイン識別子 "myplugin" の格納位置
 *       maskat/myplugin/plugin.js
 * </pre>
 *
 * <h2>プラグイン実装クラス</h2>
 * <p>
 * プラグイン実装クラスは {@link maskat.core.Plugin} クラスを継承して実装
 * します。プラグイン実装者は plugin.js が読み込まれたさいに、
 * <code>maskat.core.Plugin</code> クラスのプラグインレジストリ (ハッシュ)
 * にプラグインを登録する必要があります。
 * </p>
 *
 * <h2>プラグインの動作状態</h2>
 * <p>プラグイン実装クラスのインスタンスはプラグインマネージャ
 * {@link maskat.core.PluginManager} によって管理され、動作状態に応じて
 * 以下のステータスが setStatus() メソッド経由で設定されます。
 * </p>
 * <ul>
 *   <li>INIT: プラグイン実装クラスをインスタンス化した直後の初期状態</li>
 *   <li>INSTALL: プラグインをプラグインマネージャに登録した直後の状態</li>
 *   <li>LOADING: プラグインの実行に必要なリソースを読み込んでいる状態</li>
 *   <li>READY: リソースの読み込みが完了し、実行可能な状態</li>
 *   <li>RUNNING: プラグインを実行中の状態</li>
 * </ul>
 * <p>
 * これらのステータスはプラグイン実装クラスの getStatus() メソッドで取得
 * できます。なお、setStatus() メソッドはプラグインマネージャ以外のクラス
 * から実行されることを想定していないプライベートな API です。
 * </p>
 *
 * @name maskat.core.Plugin
 */ 
maskat.lang.Class.declare("maskat.core.Plugin", {

	_static: {
		
		/** @scope maskat.core.Plugin */
	
		/** 初期状態 */
		INIT: 1,

		/** プラグインマネージャに登録した直後の状態を表す定数 */
		INSTALL: 2,

		/** リソース読み込み中の状態を表す定数 */
		LOADING: 3,

		/** 実行可能な状態を表す定数 */
		READY: 4,

		/** 実行中の状態を表す定数 */
		RUNNING: 5,

		/** プラグインのクラスを登録するレジストリ */
		registry: {},		

		/**
		 * レジストリにプラグインの実装クラスを登録します。
		 *
		 * プラグインの実装クラスは maskat.core.Plugin クラスを継承し、引数
		 * なしのコンストラクタを持っている必要があります。
		 * 
		 * @param clazz プラグインの実装クラス
		 */
		register: function(clazz) {
			var pluginId = clazz.prototype.getPluginId();
			this.registry[pluginId] = clazz;
		}
	},

	/** @scope maskat.core.Plugin.prototype */

	/**
	 * コンストラクタです。
	 */
	initialize: function() {
		this.status = maskat.core.Plugin.INIT;
		this.properties = new maskat.util.Properties();
	},

	/**
	 * プラグインの実行状態を返します。
	 *
	 * @returns プラグインの実行状態
	 */
	getStatus: function() {
		return this.status;
	},

	/**
	 * プラグインの実行状態を設定します。
	 *
	 * @param status プラグインの実行状態
	 */
	setStatus: function(status) {
		this.status = status;
	},

	/**
	 * プラグインのプロパティ値を取得します。
	 *
	 * @param key プロパティキー
	 * @returns 指定したキーに対応するプロパティ値 
	 */
	getProperty: function(key) {
		return this.properties.getProperty(key);
	}, 

	/**
	 * プラグインのプロパティを設定します。
	 *
	 * @param key プロパティキー
	 * @param value プロパティの値
	 */
	setProperty: function(key, value) {
		this.properties.setProperty(key, value);
	}, 

	/**
	 * プラグインのプロパティをプロパティキーと値が対になったオブジェクトで
	 * まとめて設定します。
	 *
	 * @param values プロパティキーと値が対になったオブジェクト 
	 */
	setProperties: function(values) {
		this.properties.setProperties(values);
	}, 

	/**
	 * プラグイン識別子を返します。
	 * 
	 * @returns プラグイン識別子
	 */
	getPluginId: function() {
		return null;
	},

	/**
	 * プラグインのバージョン識別子を返します。
	 * 
	 * @returns プラグインのバージョン識別子
	 */
	getVersion: function() {
		return null;
	},

	/**
	 * このプラグインの読み込みや実行が、別のプラグインの読み込みや実行に
	 * 依存している場合、依存先となるプラグインの識別子を配列で返します。
	 *
	 * @returns プラグイン識別子を要素とする配列、依存関係がなければ null
	 */
	getDependencies: function() {
		return null;
	},

	/**
	 * load() メソッドによるリソースの読み込みが完了しているかどうかを判定
	 * します。
	 * 
	 * </p>
	 * このメソッドはプラグインマネージャから一定の間隔で呼び出されるため、
	 * プラグインやアプリケーションの状態を変更するような副作用を持つべき
	 * ではありません。
	 * </p>
	 * 
	 * @returns ロードが完了していれば true、それ以外の場合は false
	 */
	isLoaded: function() {
		return true;
	},

	/**
	 * プラグインの実行に必要なリソースを読み込みます。
	 *
	 * <p>
	 * プラグイン実装クラスではこのメソッドを実装して、プラグインの実行に
	 * 必要な JavaScript や CSS スタイルシートなどのリソースを現在の HTML
	 * 文書に追加します。
	 * </p>
	 * <p>
	 * この API が呼ばれる段階では HTML 文書の読み込みが完了しているため、
	 * 以下の制約があります。
	 * </p>
	 * <ul>
	 *   <li>document.write(), document.writeln() を利用したドキュメントへの
	 *   書き込みはできない</li>
	 *   <li>window や document の onload イベントはすでに発生している</li>
	 * </ul>
	 *
	 * @see maskat.core.Application#loadStyleSheet
	 * @see maskat.core.Application#loadJavaScript
	 */
	load: function() {
		/* NOP */
	},

	/**
	 * プラグインの実行を開始します。
	 *
	 * <p>
	 * サードパーティ製の JavaScript ライブラリをプラグインで読み込んだ場合、
	 * start() メソッド内で onload イベントに対するハンドラ関数を呼び出して
	 * イベントをエミュレートする必要があるかもしれません。
	 * </p>
	 *
	 */
	start: function() {
		/* NOP */
	}

});
