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
 * XML 要素とオブジェクトをバインドします。
 *
 * @name maskat.xml.ElementBinding
 */ 
maskat.lang.Class.declare("maskat.xml.ElementBinding", {

	/** @scope maskat.xml.ElementBinding.prototype */

	/**
	 * コンストラクタです。
	 * 
	 * @param name
	 *            XML 要素の名前空間 URI
	 * @param name
	 *            XML 要素のローカル名
	 * @param config
	 *            バインディング設定
	 * <pre>
	 * {
	 *     type: XML 要素の読み込み時に生成するオブジェクトの型
	 * 
	 *     attributes: {
	 *         属性名: 属性のバインディング設定
	 *                 ({@link maskat.xml.AttributeBinding#initialize} を参照)
	 *         ...
	 *     }
	 * 
	 *     children: {
	 *         要素名: 子要素のバインディング設定 
	 *                 ({@link maskat.xml.ChildNodeBinding#initialize} を参照)
	 *         ...
	 *     }
	 * }
	 * </pre>
	 */
	initialize: function(uri, name, config) {
		this.uri = uri || "";
		this.name = name;
		this.type = config && config.type;
		this.children = {};
		this.attributes = {};

		if (config && config.attributes) {
			for (var attrName in config.attributes) {
				this.addAttributeBinding(attrName, config.attributes[attrName]);
			}
		}

		if (config && config.children) {
			for (var childName in config.children) {
				this.addChildBinding(childName, config.children[childName]);
			}
		}
	},

	addAttributeBinding: function(name, config) {
		var binding = new maskat.xml.AttributeBinding(name, config);
		this.attributes[name] = binding;
	},

	getChildBinding: function(uri, name) {
		if (typeof(uri) == "object") {
			var qname = uri;
			uri = qname.namespaceURI;
			name = qname.localName || qname.baseName || qname.nodeName;
		}

		var binding = this.children[name] || this.children["*"];
		if (!binding) {
			throw new maskat.lang.Error("INVALID_CHILD_ELEMENT",
				{ elementName: this.name, childName: name });
		}
		return binding;
	},

	addChildBinding: function(name, config) {
		var uri = (name.charAt(0) == "#") ? "" : this.uri;
		var binding = new maskat.xml.ChildNodeBinding(uri, name, config);
		this.children[name] = binding;
	},

	/**
	 * XML 要素をオブジェクトに読み込みます。
	 * 
	 * @param context
	 *            XML 読み込みに使用するコンテキスト
	 * @param element
	 *            XML 要素
	 */
	read: function(context, element) {
		var nodeName = element.localName || element.baseName || element.nodeName;
		context.nodeNames[context.nodeNames.length] = nodeName;
		
		/* XML 要素の読み込み先となる新しいオブジェクトを生成 */
		try {
			if (this.type) {
				context.pushObject(new this.type());
			} else {
				context.createObject(element);
			}
		} catch (e) {
			throw new maskat.lang.Error("ELEMENT_READ_ERROR", {
				elementName: this.name
			}, e);
		}

		/* 属性の読み込み */
		var attributes = element.attributes;
		for (var i = 0, l = attributes.length; i < l; i++) {
			var attribute = attributes[i];
			var attrName = attribute.localName || attribute.baseName;
			if (attribute.prefix == "xmlns" && attrName != "xmlns") {
				/* XML 名前空間宣言を登録する */
				context.addPrefixMapping(attrName, attribute.nodeValue);
			} else if (attribute.nodeName == "xmlns") {
				/* デフォルトの XML 名前空間宣言を登録する */
				context.addPrefixMapping("", attribute.nodeValue);
			} else {
				/* その他の属性を読み込み */
				try {
					this.readAttribute(context, attribute);
				} catch (e) {
					throw new maskat.lang.Error("ATTRIBUTE_READ_ERROR", {
						elementName: this.name,
						attributeName: attribute.nodeName
					}, e);
				}
			}
		}

		/* 省略された属性の読み込み (必須チェック／デフォルト値) */
		for (var name in this.attributes) {
			if (name != "*" && !element.getAttribute(name)) {
				try {
					this.attributes[name].read(context, null);
				} catch (e) {
					throw new maskat.lang.Error("ATTRIBUTE_READ_ERROR", {
						elementName: this.name,
						attributeName: name
					}, e);
				}
			}
		}

		/* 子要素の読み込み */
		var children = element.childNodes;
		if (context.isFF && (element.childElementCount == 0) && (children.length > 1)){
			element.normalize();
		}
		var occurrence = {};
		for (var j = 0, m = children.length; j < m; j++) {
			/* 子要素の出現回数をカウントする */
			var child = children[j];
			var childName = child.localName || child.baseName || child.nodeName;
			if (maskat.schemaValidation) {
				occurrence[childName] = (occurrence[childName] || 0) + 1;
			}
			switch (child.nodeType) {
			case 1: /* Node.ELEMENT_NODE */
				this.readChildElement(context, child);
				break;
			case 3: /* Node.TEXT_NODE */
				if (!child.nodeValue.match(/^\s*$/)) {
					this.readChildElement(context, child);
				}
				break;
			case 4: /* Node.CDATA_SECTION_NODE */
				this.readChildElement(context, child);
				break;
			}
		}
		/* 子要素の出現回数のチェック */
		if (maskat.schemaValidation) {
			for (var name in this.children) {
				var config = this.children[name];
				if (config.required && !occurrence[name]) {
					/* 必須の子要素が省略されている場合はエラー */
					throw new maskat.lang.Error("MISSING_CHILD_ELEMENT", {
						elementName: this.name, childName: name	});
				}
				if (!config.repeat && occurrence[name] > 1) {
					/* 繰り返しできない子要素が繰り返された場合はエラー */
					throw new maskat.lang.Error("DUPLICATED_CHILD_ELEMENT", {
						elementName: this.name, childName: name	});
				}
			}
		}
		/* 空タグ追加 */
		if (children.length == 0 && element.nodeType == 1) {
			var binding = this.children["#text"];
			if (binding && binding.property != undefined) {
				context.setProperty(binding.property, "");
			}
		}
		context.nodeNames.pop();
	},

	readAttribute: function(context, attribute) {
		var name = attribute.localName || attribute.baseName;
		var binding = this.attributes[name];
		if (binding) {
			binding.read(context, attribute);
		} else if (this.attributes["*"]) {
			context.setProperty(name, attribute.nodeValue);
		} else {
			throw new maskat.lang.Error("UNKNOWN_ATTRIBUTE",
				{ elementName: this.name, attributeName: name });
		}
	},

	readChildElement: function(context, element) {
		var binding = this.getChildBinding(element);
		binding.read(context, element);
	},

	/**
	 * オブジェクトを XML 要素の形式で書き出します。
	 * 
	 * @param context
	 *            XML 書き出しに使用するコンテキスト
	 */
	write: function(context) {
		/* XML 要素の開始タグを出力 */
		context.writeStartElement(this.uri, this.name);
		
		/* 属性を出力 */
		for (var attrName in this.attributes) {
			this.writeAttribute(context, attrName);
		}

		/* 子要素を出力 */
		for (var name in this.children) {
			if (maskat.schemaValidation) {
				if (this.children[name].required && !context.getProperty(name)) {
					throw new maskat.lang.Error("MISSING_CHILD_ELEMENT", {
						elementName: this.name, childName: name	});
				}
			}
			this.writeChildElement(context, name);
		}

		/* XML 要素の終了タグを出力 */
		context.writeEndElement();
		context.popObject();
	},
	
	writeAttribute: function(context, name) {
		var binding = this.attributes[name];
		if (!binding) {
			throw new maskat.lang.Error("UNKNOWN_ATTRIBUTE",
				{ elementName: this.name, attributeName: name });
		}
		binding.write(context);
	},

	writeChildElement: function(context, name) {
		var binding = this.getChildBinding("", name);
		binding.write(context);
	}

});
