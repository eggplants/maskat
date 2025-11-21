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
 * @class 指定した URL からレイアウト定義およびイベント定義 XMLを読み込むクラスです。
 *
 * @name maskat.control.LoadLayoutCommand
 * @extends maskat.control.Command
 */ 
maskat.lang.Class.declare("maskat.control.LoadLayoutCommand")
	.extend("maskat.control.Command", {
	
	/** @scope maskat.control.LoadLayoutCommand.prototype  */
	
	/**
	 * コンストラクタです。 
	 */
	initialize: function() {
		this.layoutURL = null;
		this.eventURL = null;
		this.elementId = null;
		this.visible = null;
	},

	execute: function(app) {
		if (!this.eventURL) {
			/*
			 * レイアウト定義 XML の URL を以下の規則で書き換えてイベント定義
			 * XML の URL を決定する
			 * 
			 * 1) レイアウト定義 XML の拡張子の直前に "_e" を挿入
			 *    layout.xml    -> layout_e.xml
			 *    layout.xml.gz -> layout_e.xml.gz
			 *    layout.do     -> layout_e.do
			 *    
			 * 2) レイアウト定義 XML に拡張子がない場合、末尾に "_e" を追加
			 *    layout -> layout_e 
			 */
			this.eventURL = this.layoutURL.replace(/(\.([^/]*))?$/, "_e$1");
		}
		
		var element = document.getElementById(this.elementId);
		app.loadLayout(this.layoutURL, this.eventURL, element, this.visible);
	}

});
