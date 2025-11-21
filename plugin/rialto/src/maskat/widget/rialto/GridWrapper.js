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
maskat.lang.Class.declare("maskat.widget.rialto.GridWrapper")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

	defaultGetter: "getTabData",

	defaultSetter: "setTabData",

    createWidget: function(parent) {
		this.TabEntete = [];
		this.tabTypeCol = [];

    	if (this.headers) {
    		for (var i = 0; i < this.headers.length; i++) {
    			var header = this.headers[i];
    			this.TabEntete.push(header.title);
    			this.tabTypeCol.push([header.type, header.width, header.tabData]);
    		}
    	}

		var grid = new rialto.widget.Grid(this);

		if(typeof(this.onCellEdit) != "undefined"){
	    	grid.onCellEdit = this.onCellEdit;
	    }

		var self = this;
		grid.onclick = function() { self.notifyEvent("onclick", arguments); };
		grid.ondbleclick = function() { self.notifyEvent("ondblclick", arguments); };
		grid.onCellWrite = function() { self.notifyEvent("onCellWrite", arguments); };

		this.widget = grid;
		return this.widget;
    },

	postCreateWidget: function() {
		this.widget.divExt.tabIndex = -1;

		/* グリッドの初期ソート状態を設定 */
		if (this.sortable) {
			this.widget.triColonne(this.sortCol, this.boolOrder);
		}

		/* グリッドの初期データ (gridLine/gridCell) を登録 */
		this.setTabData(this.tabData);
	},

	getTabData: function() {
		return this.widget.tabData;
	},

	setTabData: function(data) {
		if (typeof(data) == "undefined" || data == null) {
			this.clear();
			return;
		}

		for (var i = 0; i < data.length; i++) {
			for (var j = 0; j < this.widget.tabEntete.length; j++) {
				if (typeof(data[i][j]) == "undefined"){
					data[i][j] = "";
				}
			}
		}

		/*
		 * グリッドがソートされている場合、データ更新後も現在のソート
		 * 状態を保存する
		 */
		var oldColCLic = this.widget.oldColCLic;
		if (oldColCLic) {
			this.widget.fillGrid(data, oldColCLic.ind, oldColCLic.boolOrder);
		} else {
			this.widget.fillGrid(data);
		}

		var index = this.getTabIndex();
		for (var i = 0; i < this.widget.tableauHTML.childNodes.length; i++) {
			if (this.widget.cellActive) {
				var nodes = this.widget.tableauHTML.childNodes[i];
				for (var j = 1; j < nodes.childNodes.length; j += 2) {
					if (this.widget.NbreCol * 2 < j) {
						break;
					}
					if (nodes.childNodes[j].className == "grid_cellData") {
						nodes.childNodes[j].tabIndex = index;
					}
				}
			} else {
				this.widget.tableauHTML.childNodes[i].tabIndex = index;
			}
		}
	},

	getSelectedIndex: function() {
		return this.widget.indLineClic;
	},

	getSelectedIndexes: function() {
		var indexes = []
		var tabData = this.widget.tabData;
		for (var i = 0; i < tabData.length; i++) {
			if (tabData[i].sel) {
				indexes.push(i);
			}
		}
		return indexes;
	},

	clear: function() {
		this.widget.initTab();
	},

	handleKeyEvent: function(event) {
		var element = event.target || event.srcElement;
		var line = parseInt(this.widget.getLineIndex(element), 0);
		/*
		 * セル編集モードで移動させた場合、イベント通知は移動後の
		 * エレメントへ送られる。prenetNodeが"field_global"だと編集中
		 */
		if (line == -1) {
			if (element.parentNode.className == "field_global") {
				if (event.keyCode == 9 || event.keyCode == 13) {
					return false;
				}
			}
			return true;
		}
		if (this.widget.cellActive) {
			var col = parseInt(this.widget.getCellIndex(element), 10);
			if (this.widget.NbreCol - 1 > 0 && col < 0) {
				col = 0;
			}
			switch (event.keyCode) {
			case 13:
			case 32:
				this.widget.afterOnClick(line, col);
				break;
			case 37:
				if (0 < col) {
					this.widget.getHtmlCellFromIndex(line, col - 1).focus();
				}
				break;
			case 38:
				if (0 < line) {
					this.widget.getHtmlCellFromIndex(line - 1, col).focus();
				}
				break;
			case 39:
				if (this.widget.NbreCol - 1 > col) {
					this.widget.getHtmlCellFromIndex(line, col + 1).focus();
				}
				break;
			case 40:
				if (this.widget.NbreLig - 1 > line) {
					this.widget.getHtmlCellFromIndex(line + 1, col).focus();
				}
				break;
			default:
				return true;
			}
		} else {
			switch (event.keyCode) {
			case 13:
			case 32:
				this.widget.afterOnClick(line, col);
				break;
			case 38:
				if (0 < line) {
					this.widget.getHtmlLineFromIndex(line - 1).focus();
				}
				break;
			case 40:
				if (this.widget.NbreLig - 1 > line) {
					this.widget.getHtmlLineFromIndex(line + 1).focus();
				}
				break;
			default:
				return true;
			}
		}
		return false;
	},

	setFocus: function() {
		if (this.widget.NbreLig > 0) {
			if (this.widget.cellActive) {
				if (this.widget.NbreCol > 0) {
					this.widget.tableauHTML.childNodes[0].
						childNodes[1].focus();
				}
			} else {
				this.widget.tableauHTML.childNodes[0].focus();
			}
		} else {
			this.widget.tableauHTML.focus();
		}
	}
});
