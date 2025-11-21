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
/** 名前空間 maskat が未定義の場合にはここで定義する */
if (typeof(maskat) == "undefined") { maskat = {}; }

/** @namespace */
maskat.lang = {

	/**
	 * @class
	 * オブジェクトの検索や生成、プロパティ操作などのユーティリティ関数を
	 * 提供します。
	 */
	Object: {
		/**
		 * スコープ内から指定したパス文字列で取得できるオブジェクトを
		 * 返します。
		 *
		 * @param path パス文字列 (プロパティを "." で区切った文字列)、
		 *             または文字列の配列
		 * @param scope スコープの起点オブジェクト、省略時は window
		 *
		 * @returns JavaScript オブジェクト、見つからなければ undefined
		 */
		find: function(path, scope){
			var segments = (path instanceof Array) ? path : path.split(".");
			scope = (arguments.length > 1) ? scope : window;

			if (scope) {
				for (var i = 0, len = segments.length; i < len; i++) {
					if (typeof(scope[segments[i]]) == "undefined") {
						return undefined;
					}
					scope = scope[segments[i]];
				}
			}
			return scope;
		},
		
		/**
		 * スコープ内の指定したパスにオブジェクトを生成します。
		 *
		 * パス上に該当するオブジェクトが存在しない場合には、それらの
		 * オブジェクトが自動的に生成されます。
		 *
		 * @param path パス文字列 (プロパティを "." で区切った文字列)、
		 *             または文字列の配列
		 * @param scope スコープの起点オブジェクト、省略時は window
		 *
		 * @returns 生成されたオブジェクト
		 */
		create: function(path, scope){
			var segments = (path instanceof Array) ? path : path.split(".");
			scope = (arguments.length > 1) ? scope : window;

			if (scope) {
				for (var i = 0, len = segments.length; i < len; i++) {
					if (!scope[segments[i]]) {
						scope[segments[i]] = {};
					}
					scope = scope[segments[i]];
				}
			}
			return scope;
		},
		
		/**
		 * あるオブジェクトのプロパティをすべて、もう一方のオブジェクトに
		 * コピーします。
		 * 
		 * @param object
		 *            コピー先のオブジェクト
		 * @param properties
		 *            コピーするプロパティを格納したオブジェクト
		 * @param deep
		 *            プロパティがオブジェクトや配列型の場合にそれらを深く
		 *            マージするかどうか指定するフラグ
		 * 
		 * @returns プロパティをコピーされたオブジェクト
		 */
		populate: function(object, properties, deep){
			if (deep && object instanceof Array && properties instanceof Array) {
				Array.prototype.push.apply(object, properties);
			} else {
				for (var key in properties) {
					if (deep && object[key] && (typeof(object[key]) == "object")) {
						this.populate(object[key], properties[key], true);
					} else {
						object[key] = properties[key];
					}
				}
			}
			return object;
		},

		/**
		 * 指定したオブジェクトのプロパティをすべて削除します。
		 *
		 * @param object プロパティを削除するオブジェクト
		 */
		dispose: function(object) {
			// TODO: Safari 2.02 以前には hasOwnProperty メソッドがない
			for (var property in object) {
				if (object.hasOwnProperty(property)) {
					delete object[property];
				}
			}
		},

		/**
		 * JSON (JavaScript Object Notation) で記述されたリテラルを評価して
		 * オブジェクトを返します。
		 *
		 * @returns オブジェクト
		 */
		parseJSON: function(text){
			/* JSON パーサが読み込まれている場合は利用する */
			try {
				if (typeof(JSON) != "undefined" && typeof(JSON.parse) == "function") {
					return JSON.parse(text);
				}
			} catch (e) { /* suppress */ }
			return eval("(" + text + ")");
		},
		/**
		 * 指定されたオブジェクトを JSON 形式の文字列にエンコードして返却
		 * します。
		 *
		 * @returns JSON 形式にエンコードされた文字列
		 */
		encodeJSON: function(object) {
			/* JSON パーサが読み込まれている場合は利用する */
			if (typeof(JSON) != "undefined" && typeof(JSON.stringify) == "function") {
				try {
					return JSON.stringify(object);
				/*
				 * JSONパーサでは循環参照を持つオブジェクトをエンコードすること
				 * ができない。循環参照によるエラーが発生した場合、マスカットが
				 * 実装しているパーサを利用する
				 */
				} catch (e) { /* suppress */ }
			}
			var stack = [];
			
			function _indexOf(object) {
				for (var i = 0, len = stack.length; i < len; i++) {
					if (stack[i] === object) {
						return i;
					}
				}
				return -1;
			}
			
			function _isAddProperty(object) {
				var type = typeof(object);
				if (type == "object") {
					return _indexOf(object) == -1;
				}
				if (type == "function") {
					return false;
				}
				return true;
			}
			function _encodeJSON(object) {
				var type = typeof(object);
				var result = [], length = 0;
				var comma = ", ", dq = "\"", dqe = "\":";

				if (object === null) {
					result[length++] = "null";
				} else if (object === undefined) {
					result[length++] = "undefined";
				} else if (object instanceof Array) {
					result[length++] = "[";
					var f = false;
					for (var i = 0, len = object.length; i < len; i++) {
						if (_isAddProperty(object[i])) {
							if (f) {
								result[length++] = comma;
							} else {
								f = true;
							}
							result[length++] = _encodeJSON(object[i]);
						}
					}
					result[length++] = "]";
				} else if (type == "object") {
					stack[stack.length] = object;
					result[length++] = "{";
					var f = false;
					for (var j in object) {
						if (_isAddProperty(object[j])) {
							if (f) {
								result[length++] = comma;
							} else {
								f = true;
							}
							result[length++] = dq;
							result[length++] = j;
							result[length++] = dqe;
							result[length++] = _encodeJSON(object[j]);
						}
					}
					result[length++] = "}";
					stack.pop(object);
				} else if (type == "string") {
					result[length++] = dq;
					result[length++] = object;
					result[length++] = dq;
				} else if (type != "function") {
					result[length++] = object.toString();
				}
				return result.join("");
			}
			return _encodeJSON(object);
		}
	},

	/**
	 * @class
	 * 新しいクラスを宣言する記法を提供します。
	 *
	 * <h2>クラスの宣言</h2>
	 * <p>
	 * このクラスの提供する静的メソッド {@link maskat.lang.Class.declare} を
	 * 使用すると新しいクラスを以下のような形式で宣言することができます:
	 * </p>
	 *
	 * <pre>
	 * maskat.lang.Class.declare("maskat.example.Person", {
	 *     initialize: function(name, age) {
	 *         this.name = name;
	 *         this.age = age;
	 *     },
	 * 
	 *     sayHello: function() {
	 *         alert("Hello " + this.name);
	 *     }
	 * });
	 * </pre>
	 *
	 * <h2>オブジェクトの生成</h2>
	 * <p>
	 * プロパティ名 initialize で指定された関数はコンストラクタとして使用
	 * されます。このプロパティが省略された場合には空の関数が使用されます。
	 * 宣言したクラスは new 演算子でインスタンス化することができます:
	 * </p>
	 *
	 * <pre>
	 * var alice = new maskat.example.Person("Alice", 20);
	 * alice.sayHello();
	 * </pre>
	 *
	 * <h2>クラスの継承</h2>
	 * <p>
	 * クラス宣言に続けて {@link maskat.lang.Class#extend} メソッドを使用
	 * すると、宣言したクラスを他のクラスのサブクラスにすることができます:
	 * </p>
	 *
	 * <pre> 
	 * maskat.lang.Class.declare("maskat.example.Employee")
	 *     .extend("maskat.example.Person", {
	 *
	 *     initialize: function(name, age, salary) {
	 *         this.base(name, age);
	 *         this.salary = salary;
	 *     },
	 *
	 *     getSalary: function() {
	 *         return this.saraly;
	 *     }
	 * });
	 * </pre> 
	 *
	 * <p>
	 * コンストラクタ内から呼び出している this.base メソッドは親クラスの
	 * コンストラクタを参照しています。
	 * </p>
	 *
	 * <h2>クラスの静的メンバ</h2>
	 * <p>
	 * クラスのメンバ名に <code>_static</code> を指定し、オブジェクトを値
	 * として指定すると、そのオブジェクトのプロパティがすべてクラスの静的
	 * メンバとして追加されます。プロパティ名 initialize を持つ関数が静的
	 * メンバとして指定されている場合は、クラスの宣言直後にその関数を実行
	 * します。 
	 * </p>
	 *
	 * <pre>
	 * maskat.lang.Class.declare("maskat.example.Directory", {
	 *     _static: {
	 *         directory: {},
	 * 
	 *         find: function(name) {
	 *             return this.directory[name];			
	 *         },
	 *
	 *         initialize: function() {
	 *             this.directory["alice"] =  new maskat.example.Person("alice", 20);
	 *             this.directory["bob"] = new maskat.example.Person("bob", 32);
	 *             this.directory["carol"] =  new maskat.example.Person("carol", 17);
	 *         }
	 *     },
	 * });
	 * </pre>
	 */
	Class: {
		/**
		 * 新しいクラスを宣言します。
		 *
		 * この静的メソッドは新しいクラスのコンストラクタ関数を作成し、
		 * prototype オブジェクトに指定されたプロパティを追加します。
		 *
		 * @param name クラス名を表す文字列
		 * @param properties プロパティを格納したオブジェクト
		 *
		 * @returns 新しいクラスのコンストラクタ関数
		 */
		declare: function(name, properties){
			/* サブクラスが先に宣言された場合、親クラスは存在している */
			var clazz = maskat.lang.Object.find(name);
			if (!clazz) {
				/* コンストラクタ関数を生成 */
				clazz = function() {
					this.initialize.apply(this, arguments);
				};
				maskat.lang.Object.populate(clazz, this.methods);

				/* コンストラクタ関数を名前空間に格納 */
				var index = name.lastIndexOf(".");
				var namespace = (index == -1) ? window :
					maskat.lang.Object.create(name.substring(0, index));
				var simpleName = name.substring(index + 1, name.length);
				namespace[simpleName] = clazz;
			}
			
			if (properties) {
				/* 他のクラスを継承しない (ルート階層) */
				clazz.addProperties(properties);
				
				delete clazz.deferred;
				var children = clazz.subclasses;
				if (children) {
					for (var i = 0, len = children.length; i < len; i++) {
						var child = children[i];
						child.inherit(clazz, child.properties);
					}
				}
			} else {
				/* 他のクラスを継承する: プロパティ追加を遅延 */
				clazz.deferred = true;
			}
			return clazz;
		},
		
		methods: {
			/** @scope maskat.lang.Class.prototype */

			/**
			 * このクラスに指定したプロパティを追加します。
			 *
			 * @param properties プロパティを格納したオブジェクト
			 *
			 * @returns このクラス
			 */
			addProperties: function(properties){
				/* 静的プロパティをクラスに追加 */
				if (properties._static) {
					maskat.lang.Object.populate(this, properties._static);
					delete properties._static;
				}
				
				/* プロパティを prototype オブジェクトに追加 */
				maskat.lang.Object.populate(this.prototype, properties);
				
				/*
				 * コンストラクタが省略されている場合には、デフォルトの
				 * コンストラクタを定義する
				 */
				if (!this.prototype.initialize) {
					this.prototype.initialize = maskat.lang.EmptyFunction;
				}
				
				/* クラス・イニシャライザを呼び出し */
				if (this.initialize) {
					this.initialize();
				}
				return this;
			},
			
			/**
			 * このクラスを引数 name で指定したクラスのサブクラスにして、
			 * プロパティを追加します。
			 *
			 * @param name 親クラス名を表す文字列
			 * @param properties プロパティを格納したオブジェクト
			 *
			 * @returns このクラス
			 */
			extend: function(name, properties){
				var parent = maskat.lang.Object.find(name);
				if (!parent) {
					/* 親クラスが未定義の場合: クラスを宣言する */
					parent = maskat.lang.Class.declare(name);
				}
				this.superclass = parent;
				
				if (!parent.subclasses) {
					parent.subclasses = [];
				}
				parent.subclasses[parent.subclasses.length] = this;
				
				if (parent.deferred) {
					/* 親クラスの初期化が完了していないため、継承を遅延 */
					this.properties = properties;
				} else {
					/* 親クラスを継承させる */
					this.inherit(parent, properties);
				}
				return this;
			},
			
			/**
			 * このクラスを引数 parent で指定したクラスのサブクラスにして、
			 * プロパティを追加します。
			 *
			 * @private
			 *
			 * @param name 親クラス名を表す文字列
			 * @param properties プロパティを格納したオブジェクト
			 */
			inherit: function(parent, properties){
				/* 親クラスの initialize 関数をダミーに置き換える */
				var base = parent.prototype.initialize;
				parent.prototype.initialize = maskat.lang.EmptyFunction;
				
				/* 親クラスを継承する */
				this.prototype = new parent();
				this.prototype.constructor = this;
				this.prototype.initialize = base;
				this.prototype.base = base;
				this.addProperties(properties);
				
				/* 親クラスの initialize 関数を元に戻す */
				parent.prototype.initialize = base;
				
				/* このクラスにサブクラスがある場合、自分を継承させる */
				var children = this.subclasses;
				if (children) {
					for (var i = 0, len = children.length; i < len; i++) {
						var child = children[i];
						if (child.deferred) {
							child.inherit(this, child.properties);
						}
					}
				}
				delete this.deferred;
			}
		}
	},
	
	/** @scope maskat.lang */

	/** 空の関数 */
	EmptyFunction: function(){
	}
};
