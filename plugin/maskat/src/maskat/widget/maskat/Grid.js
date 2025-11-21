/*
 * Copyright (c)  2006-2011 Maskat Project.
 *
 * This software is the confidential and proprietary information of
 * NTT DATA CORPORATION ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with NTT DATA.
*/
/**
 * @class
 * 軽量グリッド部品の実装クラスです
 * <p>
 * 機能面を簡素化することで描画速度の向上を実現している軽量グリッド部品です。
 * この軽量グリッドは以下の機能を実装しています。
 * <ul>
 *   <li>データのグリッド表示機能。大量のデータを持つグリッドを違和感なく
 * 表示させることができる遅延表示機能も利用できます</li>
 *   <li>データのソート機能。各カラムごとに独自のソートロジックを指定することが
 * 可能です</li>
 *   <li>データの編集機能。各カラムごとに独自のバリデーションロジックを指定する
 * ことが可能です</li>
 *   <li>行選択機能。選択された行のデータを取得することが可能です</li>
 *   <li>データのフォーマット機能。各データごとに独自のフォーマットロジックを
 * 指定することが可能です</li>
 *   <li>グリッド表示スタイルのカスタマイズ機能。グリッドのスタイルを独自に変更
 * することが可能です</li>
 * </ul>
 *
 * <h2>遅延表示機能</h2>
 * このグリッドは初期描画時間を高速化するため初回描画時には 先頭の25データのみ
 * 描画を行います。グリッドをスクロールさせることにより非表示部分は自動的に
 * 描画されます。この遅延描画データ数の指定は gridタグの initRows属性で行います。
 * この遅延表示機能はセルの結合、データの結合を行った場合サポートされません。
 * <pre>
 * initRows :  -1      遅延描画を行いません。データを全て表示します。
 *           正の数値  初期表示時に指定された数の行を表示します。(デフォルト200)
 * </pre>
 * <h2>スタイルカスタマイズ機能</h2>
 * 軽量グリッドのスタイルは以下にあるパターンのクラスセレクタにより変更可能です
 * <pre>
 * ・全てのグリッドに共通するスタイルを指定する場合
 * .maskatGridCell { .... }
 * ※ 各クラスの構成は template属性を参照してください
 * <pre>
 * </pre>
 * ・ブラウザごとに指定する場合
 * &lt;html class="maskat_ff3"&gt; : html要素にブラウザを識別できる以下のクラスが付与されます
 * html要素に付与されるクラス名： maskat_ie6, maskat_ie7, maskat_ie8, maskat_ff3
 * </pre>
 * <pre>
 * 例）ie7のみ適用するスタイル
 * .maskat_ie7 .maskatGridCell { .... }
 * </pre>
 * <pre>
 * ・部品ごとに指定する場合
 * &lt;div class="maskatGrid grid1"&gt; : grid要素のクラスに部品名が付与されます
 * </pre>
 * <pre>
 * 例）部品 grid1 のみ適用するスタイル
 * .grid1 .maskatGridCell { .... }
 * </pre>
 * <pre>
 * また個々のカラムには cell タグの headerCssText, rowCssText にスタイルを指定
 * することができます。
 * 例)
 * &lt;maskat:cell name="cell1" ... rowCssText="text-align:right;"&gt;
 * &lt;maskat:cell name="cell2" ... headerCssText="font-style:italic;color:red;"&gt;
 * </pre>
 * </p>
 * <h2>属性</h2>
 * <h3>grid の属性</h3>
 * <table border="1">
 *   <tr><th>id</th><td>グリッドのルート要素に定義される id 属性です</td></tr>
 *   <tr><th>name</th><td>グリッドのルート要素に定義される name 属性です
 *   この name 属性はマスカットのGUIオブジェクト名として管理されます
 *   またルート要素の class 属性にダミークラスとして定義されスタイル
 *   のクラスセレクタとして利用することができます（必須属性）</td>
 *   </tr>
 *   <tr><th>top</th><td>左上のy座標</td></tr>
 *   <tr><th>left</th><td>左上のx座標</td></tr>
 *   <tr><th>width</th><td>グリッドの幅</td></tr>
 *   <tr><th>height</th><td>グリッドの高さ</td></tr>
 *   <tr><th>url</th><td>グリッドに表示させるJSONファイルのパス</td>
 *   <tr><th>initRows</th><td>グリッド生成時に表示させるデータ数
 *   デフォルトは 200 が定義されています。この値を超えるデータは
 *   スクロールにより表示が必要になった時に表示されます。-1を指定
 *   すると遅延表示は行わず全てのデータを初回表示します</td></tr>
 *   <tr><th>minRowHeight (非推奨) </th><td>ヘッダの最小値を指定します
 *   ヘッダの文字がこの値より大きい場合には自動的に調整されます</td></tr>
 *   <tr><th>onclick</th><td>グリッドのデータ部をクリックされて時に呼び出されるコールバック関数を指定します
 *     <pre>function(row, col, node)
 *     row - 行位置 (0-
 *     col - 列位置 (0-
 *     node - 選択されたcellノード (DOM)
 *     戻り値: データ行</pre></td></tr>
 *   <tr><th>selectable</th><td>行選択が可能か否かを設定します</td></tr>
 *   <tr><th>tabIndex</th><td>グリッドのルート要素に定義される tabIndex 属性です</td></tr>
 * </table>
 * <h3>cell の属性</h3>
 * <table border="1">
 *   <tr><th>value</th><td>ヘッダに表示される文字列です</td></tr>
 *   <tr><th>name</th><td>セルの名前を指定します</td></tr>
 *   <tr><th>width</th><td>セルの幅を指定します</td></tr>
 *   <tr><th>field</th><td>セルに表示させるフィールド名を指定します。</td></tr>
 *   <tr><th>formatter</th><td>セルに表示させる文字列を加工するフォーマッタを指定します
 *     <pre>function(value, row, col)
 *     value - 値
 *     row - 行位置 (0-
 *     col - 列位置 (0-
 *     戻り値: 表示する文字列</pre></td></tr>
 *   <tr><th>sortable</th><td>ソートの有無を指定します</td></tr>
 *   <tr><th>sorter</th><td>ソートを行う関数を指定します
 *     <pre>function (data, col, asc)
 *     data - グリッド表示データ
 *     col - ソートカラム名
 *     asc - 昇順降順に利用するトグルフラグ
 *     戻り値: ソートされたデータ</pre>
 *   </td></tr>
 *  <tr><th>headerCssText</th><td>ヘッダのセルに指定するスタイル</td></tr>
 *  <tr><th>rowCssText</th><td>データのセルに指定するスタイル</td></tr>
 *  <tr><th>editable</th><td>データの編集が可能になります</td></tr>
 *  <tr><th>validator</th><td>データの編集が行われた場合この関数で保存するか確認することができます
 *  <pre>function(value)
 *     value - 値
 *     戻り値: true: 編集値を保存します
 *             false: 編集地は保存しません
 *  </pre>
 *  </td></tr>
 *  <tr><th>rowSpan</th><td>行の結合を行います。定義は HTML の table と同じ設定方法となります</td></tr>
 *  <tr><th>colSpan</th><td>列の結合を行います。定義は HTML の table と同じ設定方法となります</td></tr>
 *  <tr><th>rowHidden</th><td>rowSpan, colSpanで結合した列の行データを非表示にします。
 *  データ部が非表示になりヘッダは表示されます。</td></tr>
 *  <tr><th>headerHidden</th><td>rowSpan, colSpanで結合したヘッダ列を非表示にします。
 *  ヘッダ部が非表示になりデータ部は表示されます。 </td></tr>
 * </table>
 *
 * <h2>イベント</h2>
 * <pre>
 * onclick     クリック時
 * </pre>
 *
 * <h2>データメソッド一覧</h2>
 * {@link #setValue}
 * {@link #getValue}
 * {@link #getSelectedValues}
 *
 * @name maskat.widget.maskat.Grid
 * @extends maskat.layout.Widget
 */
maskat.lang.Class.declare("maskat.widget.maskat.Grid")
	.extend("maskat.layout.Widget", {

	/** @scope maskat.widget.maskat.Grid.prototype */

	/**
	 * デフォルト取得メソッド (_getValue)
	 */
	defaultGetter: "_getValue",

	/**
	 * デフォルト設定メソッド (_setValue)
	 */
	defaultSetter: "_setValue",

	/**
	 * グリッドテンプレート
	 * 軽量グリッドは以下要素で構成されています。
	 * ※class属性を持たない要素は省略しています
	 * <pre>
	 * &lt;div class maskatGrid&gt; // グリッドの外枠 (this.widget)
	 *   &lt;div class maskatGridMasterHeader&gt; // ヘッダ部 (this.masterHeaderNode)
	 *     &lt;div class maskatGridHeader&gt; // ヘッダ部（行単位）(this.headerNode)
	 *       &lt;table class maskatGridHeaderRowTable&gt;
	 *         &lt;th class maskatGridHeaderCell&gt; // カラム部
	 *           &lt;div class maskatGridSortNode&gt; item1 &lt;/div&gt;
	 *         &lt;/th&gt;
	 *         &lt;th class maskatGridHeaderCell&gt;
	 *           &lt;div class maskatGridSortNode&gt; item2 &lt;/div&gt;
	 *         &lt;/th&gt;
	 *            :
	 *       &lt;/table&gt;
	 *     &lt;/div&gt;
	 *   &lt;/div&gt;
	 *   &lt;div class maskatGridMasterView&gt; // データ部 (this.viewNode)
	 *     &lt;div class="maskatGridScrollbox"&gt; // スクロール部 (this.scrollboxNode)
	 *       &lt;div class="maskatGridContent"&gt; // コンテンツ部 (this.contentsNode)
	 *         &lt;div class="maskatGridRow"&gt; // 行部
	 *           &lt;table class="maskatGridRowTable"&gt;
	 *             &lt;tr&gt; // カラム部
	 *               &lt;td class="maskatGridCell&gt; item1 &lt;/td&gt;
	 *               &lt;td class="maskatGridCell&gt; item2 &lt;/td&gt;
	 *                           :
	 *             &lt;/tr&gt;
	 *           &lt;/table&gt;
	 *         &lt;/div&gt;
	 *       &lt;/div&gt;
	 *     &lt;/div&gt;
	 *   &lt;/div&gt;
	 * &lt;/div&gt;
	 * </pre>
	 */
	template: [
		/* === grid === */
		'<div ', /* style */ '', 'class="maskatGrid ', /* class */ '', '"', /* attribute */ '', '>',
		  /* === header === */
		  '<div class="maskatGridMasterHeader">',
		    '<div ', /* header style */ '', 'class="maskatGridHeader"></div>',
		  '</div>',
		  /* === view === */
		  '<div class="maskatGridMasterView">',
		    '<div ', /* view style */ '', 'class="maskatGridView">',
		      '<div class="maskatGridScrollbox">',
		        '<div class="maskatGridContent">',
		          '<div style="position:absolute; left:0px; top:0px;"></div>',
		        '</div>',
		      '</div>',
		    '</div>',
		  '</div>',
		'</div>'
	],

	/**
	 * 軽量グリッド部品を生成します。
	 *
	 * @param parent このマスカット部品の親となるマスカット部品
	 * @returns 生成した Ajax 部品
	 */
	createWidget: function(parent) {
		var _getAttributeText = function(attributes) {
			var value = [], pos = 0;
			for (var name in attributes) {
				if (attributes[name] != undefined) {
					value[pos++] = name + "=" + attributes[name];
				}
			}
			return value.join(" ");
		}
		var _getStyleText = function(attributes) {
			var value = [], pos = 0;
			for (var name in attributes) {
				if (attributes[name] != undefined) {
					value[pos++] = name + ":" + attributes[name] + ";";
				}
			}
			return pos > 0 ? 'style="' + value.join("") + '"' : "";
		}
		this.template[5] = _getAttributeText({
				"id": this.id, "name": this.name, "tabIndex": this.tabIndex});
		this.template[1]  = _getStyleText({"top": this.top, "left": this.left,
				"width": this.width, "height": this.height});
		this.template[3]  = this.name;
		this.template[9]  = _getStyleText({"width": this.width});
		this.template[14] = _getStyleText({"width": this.width, "height": this.height});

		var div = document.createElement("div");
		div.innerHTML = this.template.join("");
		this.widget = this;
		this.element = div.firstChild;
		this.masterHeaderNode = this.element.firstChild;
		this.headerNode = this.masterHeaderNode.firstChild;
		this.viewNode = this.element.childNodes[1].firstChild;
		this.scrollboxNode = this.viewNode.firstChild;
		this.contentsNode  = this.scrollboxNode.firstChild;

		if (this.url) {
			this.data = maskat.util.CrossBrowser.loadJSONFrom(this.url);
		}
		if (!this.cells) {
			this.cells = [];
		}
		this._setup = false;
		this.setParent(parent);
		this.render(true);
		var self = this;

		setTimeout(function() {
			parent.appendChildElement(self.element);
			self._refresh();
			var layout = self.getLayout();
			if (layout.containsEvent(self.name, "onComplete")) {
				self.notifyEvent("onComplete", this);
			}
		}, 0);

		return this;
	},

	/**
	 * このマスカット部品が参照している Ajax 部品を返します。
	 *
	 * @returns このマスカット部品が参照している Ajax 部品
	 */
	unwrap: function() {
		return this;
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
	getWidgetId: function() {
		return this.name;
	},

	/**
	 * グリッドにデータを設定します
	 *
	 * @param data グリッドへの入力データ
	 */
	_setValue: function(data) {
		this.data = data || [];
		this._clearHeaderStatus();
		this.generateRow(this.data, this.cells);
		this._refresh();
	},

	/**
	 * グリッドからデータを取得します
	 *
	 * @return グリッドのデータ値
	 */
	_getValue: function() {
		return this.data;
	},

	/**
	 * 現在選択されている行のデータを取得します
	 *
	 * @return 選択中のデータ値
	 */
	getSelectedValues: function() {
		var values = [];
		var nodes = this.getElementsByClassName(this.contentsNode, "maskatSelectCell");
		for (var i = 0, l = nodes.length; i < l; i++) {
			var row = nodes[i].parentNode.getAttribute("idx");
			values[i] = this.data[row];
		}
		return values;
	},

	/**
	 * グリッドの描画を行います
	 *
	 * @param nonRefresh 画面のリフレッシュを行う場合には false
	 *                   行わない場合には true
	 */
	render: function(nonRefresh) {
		this.generateHeader(this.cells);
		this.createEventHandlers();

		if (this.data) {
			this.generateRow(this.data, this.cells);
		}
		if (!nonRefresh) {
			this._refresh();
		}
	},

	/**
	 * グリッドのリフレッシュを行います
	 * <p>
	 * 現在のデータサイズにグリッドを調整します。親部品が display:none; などで
	 * 非表示状態の場合、グリッドの表示を行う場合には本メソッドを呼び出しリフレッシュ
	 * 処理を行う必要がある場合があります。
	 * </p>
	 * <pre>
	 * 例) 非表示のレイアウトを表示状態にする場合
	 * function show() {
	 *     var layout = maskat.app.getLayout("layout");
	 *     layout.show();
	 *     layout.getWidget("grid1").refresh();
	 * }
	 *</pre>
	 */
	refresh: function() {
		this._refresh();

		/* リフレッシュ時にはスクロール位置を先頭に移動せる */
		this.scrollboxNode.scrollTop = 0;

		/* IE6, 7 はグリッドが非表示状態からの初回描画の場合、
		   以下の処理を行わないと描画しない */
		var browser = maskat.widget.maskat.browser;
		if (browser.isIE && browser.isIE <= 7) {
			var style = this.element.style;
			var display = style.display;
			style.display = "none";
			style.display = display;

			/* IE6 は contetnsNode と scrollbox も再描画を行う必要がある */
			if (browser.isIE == 6) {
				this.scrollboxNode.className = this.scrollboxNode.className;
				
			}
		}
	},

	_refresh: function() {
		var browser = maskat.widget.maskat.browser;
		if (!this._setup) {
			var headerHeight = this.headerNode.clientHeight;
			if (this.masterHeaderNode.clientHeight != headerHeight) {
				this.masterHeaderNode.style.height = headerHeight + "px";
			}
			var self = this;

			setTimeout(function() {
				var viewNodeHeight = self.viewNode.clientHeight;
				
				if (viewNodeHeight > 0) {
					// 他のプラグインとの併用を行うとIE6, 7ではヘッダサイズの算出が遅れることへの対応
					if (browser.isIE && browser.isIE <= 7) {
						self.masterHeaderNode.style.height = self.headerNode.clientHeight + "px";
					}
					var masterHeaderHeight = self.masterHeaderNode.clientHeight;
					var height = viewNodeHeight - masterHeaderHeight;
					self.viewNode.style.height = height + "px";

					var width = self.headerNode.firstChild.firstChild.clientWidth;
					self.contentsNode.style.width = width + "px";
					self._setup = true;
				}
			}, 0);
		}
		var node = this.contentsNode;
		/* IE6, 7 は contentsNode の幅を指定しないと潰れてしまう */
		if (browser.isIE && browser.isIE <= 7) {
			node.style.width = this.headerNode.firstChild.firstChild.clientWidth + "px";
		}
		if (!browser.isIE && node.style.height != (node.firstChild.clientHeight + "px")) {
			node.style.height = node.firstChild.clientHeight + "px";
		}
		/*
		 * IE6, 7, 8 は行の高さがデフォルト値と異なるサイズの場合スクロールサイズの算出を遅らせて
		 * 取得しないと適切なサイズに設定できない
		 */
		if (browser.isIE) {
			setTimeout(function() {
				if (node.style.height != (node.firstChild.clientHeight + "px")) {
					node.style.height = node.firstChild.clientHeight + "px";
				}
			}, 0);
		}
	},

	resize: function() {
		if (this._setup) {
			this._refresh();
		}
	},

	/**
	 * ヘッダを作成します
	 *
	 * @param cells 描画を行うセル構成
	 */
	generateHeader: function(cells) {
		var html = [], pos = 0, idx = 0;
		html[pos++] = '<div style="width: 9000px;">';
		html[pos++] = '<table class="maskatGridHeaderRowTable" border="0" cellpadding="0" cellspacing="0">';
		html[pos++] = '<tbody>';
		this.columnIndex = [];

		for (var i = 0, l = cells.length; i < l; i++) {
			var cell = cells[i] || [];
			html[pos++] = '<tr>';

			for (var j = 0, m = cell.length; j < m; j++) {
				var col = cell[j];
				this.columnIndex[idx] = col;
				var cssText = col.headerCssText;
				var style = cssText.length > 0 ? '" style="' + cssText + '"' : "";

				html[pos++] = '<th class="' + (col.headerHidden ? "maskatHiddenGridCell" : "maskatGridHeaderCell") +
						'" idx="' + (idx++) + '" style="width:' + col.width + ';"' +
						(col.rowSpan ? (' rowSpan="' + col.rowSpan + '"') : '') +
						(col.colSpan ? (' colSpan="' + col.colSpan + '"') : '') +
						'><div class="' +
						(col.sortable && !col.rowHidden ? "maskatGridSortNode" : "maskatGridNonSortNode") +
						(col.editable && !col.rowHidden ? " maskatEditable" : "") +
						style + '">' + (col.headerHidden ? "" : col.value) + '</div></th>';
			}
			html[pos++] = '</tr>';
		}
		html[pos++] = '</tbody></table></div>';
		this.headerNode.innerHTML = html.join("");
	},

	/**
	 * 行を作成します
	 *
	 * @param data 描画を行うデータ
	 * @param cells 描画を行うセル構成
	 */
	generateRow: function(data, cells) {
		var position = 0;
		var count = this.initRows == -1 ? data.length : Math.min(data.length, this.initRows);
		var html = [];
		var pos = 0;
		cells = cells || [];

		for (var i = position, l = Math.max(data.length, position + count); i < l; i++) {
			var style = (i % 2) ? "maskatGridRow maskatGridRowOdd" : "maskatGridRow";
			var v = data[i];

			if (i < position + count) {
				html[pos++] = '<div class="' + style + '" idx="' + i + '">';
				html[pos++] = '<table style="height: ' + this.minRowHeight +
							  ';" class="maskatGridRowTable" border="0" cellpadding="0" cellspacing="0">';
				html[pos++] = '<tbody>';

				for (var c = 0, n = cells.length, colPos = 0; c < n; c++) {
					var cell = cells[c] || [];
					html[pos++] = '<tr>';
					for (var j = 0, m = cell.length; j < m; j++) {
						var col = cell[j];
						if (col.rowHidden) {
							html[pos++] = '<td class="maskatHiddenGridCell" idx="' + (colPos++) + '"' +
									(col.rowSpan ? (' rowSpan="' + col.rowSpan + '"') : '') +
									(col.colSpan ? (' colSpan="' + col.colSpan + '"') : '') +
									' style="width:' + col.width + ';"/>';
							continue;
						}
						var value = v[col.field || j];
						if (col.formatter) {
							value = col.formatter(value, i, j);
						}
						html[pos++] = '<td class="maskatGridCell" idx="' + (colPos++) + '"' +
								(col.rowSpan ? (' rowSpan="' + col.rowSpan + '"') : '') +
								(col.colSpan ? (' colSpan="' + col.colSpan + '"') : '') +
								' style="width:' + col.width + ';' + col.rowCssText + '">' + value + '</td>';
					}
					html[pos++] = '</tr>';
				}
				html[pos++] = '</tbody></table>';
			} else {
				html[pos++] = '<div class="';
				html[pos++] = style;
				html[pos++] = ' maskatLazyGridRow" idx="';
				html[pos++] = i;
				html[pos++] = '">';
			}
			html[pos++] = '</div>';
		}
		this.contentsNode.firstChild.innerHTML = html.join("");
	},

	/**
	 * グリッドにイベントハンドラを登録します
	 *
	 * 以下のハンドラを定義しています
	 * 1) 遅延表示を行うための scroll イベントハンドラ (*1)
	 * 2) 行選択を行うための click, keydown イベントハンドラ (*1)
	 * 3) ソート処理を行うための click イベントハンドラ (*1)
	 * 4) ユーザ定義 onclick 関数を呼び出すための click イベントハンドラ (*1)
	 * 5) セルの編集を行うための dblclick, keydown イベントハンドラ (*1)
	 * 6) マスカットへ onclick イベントを通知する click イベントハンドラ
	 *
	 * *1) レイアウト定義XMLに該当イベントの設定がある場合のみ登録処理を行います
	 */
	createEventHandlers: function() {
		/* 遅延描画を行う場合には scroll イベントに描画ハンドラを定義します */
		if (this.initRows != -1) {
			maskat.util.CrossBrowser.addEventListener(
					this.scrollboxNode, "scroll", this._delayRenderHandler());
		}
		/* 行選択を行う場合には 行選択用イベントハンドラを定義します */
		if (this.selectable) {
			maskat.util.CrossBrowser.addEventListener(
					this.contentsNode, "click", this._onClickSelectHandler());
			maskat.util.CrossBrowser.addEventListener(
					this.element, "keydown", this._onKeydownSelectHandler());
			/* 選択可能な場合テキストの選択が編集中以外行えないようにします */
			if (maskat.widget.maskat.browser.isIE) {
				var self = this;
				this.contentsNode.onselectstart = function() {
					return self._editerNode !== undefined;
				}
			}
		}
		/* ソート処理を行う場合にはヘッダの onclick イベントにハンドラを定義します */
		if (this.isElementByClassName(this.headerNode, "maskatGridSortNode")) {
			maskat.util.CrossBrowser.addEventListener(
					this.headerNode, "click", this._sortHandler());
		}
		/* ユーザ定義の onclick 関数が指定されている場合は onclick イベントにハンドラを定義します */
		if (this.onclick) {
			maskat.util.CrossBrowser.addEventListener(
					this.contentsNode, "click", this._onClickEventHandler());
		}
		// 編集カラムが存在する場合には編集用イベントハンドラを定義します
		if (this.isElementByClassName(this.headerNode, "maskatEditable")) {
			// エディタをシングルクリックで開く場合には以下の dblclick を click にします
			maskat.util.CrossBrowser.addEventListener(
					this.contentsNode, "dblclick", this._openEditer());
			maskat.util.CrossBrowser.addEventListener(
					this.contentsNode, "keydown", this._onKeydownEditerHandler());
		}
		/* マスカットの onclick イベント定義用のハンドラを定義します */
		var layout = this.getLayout();
		if (layout.containsEvent(this.name, "onclick")) {
			maskat.util.CrossBrowser.addEventListener(
					this.contentsNode, "click", this._onClickHandler());
		}
	},

	/**
	 * 指定されたクラスを持つ要素を検索し返却します
	 *
	 * @param element 検索を行う要素
	 * @param className 検索を行うクラス名
	 * @returns 検索条件に該当する要素の配列 (子要素から格納されます）
	 */
	getElementsByClassName: function(element, className) {
		var elements = [];
		var child = element.firstChild;
		while (child) {
			Array.prototype.push.apply(elements,
					this.getElementsByClassName(child, className));
			child = child.nextSibling;
		}
		var name = element.className;
		if (name && name.indexOf(className) != -1) {
			elements[elements.length] = element;
		}
		return elements;
	},

	/**
	 * 指定されたクラスを持つ要素が存在するか判定します
	 *
	 * @param element 検索を行う要素
	 * @param className 検索を行うクラス名
	 * @returns 検索条件に該当する要素がある場合 true, 無い場合 false
	 */
	isElementByClassName: function(element, className) {
		var name = element.className;
		if (name && name.indexOf(className) != -1) {
			return true;
		}
		var child = element.firstChild;
		while (child) {
			if (this.isElementByClassName(child, className)) {
				return true;
			}
			child = child.nextSibling;
		}
		return false;
	},

	/**
	 * ヘッダの状態を初期状態に戻します
	 */
	_clearHeaderStatus: function() {
		var elements = this.getElementsByClassName(
				this.headerNode, "maskatGridSortNode");
		for (var i = 0, l = elements.length; i < l; i++) {
			elements[i].className = "maskatGridSortNode";
		}
	},

	/**
	 * グリッドセルのDOM要素から 行位置、列位置を取得します
	 *
	 * @param cellNode セル要素
	 * @returns {col: 列位置 (0-  , row: 行位置 (0- , field データプロパティ名 }
	 */
	_getIndex: function(cellNode) {
		var col = -1, row = -1, field = undefined;
		if (cellNode.className == "maskatGridCell") {
			var tableNode = cellNode.parentNode.parentNode.parentNode;
			col = cellNode.getAttribute("idx");
			row = tableNode.parentNode.getAttribute("idx");
			field = this.columnIndex[col].field || col;
		}
		return {"col": col, "row": row, "field": field};
	},

	/**
	 * 遅延描画を行うハンドラです
	 *
	 * スクロールにより未描画状態の行を検索しカラムの描画を行います。
	 * 未描画状態の行検索は document.elementFromPoint により表示されている
	 * 行を求めその要素をチェックすることで判定を行っています。そのため
	 * グリッドが隠れて表示されている状態などは正確に表示件数を求めることが
	 * できなくなる場合があります。現実装ではそのような現象になった場合、表示行
	 * 数分描画を行うようになっています。
	 */
	_delayRenderHandler: function() {
		var self = this;
		var lastPosition;
		return 	function(e) {
			if (self.headerNode.scrollLeft != self.scrollboxNode.scrollLeft) {
				self.headerNode.scrollLeft = self.scrollboxNode.scrollLeft;
			}
			if (self.scrollboxNode.scrollTop == lastPosition) {
				return;
			}
			setTimeout(function() {
				var scrollTop = self.scrollboxNode.scrollTop;
				if (scrollTop == lastPosition) {
					return;
				}
				lastPosition = scrollTop;
				var rect = self.scrollboxNode.getBoundingClientRect();
				var left = Math.ceil(rect.left);
				var top = Math.ceil(rect.top);
				var bottom = Math.floor(rect.bottom) - self.viewNode.parentNode.offsetTop;

				var topNode = document.elementFromPoint(left, top);
				if (topNode) {
					var bottomNode = document.elementFromPoint(left, bottom);
					var topIndex;
					var className = topNode.className;
					if (className.indexOf("maskatGridRow") != -1) {
						topIndex = Number(topNode.getAttribute("idx"));
					} else if (className.indexOf("maskatGridCell") != -1) {
						topNode = topNode.parentNode.parentNode.parentNode.parentNode;
						topIndex = Number(topNode.getAttribute("idx"));
					}
					var bottomIndex;
					className = bottomNode.className;
					if (bottomNode) {
						if (className.indexOf("maskatGridRow") != -1) {
							bottomIndex = Number(bottomNode.getAttribute("idx"));
						} else if (className.indexOf("maskatGridCell") != -1) {
							bottomNode = bottomNode.parentNode.parentNode.parentNode.parentNode;
							bottomIndex = Number(bottomNode.getAttribute("idx"));
						}
					}
					if (topIndex != undefined && bottomIndex != undefined) {
						/* 終了位置が border, padding により求められない状態に対応するため +1する */
						var count = bottomIndex - topIndex + 2;
						self._delayRender(topNode, count, self.data, self.cells);

					} else {
						var nodes = self.contentsNode.firstChild.childNodes;
						if (nodes.length > 0) {
							topIndex = Math.floor(scrollTop / nodes[0].offsetHeight);
							topNode = nodes[topIndex];
							var count = Math.ceil(self.scrollboxNode.clientHeight / topNode.offsetHeight) + 2;
							self._delayRender(topNode, count || self.initRows, self.data, self.cells);
						}
					}
				}
			}, 0);
		}
	},

	/**
	 * ソートを行うハンドラです
	 *
	 * 任意のソートロジックが指定されている場合にはそのロジックを
	 * 利用してソートを行います。指定されていない場合にはデフォルト
	 * のソートロジック（文字列ソート）となります。
	 */
	_sortHandler: function() {
		var self = this;
		var asc = true;

		var defaultSorter = function(data, col, asc) {
			var prop = self.columnIndex[col].field || col;
			data.sort(function(a, b) {
				return asc ? (a[prop] > b[prop] ? 1 : -1) : (b[prop] > a[prop] ? 1 : -1);
			});
			return data;
		}
		return 	function(e) {
			var event = e || window.event;
			var target = event.target || event.srcElement;
			if (target.className.indexOf("maskatGridSortNode") != -1) {
				self._clearHeaderStatus();
				var col = Number(target.parentNode.getAttribute("idx"));
				var orgCursor = target.style.cursor;
				target.style.cursor = "progress";
				target.className = asc ? "maskatGridSortNode maskatGridSortUp" :
						"maskatGridSortNode maskatGridSortDown"
				setTimeout(function() {
					var sort = self.columnIndex[col].sorter || defaultSorter;
					self.data = sort(self.data, col, asc);
					self.generateRow(self.data, self.cells);
					asc = asc ? false : true;
					target.style.cursor = orgCursor;
				}, 10);
			}
		}
	},

	/**
	 * マスカットの onclick イベント定義用のハンドラです
	 *
	 * 行が選択された場合には notifyEvent を実施します
	 */
	_onClickHandler: function() {
		var self = this;
		return 	function(e) {
			var event = e || window.event;
			var target = event.target || event.srcElement;
			if (target.className == "maskatGridCell") {
				self.notifyEvent("onclick", arguments);
			}
		}
	},

	/**
	 * ユーザ定義の onclick関数を呼び出すハンドラです
	 *
	 */
	_onClickEventHandler: function() {
		var self = this;
		return 	function(e) {
			var event = e || window.event;
			var target = event.target || event.srcElement;
			if (target.className == "maskatGridCell") {
				var index = self._getIndex(target);
				self.onclick(index.row, index.col, target, self.data[index.row]);
			}
		}
	},

	/**
	 * 行選択処理を行う onclick処理用ハンドラです
	 *
	 * 行が選択された場合には maskatSelectCell クラスを要素に追加します
	 */
	_onClickSelectHandler: function() {
		var self = this;
		var last;
		return 	function(e) {
			var event = e || window.event;
			var target = event.target || event.srcElement;
			if (target.className == "maskatGridCell") {
				var tableNode = target.parentNode.parentNode.parentNode;
				if (tableNode.className &&
						tableNode.className.indexOf("maskatSelectCell") != -1) {
					tableNode.className = "maskatGridRowTable";
					last = undefined;
				} else {
					tableNode.className += " maskatSelectCell";
					if (event.shiftKey && last &&
							last.className.indexOf("maskatSelectCell") != -1) {
						var ps = Number(last.parentNode.getAttribute("idx"));
						var pe = Number(tableNode.parentNode.getAttribute("idx"));
						var snode = ps > pe ? tableNode : last;
						var enode = ps > pe ? last : tableNode;
						while (snode && snode != enode) {
							if (snode.className.indexOf("maskatSelectCell") == -1) {
								snode.className += " maskatSelectCell";
							}
							snode = snode.parentNode.nextSibling.firstChild;
						}
					} else {
						last = tableNode;
					}
				}
			}
		}
	},

	/**
	 * 行選択処理を行う onkeydown処理用ハンドラです
	 *
	 * ESC キーを押下された場合、行の選択状態を解除します
	 * ※ グリッドにフォーカスがある場合のみ動作します。
	 */
	_onKeydownSelectHandler: function() {
		var self = this;
		return 	function(e) {
			var event = e || window.event;
			if (event.keyCode == 27) {
				var nodes = self.getElementsByClassName(self.contentsNode, "maskatSelectCell");
				for (var i = 0, l = nodes.length; i < l; i++) {
					nodes[i].className = "maskatGridRowTable";
				}
			}
		}
	},

	/**
	 * セルのデータを編集するエディタを開くハンドラです
	 *
	 * このイベントはセルが editable: false でも通知されるためこのハンドラ内で
	 * 処理を切り分ける必要があります。
	 */
	_openEditer: function() {
		var self = this;
		return 	function(e) {
			if (self._editerNode) {
				return;
			}
			var event = e || window.event;
			var target = event.target || event.srcElement;
			if (target.className == "maskatGridCell") {
				var index = self._getIndex(target);
				if (!self.columnIndex[index.col].editable) {
					return;
				}
				var value = self.data[index.row][index.field];
				var input = document.createElement("input");
				input.setAttribute("type", "text");
				input.setAttribute("value", value);
				input.className = "maskatCellEditor";
				target.innerHTML = "";

				input.onblur = function(e) {
					self._setEditerValue.call(self, this.value);
				}
				target.appendChild(input);
				self._editerNode = input;
				input.select();
			}
		}
	},

	/**
	 * セルエディタ利用時の onkeydown イベント処理用ハンドラです
	 *
	 * ESC キーを押下された場合、編集中の値を破棄しセルエディタを終了します
	 * Enter キーを押下された場合、値を格納しセルエディタを終了させます
	 */
	_onKeydownEditerHandler: function() {
		var self = this;
		return 	function(e) {
			var node = self._editerNode;
			if (!node) {
				return;
			}
			var event = e || window.event;
			if (event.keyCode == 27) {
				var index = self._getIndex(node.parentNode);
				self._setEditerValue.call(self, self.data[index.row][index.field]);
			} else if (event.keyCode == 13) {
				self._setEditerValue.call(self, node.value);
			}
		}
	},

	/**
	 * セルエディタの編集結果を設定しセルエディタの終了処理を行います。
	 * またvalidator が定義されている場合には判定後、格納されます。
	 * 
	 * @param value 設定する値
	 */
	_setEditerValue: function(value) {
		var parent = this._editerNode.parentNode;
		var index = this._getIndex(parent);
		var rowData = this.data[index.row];
		var v;
		if (rowData[index.field] === value) {
			v = value;
		} else {
			try {
				/* 格納されるデータタイプは既存データに合わせます */
				var type = typeof(rowData[index.field]);
				v = maskat.util.Converter.convert(type, value);
				var validate = this.columnIndex[index.col].validator || function() {return true;};
				if (!validate.call(this, v)) {
					v = rowData[index.field];
				}
			} catch (e) {
				v = rowData[index.field];
			}
			rowData[index.field] = v;
		}
		this._editerNode.onblur = maskat.lang.EmptyFunction;
		parent.removeChild(this._editerNode);

		if (this.columnIndex[index.col].formatter) {
			v = this.columnIndex[index.col].formatter(v, index.row, index.field);
		}
		parent.innerHTML = v;
		this._editerNode = undefined;
	},

	/**
	 * グリッドのデータを遅延描画します
	 *
	 * @param node 描画を行う最初の要素
	 * @param count 描画を行う件数
	 * @param data 描画を行うデータ
	 * @param cells セル情報
	 */
	_delayRender: function(node, count, data, cells) {
		var doc = document;
		var index = Number(node.getAttribute("idx"));
		var rowCount = Math.min(data.length, index + count);
		for (var i = index; i < rowCount; i++) {
			if (!node) {
				break;
			}
			if (!node.firstChild) {
				var v = data[i];
				var html = [], pos = 0;
				html[pos++] = '<table style="height: ' + this.minRowHeight +
							  ';" class="maskatGridRowTable" border="0" cellpadding="0" cellspacing="0">';
				html[pos++] = '<tbody>';

				for (var c = 0, n = cells.length, colPos = 0; c < n; c++) {
					var cell = cells[c];
					html[pos++] = '<tr>';
					for (var j = 0, m = cell.length; j < m; j++) {
						var col = cell[j];
						var value = v[col.field || j];
						if (col.formatter) {
							value = col.formatter(value, i, j);
						}
						html[pos++] = '<td class="maskatGridCell" idx="' + (colPos++) + '"' +
								' style="width:' + col.width + ';' + col.rowCssText + '">' + value + '</td>';
					}
					html[pos++] = '</tr>';
				}
				html[pos++] = '</tbody></table>';
				node.innerHTML = html.join("");
			}
			node = node.nextSibling;
		}
	},

	/**
	 * このマスカット部品が参照している HTML 要素を返します。
	 *
	 * @returns このマスカット部品が参照している HTML 要素
	 */
	getElement: function(){
		return this.element;
	}
});

