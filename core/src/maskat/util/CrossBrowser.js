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
 * Web ブラウザの実装に依存しやすい DOM や XMLHttpRequest に関連する処理を
 * カプセル化し、コードの移植性を高めます。
 *
 * <p>
 * このクラスは static メソッドのみを持つユーティリティクラスであり、
 * インスタンス化する必要はありません。
 * </p>
 *
 * @name maskat.util.CrossBrowser
 */
maskat.lang.Class.declare("maskat.util.CrossBrowser", {

	_static: {
		
		/** @scope maskat.util.CrossBrowser */
	
		/**
		 * 新しい XMLHttpRequest を生成します。
		 *
		 * @returns XMLHttpRequest のインスタンス
		 */
		createXMLHttpRequest: function(){
			var xhr;
			
			if (window.XMLHttpRequest &&
				(navigator.appName != "Microsoft Internet Explorer" ||
				 window.location.protocol != "file:")) {
				
				xhr = new XMLHttpRequest();
			} else if (window.ActiveXObject) {
				try {
					xhr = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						xhr = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) { /* suppress */ }
				}
			}

			if (!xhr) {
				throw new maskat.lang.Error("CREATE_XHR_ERROR",
					{ agent: navigator.userAgent });
			}
			return xhr;
		},

		/**
		 * XMLHttpRequest に通信エラーが発生しているかどうかを確認し、通信
		 * エラーの場合には例外をスローします。
		 *
		 * @throws {maskat.lang.Error} 通信エラーが発生している場合
		 */
		checkHttpError: function(xhr, param) {
			var err = this.getHttpError(xhr, param);
			
			if (err) {
				throw err;
			}
		},
		
		/**
		 * XMLHttpRequest に通信エラーが発生しているかどうかを確認し、通信
		 * エラーの場合には例外を返します。
		 *
		 * @return {maskat.lang.Error} 通信エラーが発生している場合
		 */
		getHttpError: function(xhr, param) {
			try {
				if (xhr.readyState != 4 || xhr.status != 200) {
					switch (xhr.status) {
					case 0:
						/*
						 * ローカルファイルへのアクセスが正常に終了した場合
						 * statusは0となる。(Firofox, IE, Safari)
						 * またサーバがダウンしている状態でアクセスを行った場合も
						 * statusが0となる。プロトコルでローカルアクセスなのかサーバ
						 * との通信ができないリモートアクセスなのかを判定する
						 */
						if (document.location.protocol == "file:") {
							return;
						}
					case 403:
					case 404:
					case 500:
						var text = xhr.statusText;
						if (text == "Not Found") {
							text = xhr.responseText;
							if (param && param.url) {
								text = param.url + text;
							}
						}
						return new maskat.lang.Error("HTTP_" + xhr.status,
							{ url: text });
					default:
						/*
						 * IE独自のエラー(12002-12152)が発生した場合、
						 * statusTextには "Unknown"が格納される。
						 */
						var url = xhr.statusText != "Unknown" ? xhr.statusText : "";
						return new maskat.lang.Error("HTTP_DEFAULT",
							{ status: xhr.status, url: url });
					}
				}
			} catch (e) {
				/*
				 * Firefox ではサーバサイドがダウンしている状態で send した
				 * XHRの status (FF2のみ), statueTextにアクセスするとエラーが
				 * 発生する。そのための catch 処理
				 */
				return new maskat.lang.Error("HTTP_ERROR");
			}
		},

		/**
		 * HTTP GET メソッドを用いた同期通信で XML 文書を取得し、Document
		 * ノードを返します。
		 *
		 * @returns 取得した XML 文書の Document ノード
		 */
		getXMLDocumentFrom: function(url){
			var xhr = this.createXMLHttpRequest();
			
			try {
				xhr.open("GET", url, false);
				xhr.send(null);
				
			} catch (e) {
				throw new maskat.lang.Error("HTTP_404",
					{ url: url });
			}
			if (xhr.readyState == 4) {
				switch (xhr.status) {
				case 200:
					this.checkParseError(xhr.responseXML);
					if (xhr.responseXML && xhr.responseXML.nodeType == 9) {
						return xhr.responseXML;
					//Safari対応
					} else if (navigator.userAgent.indexOf('Safari/') != -1 && xhr.responseText) {
					   
						var doc = this.parseXMLDocument(xhr.responseText);
						this.checkParseError(doc);
						return doc;
					}
					break;

				case 0:
					/* ローカル環境の場合 responseText から DOM を生成 */
					if (document.location.protocol == "file:" && xhr.responseText) {
						var doc = this.parseXMLDocument(xhr.responseText);
						this.checkParseError(doc);
						return doc;
					}
					break;
				default:
					this.checkHttpError(xhr);
				}
			}
			return null;
		},

		/**
		 * HTTP GET メソッドを用いた同期通信でテキストを取得します。
		 *
		 * @param url 取得するテキストのURL
		 * @param type 取得するテキストの種類
		 * 
		 * @returns 取得したテキスト
		 */
		getTextFrom: function(url, type){
			var xhr = this.createXMLHttpRequest();
			try {
				xhr.open("GET", url, false);
				if (type == "json" && xhr.overrideMimeType)	{
					xhr.overrideMimeType("applicaiton/json");
				}
				xhr.send(null);
			} catch (e) {
				throw new maskat.lang.Error("HTTP_404",
					{ url: url });
			}
			this.checkHttpError(xhr);
			return xhr.responseText;
		},

		/**
		 * XML 文書の文字列表現から DOM オブジェクトを構築し、Document
		 * ノードを返します。
		 *
		 * @returns XML 文書の Document ノード
		 */
		parseXMLDocument: function(source){
			var doc;
			if (window.DOMParser) {
				doc = (new DOMParser()).parseFromString(source, "text/xml");
			} else if (window.ActiveXObject) {
				doc = new ActiveXObject("MSXML2.DOMDocument");
				doc.async = false;
				doc.resolveExternals = false;
				doc.validateOnParse = false;
				doc.loadXML(source);
			}
			this.checkParseError(doc);
			return doc;
		},
		
		/**
		 * XML 文書に解析エラーが発生しているかどうかを確認し、解析エラーの
		 * 場合には例外をスローします。
		 *
		 * @throws {maskat.lang.Error} 解析エラーが発生している場合
		 */
		checkParseError: function(xml) {
			if (!xml) {
				return;
			}
			if (xml.parseError && xml.parseError.errorCode < 0) {
				/* IE */
				var p = xml.parseError;
				var param = {
					msg: p.reason,
					line: p.line,
					pos: p.linepos,
					text: p.srcText
				};
				throw new maskat.lang.Error("PARSEERROR_IE", param);
			} else if (xml.documentElement) {
				if (xml.documentElement.tagName == "parsererror") {
					/* Firefox */
					throw new maskat.lang.Error("PARSEERROR_DEFAULT",
						{ msg: xml.documentElement.textContent });
				} else if (navigator.userAgent.indexOf('Safari/') != -1 
					&& xml.documentElement.textContent.indexOf("errors") != -1) {
				    /* Safari */
					throw new maskat.lang.Error("PARSEERROR_DEFAULT",
						{ msg: xml.documentElement.textContent });
				}
			}
		},

		/**
		 * HTTP GET メソッドを用いた同期通信で JSON 形式のリテラル文字列を
		 * 取得し、それを評価したオブジェクトを返します。
		 *
		 * @returns オブジェクト
		 */
		loadJSONFrom: function(url){
			return maskat.lang.Object.parseJSON(this.getTextFrom(url, "json"));
		},

		/**
		 * HTML 要素にイベントリスナを追加します。
		 *
		 * <p>
		 * ブラウザ間の互換性を確保するため、このメソッドによって追加された
		 * イベントリスナはバブリング段階で実行されます。この制約が発生する
		 * 理由を以下で説明します。
		 * </p>
		 *
		 * <ul>
		 *   <li>DOM Level 2 仕様ではイベントリスナを活性化するタイミングを
		 *   キャプチャ段階またはバブリング段階から選択できます。Internet
		 *   Explorer を除くブラウザの多くはこの仕様を実装しています。</li>
		 *   <li>Internet Explorer は独自の attachEvent 関数でイベントリスナ
		 *   を登録します。この関数ではバブリング段階で活性化するリスナのみ
		 *   サポートされます。</li>
		 * </ul>
		 *
		 * @param node リスナを追加する HTML 要素
		 * @param eventType イベントタイプ
		 *        ("click", "focus", "blur" など、先頭に "on" を含まない文字列)
		 * @param listener イベントリスナとして追加される関数
		 *
		 * @returns XML 文書の Document ノード
		 * @see <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-flow">DOM Level 2 Events</a>
		 */
		addEventListener: function(node, eventType, listener){
			if (node.addEventListener) {
				node.addEventListener(eventType, listener, false);
			} else if (node.attachEvent) {
				node.attachEvent("on" + eventType, listener);
			} else if (node["on" + eventType]) {
				node["on" + eventType] = listener;
			}
		}
	}
});
