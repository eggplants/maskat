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
maskat.lang.Class.declare("maskat.widget.rialto.RialtoWidgetWrapper")
	.extend("maskat.layout.Widget", {
	
	createWidget: function(parent) {
		return null;
	},

	dispose: function() {
		/* Rialto コンポーネントの破棄 */
		if (this.widget) {
			this.widget.remove();
		}
		
		/* ラッパーオブジェクトの属性を破棄 */
		maskat.lang.Object.dispose(this);
	},

	unwrap: function() {
		return this.widget;
	},

	getWidgetId: function() {
		return this.name;
	},

	getElement: function() {
		return this.widget.getHtmlExt();
	},

	appendChildElement: function(element) {
		var parent;
		if (this.widget instanceof rialto.widget.AbstractContainer) {
			parent = this.widget.getHtmlCont();
		} else {
			parent = this.widget.getHtmlExt();
		}
		parent.appendChild(element);
	},

	setParent: function(parent){
		if (this.parent == parent) {
			return;
		}
		this.parent = parent;

		var parentWidget = parent.unwrap();
		if (parentWidget instanceof rialto.widget.AbstractContainer) {
			parentWidget.add(this.widget);
		} else {
			this.widget.placeIn(parent.getElement());
		}
	},
	
	isVisible: function(){
		return this.widget.isVisible();
	},
	
	setVisible: function(visible){
		this.widget.setVisible(visible);
		var element = this.widget.getHtmlExt();
		if (element) {
			element.style.visibility = visible ? "inherit" : "hidden";
		}
	},

    isEnabled: function() {
		return this.widget.isEnable();
    },

	setEnabled: function(enabled){
		this.widget.setEnable(enabled);
	}
});
