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
 * 特定のレイアウトやマスカット部品にフォーカスが置かれた状況におけるキー
 * 操作の組み合わせを、コマンドの系列と関連付けます。
 *
 * @name maskat.key.KeyBind
 * @extends maskat.control.CommandSet
 */ 
maskat.lang.Class.declare("maskat.key.KeyBind")
	.extend("maskat.control.CommandSet", {

	/** @scope maskat.key.KeyBind.prototype  */
	
	/**
	 * コンストラクタです。 
	 * 
	 * @param key キー操作の組み合わせを表す文字列
	 * @param type キーイベントの種類 (keypress, keyup, keydown)
	 */
	initialize: function(key, type) {
		this.key = key;
		this.type = type;
		this.shift = false;
		this.ctrl = false;
		this.alt = false;
		this.meta = false;
		this.charCode = false;
		this.commands = [];
	},

	/** 特殊キーを表す文字列とキーコードの対応関係 */
	specialKeys: {
		"ESC": 27,
		"ESCAPE": 27,
		"TAB": 9,
		"SPACE": 32,
		"RETURN": 13,
		"ENTER": 13,
		"BACKSPACE": 8,
		"PLUS": 43,
		"SCROLLLOCK": 145,
		"SCROLL_LOCK": 145,
		"SCROLL": 145,
		"CAPSLOCK": 20,
		"CAPS_LOCK": 20,
		"CAPS": 20,
		"NUMLOCK": 144,
		"NUM_LOCK": 144,
		"NUM": 144,
		
		"PAUSE": 19,
		"BREAK": 19,
		
		"INSERT": 45,
		"HOME": 36,
		"DELETE": 46,
		"END": 35,
		
		"PAGEUP": 33,
		"PAGE_UP": 33,
		"PU": 33,

		"PAGEDOWN": 34,
		"PAGE_DOWN": 34,
		"PD": 34,

		"LEFT": 37,
		"UP": 38,
		"RIGHT": 39,
		"DOWN": 40,

		"F1": 112,
		"F2": 113,
		"F3": 114,
		"F4": 115,
		"F5": 116,
		"F6": 117,
		"F7": 118,
		"F8": 119,
		"F9": 120,
		"F10": 121,
		"F11": 122,
		"F12": 123
	},

	/**
	 * キー操作の組み合わせを表す文字列を解析し、このオブジェクトに修飾キー
	 * とキーコードを設定します。
	 */
	decode: function() {
		/* キー文字列を大文字に変換して空白を除去し、"+" で分割 */
		var keys = this.key.toUpperCase().replace(/ /g, "").split("+");

		for (var i = 0, len = keys.length; i < len; i++) {
			switch (keys[i]) {
			case "CTRL":
			case "CONTROL":
				this.ctrl = true;
				break;
			case "SHIFT":
				this.shift = true;
				break;
			case "ALT":
				this.alt = true;
				break;
			case "META":
				this.meta = true;
				break;
			default:
				this.charCode = this.specialKeys[keys[i]];
				if (typeof(this.charCode) == "undefined") {
					this.charCode = keys[i].charCodeAt();
				}
			}
		}
		
		/* TODO  IEでヘルプを表示しない処理（1回実行すれば良いだけだが、ここだと複数回呼ばれる） */
		if (this.charCode == 112) {
			document.onhelp = function() { return false; };
		}
	},
	
	/**
	 * 引数で与えられたイベントが、このキーバインドで指定されているキー操作の
	 * 組み合わせに該当するかどうかを確認します。
	 * 
	 * @param e
	 *            イベント
	 * @returns このキーバインドで指定されたキー操作の組み合わせに該当する
	 *           場合は true、 該当しない場合は false
	 */
	match : function(e) {
		return (this.type == e.type)
				&& (this.ctrl == (e.ctrlKey || false))
				&& (this.shift == (e.shiftKey || false))
				&& (this.alt == (e.altKey || false))
				&& (this.meta == (e.metaKey || false))
				&& (this.charCode == (e.keyCode || e.charCode));
	}

});
