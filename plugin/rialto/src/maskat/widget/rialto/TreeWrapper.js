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
maskat.lang.Class.declare("maskat.widget.rialto.TreeWrapper")
	.extend("maskat.widget.rialto.RialtoWidgetWrapper", {

	defaultGetter: "getNodeData",

	defaultSetter: "setNodeData",
	
	createWidget: function(parent) {
		if (!this.width || !this.height) {
			this.width = 0;
			this.height = 0;
		}
		var tree = new rialto.widget.Tree(this);
		if (this.rootNodeData) {
			this.createTreeNode(this.rootNodeData, tree);
			delete this.rootNodeData
		}
		var self = this;
		tree.onclick = function() { self.notifyEvent("onclick", arguments); };
		
		this.widget = tree;
		return tree;
    },

	createTreeNode: function(nodeData, root) {
		var node = new rialto.widget.TreeNode(nodeData);
		node.DIVENTETE.tabIndex = this.getTabIndex();

		var changeIcon = node.changeIcone;
		node.changeIcone = function() {
			changeIcon.call(this);
			if (this.img1.style.visibility == "visible") {
				this.img1.style.visibility = "inherit";
			}
		}
		if (nodeData._hiddenFields) {
			node._hiddenFields = nodeData._hiddenFields;
		}
		if (root) {
			root.add(node);
		}
    	var children = nodeData.children;
    	if (children) {
	    	for (var i = 0; i < children.length; i++) {
	    		node.addNode(this.createTreeNode(children[i]));
	    	}
	    }
		return node;
    },

    postCreateWidget: function() {
		this.widget.divExt.tabIndex = this.getTabIndex();
    },

	getNodeData: function() {
		var data = [];
		this.collectNodeData(this.widget.rootNode, data);
		return data;
	},

	selectedIndex: function() {
		if (!this.widget.currentSelNode || !this.widget.rootNode) {
			return -1;
		}
		return this.widget.getCount(this.widget.currentSelNode).nbC;
	},

	selectedIndexes: function() {
		return [this.getters.selectedIndex.call(this)];
	},

	collectNodeData: function(node, nodes) {
		var param = {
			"NAME": node.name,
			"TEXT": node.text,
			"PARENT": node.fatherNode ? node.fatherNode.name : null
		};
		if (node._hiddenFields) {
			for (var v in node._hiddenFields) {
				param[v] = node._hiddenFields[v];
			}
		}
		nodes.push(param);
		
		if (node.hasChild()) {
			for (var i = 0; i < node.arrChildNode.length; i++) {
				this.collectNodeData(node.arrChildNode[i], nodes);
			}
		}
	},

	setNodeData: function(value) {
		this.rootNodeData = this.createNodeParams(value);
		if (this.rootNodeData) {
			this.createTreeNode(this.rootNodeData, this.widget);
			delete this.rootNodeData
		}
	},
	
	findParentNode: function(node, name) {
		if (node.name == name) {
			return node;
		}
		if (node.children) {
			for (var i = 0; i < node.children.length; i++) {
				var result = this.findParentNode(node.children[i], name);
				if (result) {
					return result;
				}
			}
		}
		return null;
	},
	
	createNodeParams: function(value) {
		var nodeData = {};

		if (this.widget.rootNode) {
			this.widget.rootNode.remove();
			delete this.widget.rootNode;
		}
		for (var i = 0; i < value.length; i++) {
			if (!value[i].PARENT) {
				nodeData = this.getNodeParam(value[i]);
			} else {
				var node = this.findParentNode(nodeData, value[i].PARENT);
				if (node) {
					if (!node.children) {
						node.children = [];
					}
					node.children.push(this.getNodeParam(value[i]));
				}
			}
		}
		return nodeData;
	},
	
	getNodeParam: function(value) {
		var param = {
			name: value.NAME,
			text: value.TEXT,
			icon: value.icon || "images/imTreeview/pict_synthetik_off.gif",
			icon2: value.icon2 || "",
			open: value.open || true,
			reload: value.reload || false,
			onclick: value.onclick || ""
		};
		for (var v in value) {
			if (v.charAt(0) == "_") {
				if (!param._hiddenFields) {
					param._hiddenFields = {};
				}
				param._hiddenFields[v] = value[v];
			}
		}
		return param;
	},
	
	findNodeWidget: function(node, div) {
		if (node.DIVENTETE == div) {
			return node;
		}
		for (var i = 0; i < node.arrChildNode.length; i++) {
			var result = this.findNodeWidget(node.arrChildNode[i], div);
			if (result) {
				return result;
			}
		}
		return null;
	},
   
	handleKeyEvent: function(event) {
		var manager = maskat.key.KeyEventManager.getInstance();
		var element = event.target || event.srcElement;
		var widget = this.findNodeWidget(this.widget.rootNode, element);
		if (!widget) {
			return true;
		}
		switch (event.keyCode) {
		case 13:
		case 32:
			if (widget.hasChild()) {
				widget.toggle();
			} else {
				widget.click();
			}
			break;
		case 37:
			if (widget.hasChild() && widget.open) {
				widget.toggle();
			}
			break;
		case 38:
			if (widget.isFirst()) {
				if (widget.fatherNode) {
					widget.fatherNode.DIVENTETE.focus();
				}
			} else {
				var node = widget.previous();
				while (node.hasChild() && node.open){
					node = node.last();
				}
				node.DIVENTETE.focus();
			}
			break;
		case 39:
			if (widget.hasChild() && !widget.open) {
				widget.toggle();
			}
			break;
		case 40:
			if (widget.hasChild() && widget.open) {
				widget.first().DIVENTETE.focus();
			} else {
				if (!widget.isLast()) {
					widget.next().DIVENTETE.focus();
				} else {
					var node = widget.fatherNode;
					while (node) {
						if (!node.isLast()) {
							node.next().DIVENTETE.focus();
							break;
						}
						node = node.fatherNode;
					}
				}
			}
			break;
		default:
			return true;
		}
		return false;
	},

	setFocus: function() {
		this.widget.rootNode.DIVENTETE.focus();
	}
});
