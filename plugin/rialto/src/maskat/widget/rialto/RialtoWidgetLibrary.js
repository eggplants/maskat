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
maskat.lang.Class.declare("maskat.widget.rialto.RialtoWidgetLibrary")
	.extend("maskat.layout.WidgetLibrary", {

	getBindingConfiguration: function() {
		var config = {
			window: {
				type: maskat.widget.rialto.SimpleWindowWrapper,
				attributes: {
					bWithoutPlaceIn: { type: "boolean" },
					name: { type: "string", required: true },
					type: { type: "string" },
					top: { type: "number" },
					left: { type: "number" },
					width: { type: "number" },
					height: { type: "number" },
					position: {
						type: "enum",
						values: [ "static", "absolute", "relative" ],
						defaultValue: "absolute"
					},
					enable: { type: "boolean", defaultValue: true },
					draggable: { type: "boolean" },
					resizable: { type: "boolean" },
					autoResizableH: { type: "boolean" },
					autoResizableW: { type: "boolean" },
					title: { type: "string" },
					icone: { type: "string" },
					style: {
						type: "enum",
						values: [ "default", "fenetre" ],
						defaultValue: "fenetre"
					}
				},
				children: {
					"*": { property: "children", repeat: true }
				}
			},

			image: {
				type: maskat.widget.rialto.ImageWrapper,
				attributes: {
					bWithoutPlaceIn: { type: "boolean" },
					name: { type: "string", required: true },
					type: { type: "string" },
					top: { type: "number", required: true },
					left: { type: "number", required: true },
					width: { type: "number" },
					height: { type: "number" },
					position: {
						type: "enum",
						values: [ "static", "absolute", "relative" ],
						defaultValue: "absolute"
					},
					enable: { type: "boolean", defaultValue: true },
					draggable: { type: "boolean" },
					resizable: { type: "boolean" },
					autoResizableH: { type: "boolean" },
					autoResizableW: { type: "boolean" },
					imageOut: { type: "string", required: true },
					alternateText: { type: "string" },
					imageOn: { type: "string" },
					imageDisabled: { type: "string" },
					boolFloatRight: { type: "boolean" },
					boolFloatLeft: { type: "boolean" }
				}
			},

			tabFolder: {
				type: maskat.widget.rialto.TabFolderWrapper,
				attributes: {
					bWithoutPlaceIn: { type: "boolean" },
					name: { type: "string", required: true },
					type: { type: "string" },
					top: { type: "number", required: true },
					left: { type: "number", required: true },
					width: { type: "number", required: true },
					height: { type: "number", required: true },
					position: {
						type: "enum",
						values: [ "static", "absolute", "relative" ],
						defaultValue: "absolute"
					},
					enable: { type: "boolean", defaultValue: true },
					draggable: { type: "boolean" },
					resizable: { type: "boolean" },
					autoResizableH: { type: "boolean" },
					autoResizableW: { type: "boolean" },
					autoResizeContenu: { type: "boolean" },
					autoResizeParent: { type: "boolean" },
					autoRedimTab: { type: "boolean" },
					isClosable: { type: "boolean" },
					draggableItem: { type: "boolean", defaultValue: false },
					orientation: {
						type: "enum",
						values: ["t", "b", "l", "r"]
					},
					widthTabName: { type: "number" },
					noActiveTab: { type: "number", defaultValue: 1 },
					tabIndex: { type: "number", defaultValue: -1 }
				},
				children: {
					tabItem: { property: "children", repeat: true }
				}
			},

			tabItem: {
				type: maskat.widget.rialto.TabItemWrapper,
				attributes: {
					name: { type: "string", required: true },
					title: { type: "string" }
				},
				children: {
					"*": { property: "children", repeat: true }
				}
			},

			splitter: {
				type: maskat.widget.rialto.SplitterWrapper,
				attributes: {
					bWithoutPlaceIn: { type: "boolean" },
					name: { type: "string", required: true },
					type: { type: "string" },
					top: { type: "number", required: true },
					left: { type: "number", required: true },
					width: { type: "number", defaultValue: 0 },
					height: { type: "number", defaultValue: 0 },
					position: {
						type: "enum",
						values: [ "static", "absolute", "relative" ],
						defaultValue: "absolute"
					},
					enable: { type: "boolean", defaultValue: true },
					draggable: { type: "boolean" },
					resizable: { type: "boolean" },
					autoResizeParent: { type: "boolean"},
					autoResizableH: { type: "boolean" },
					autoResizableW: { type: "boolean" },
					prop: { type: "number" },
					orientation: { type: "enum", values: ["v", "h"] },
					autoResizeContenu: { type: "boolean" },
					style: { type: "enum", values: ["normal", "3D"] },
					overflow: { type: "enum", values: ["auto", "hidden"] },
					modeLim: { type: "enum", values: ["%", "abs"] },
					limInf: { type: "number" },
					limSup: { type: "number" },
					reverseClose: { type: "boolean" },
					withImg: { type: "boolean" },
					tailleCurs: { type: "number" }
				},
				children: {
					divSplit: { property: "children", repeat: true }
				}
			},

			divSplit: {
				type: maskat.widget.rialto.DivSplitWrapper,
				attributes: {
					name: { type: "string", required: true },
					backgroundColor: { type: "string", defaultValue: "white" }
				},
				children: {
					"*": { property: "children", repeat: true }
				}
			},

			label: {
				type: maskat.widget.rialto.LabelWrapper,
			    attributes: {
					name: { type: "string", required: true },
					top: { type: "number", required: true },
					left: { type: "number", required: true },
					text: { type: "string" },
					className: { type: "string" },
					position: {
						type: "enum",
						values: [ "static", "relative", "absolute" ]
					}
				}
			},

			text: {
				type: maskat.widget.rialto.TextWrapper,
				attributes: {
					name: { type: "string", required: true },
					top: { type: "number", required: true },
					left: { type: "number", required: true },
					width: { type: "number" },
					datatype: {
						type: "enum",
						values: ["T", "P", "A", "N", "I", "D", "H", "Hi"]
					},
					position: {
						type: "enum",
						values: ["static", "relative", "absolute"]
					},
					nbchar: { type: "number" },
					autoUp: { type: "boolean" },
					disable: { type: "boolean" },
					isRequired: { type: "boolean" },
					rows: { type: "number" },
					initValue: { type: "string" },
					accessKey: { type: "string" },
					tabIndex: { type: "number" }
				}
			},

			button: {
				type: maskat.widget.rialto.ButtonWrapper,
				attributes: {
			        name: { type: "string", required: true },
			        top: { type: "number", required: true },
			        left: { type: "number", required: true },
			        title: { type: "string" },
			        alt: { type: "string" },
			        width: { type: "number" },
			        widthMin:{ type: "number" },
			        adaptToText: { type: "boolean" },
			        enable: { type: "boolean", defaultValue: true },
			        tabIndex: { type: "number", defaultValue: -1 }
			    }
			},

			combo: {
				type: maskat.widget.rialto.ComboWrapper,
				attributes: {
					name: { type: "string", required: true },
					top: { type: "number", required: true },
					left: { type: "number", required: true },
					width: { type: "number", required: true  },
					parent: { type: "object" },
					position: {
						type: "enum",
						values: ["static", "relative", "absolute"]
					},
					suggest: { type: "boolean" },
			        enable: { type: "boolean", defaultValue: true },
					heightItem: { type: "number" },
					tabIndex: { type: "number", defaultValue: -1 }
				},
				children: {
					comboItem: { property: "tabData", repeat: true }
				}
			},

			comboItem: {
				type: Array,
				attributes: {
					text: { type: "string", property: "1" ,required: true },
					value: { type: "string", property: "0" ,required: true }
				}
			},

			radioGroup: {
				type: maskat.widget.rialto.RadioGroupWrapper,
				attributes: {
					name: {type: "string", required: true},
					tabIndex: {type: "number", defaultValue: -1}
				},
				children: {
					radioMember: { property: "members", repeat: true, value: "ref" }
				}
			},

			radioMember: {
				attributes: {
					ref: { type: "string" ,required: true }
				}
			},

			radio: {
				type: maskat.widget.rialto.RadioWrapper,
				attributes: {
					name: { type: "string", required: true },
					top: { type: "number", required: true },
					left: { type: "number", required: true },
					parent: { type: "object" },
					// レイアウト定義XML的には使用してはいけないが、処理上許可
					group: { type: "string" },
					text: { type: "string" },
					checked: { type: "boolean" },
					className: { type: "string" },
			        enable: { type: "boolean", defaultValue: true },
   					tabIndex: {type: "number", defaultValue: -1}
				}
			},

			checkbox: {
				type: maskat.widget.rialto.CheckboxWrapper,
				attributes: {
					name: { type: "string", required: true },
					top: { type: "number", required: true },
					left: { type: "number", required: true },
					parent: { type: "object" },
					text: { type: "string" },
					checked: { type: "boolean" },
					className: { type: "string" },
					tabIndex: { type: "number", defaultValue: -1},
			        enable: { type: "boolean", defaultValue: true }
				}
			},

			alert: {
				type: maskat.widget.rialto.AlertWrapper,
				attributes: {
					name: { type: "string" , required: true},
					mess: { type: "string" , required: true}
				}
			},

			frame: {
				type: maskat.widget.rialto.FrameWrapper,
			    attributes: {
					bWithoutPlaceIn: { type: "boolean" },
					name: { type: "string", required: true },
					type: { type: "string" },
					top: { type: "number", required: true },
					left: { type: "number", required: true },
					width: { type: "number", required: true },
					height: { type: "number", required: true },
					position: {
						type: "enum",
						values: [ "static", "absolute", "relative" ],
						defaultValue: "absolute"
					},
					enable: { type: "boolean", defaultValue: true },
					draggable: { type: "boolean" },
					resizable: { type: "boolean" },
					autoResizableH: { type: "boolean" },
					autoResizableW: { type: "boolean" },
				    dynamic: { type: "boolean" },
				    open: { type: "boolean" },
				    title: { type: "string" },
				    printTitle: { type: "string" },
				    autoResizeContenu: { type: "boolean" },
				    autoResizeParent: { type: "boolean" },
				    boolPrint: { type: "boolean" },
				    boolMaxi: { type: "boolean" }
				},
				children: {
					"*": { property: "children", repeat: true }
				}
			},

			popup: {
				type: maskat.widget.rialto.PopupWrapper,
				attributes: {
					name: { type: "string", required: true },
					top: { type: "number", required: true },
					left: { type: "number", required: true },
					width: { type: "number",required: true },
					height: { type: "number",required: true },
					content: { type: "string" },
					visible: { type: "boolean", defaultValue: false },
					withCloseButon: { type: "boolean", defaultValue: true },
					position: {
						type: "enum",
						values: ["absolute", "relative"],
						defaultValue:  "absolute"
					},
					draggable: { type: "boolean", defaultValue: false},
					title: { type: "string" ,defaultValue: "Window"},
					suffFond: {
						type: "enum",
						values: [ "Gris", "Transparent" ],
						defaultValue: "Transparent"
					},
					modeContainer: {
						type: "enum",
						values: ["AutoScroll", "nonFen"]
					},
					bSansBtonClose: { type: "boolean" }
				},
				children: {
					"*": { property: "children", repeat: true }
				}
			},

			treeview: {
				type: maskat.widget.rialto.TreeWrapper,
				attributes: {
					bWithoutPlaceIn: { type: "boolean" },
					name: { type: "string",required: true },
					type: { type: "string" },
					top: { type: "number" ,required: true},
					left: { type: "number" , required: true},
					width: { type: "number" , defaultValue: 0},
					height: { type: "number" , defaultValue: 0},
					position: {
						type: "enum",
						values: [ "static", "absolute", "relative" ],
						defaultValue: "absolute"
					},
					enable: { type: "boolean", defaultValue: true },
					draggable: { type: "boolean" },
					resizable: { type: "boolean" },
					autoResizableH: { type: "boolean" },
					autoResizableW: { type: "boolean" },
				    boolSelActive: { type: "boolean" },
				    withT: { type: "boolean" },
				    rootOpen: { type: "boolean" },
				    withRoot: { type: "boolean" },
				    autoResizableH: { type: "boolean" },
				    autoResizableW: { type: "boolean" },
				    draggableNode: { type: "boolean" },
				    rootNode: { type: "object" },
				    parent: { type: "object" },
				    tabIndex: { type: "number" }
				},
				children: {
					treeNode: { property: "rootNodeData" }
				}
			},

			treeNode: {
				attributes: {
					bWithoutPlaceIn: { type: "boolean" },
					name: { type: "string" ,required: true},
					type: { type: "string" },
					top: { type: "number" },
					left: { type: "number" },
					width: { type: "number" },
					height: { type: "number" },
					position: {
						type: "enum",
						values: [ "static", "absolute", "relative" ],
						defaultValue: "absolute"
					},
					enable: { type: "boolean", defaultValue: true },
					draggable: { type: "boolean" },
					resizable: { type: "boolean" },
					autoResizableH: { type: "boolean" },
					autoResizableW: { type: "boolean" },
					typeInfo: { type: "string" },
					sText: { type: "string", property: "text" },
					sIcon: { type: "string", property: "icon" },
					sIcon2: { type: "string", property: "icon2" },
					onclick: { type: "string" },
					open: { type: "boolean" },
					reload: { type: "boolean" },
					url: { type: "string" }
				},
				children: {
					treeNode: { repeat: true, property: "children" }
				}
			},

			grid: {
				type: maskat.widget.rialto.GridWrapper,
				attributes: {
					bWithoutPlaceIn: { type: "boolean" },
					name: { type: "string", required: true },
					type: { type: "string" },
					top: { type: "number", required: true },
					left: { type: "number", required: true },
					width: { type: "number" },
					height: { type: "number" , defaultValue: 100 },
					position: {
						type: "enum",
						values: [ "static", "absolute", "relative" ],
						defaultValue: "absolute"
					},
					enable: { type: "boolean", defaultValue: true },
					draggable: { type: "boolean" },
					resizable: { type: "boolean" },
					autoResizableH: { type: "boolean" },
					autoResizableW: { type: "boolean" },
					TabEntete: { type: "object" },
					bNavig: { type: "boolean" },
					cellActive: { type: "boolean" },
					multiSelect: { type: "boolean" },
					lineHeight: { type: "number" },
					rang: { type: "number" },
					widthLastCell: { type: "number" },
					actifClic: { type: "boolean" },
					boolPrint: { type: "boolean" },
					switchable: { type: "boolean" },
					printTitle: { type: "string" },
					autoResizeContenu: { type: "boolean" },
					autoResizeParent: { type: "boolean" },
					writable: { type: "boolean" },
					tabTypeCol: { type: "object" },
					parent: { type: "object" },
					tabIndex: { type: "number", defaultValue: -1 },
					sortable: { type: "boolean", defaultValue: true },
					sortCol: { type: "number", defaultValue: 0 },
					sortType: {
						type: "enum",
						values: { "asc": false, "desc": true },
						defaultValue: "asc",
						property: "boolOrder"
					},
					onCellEdit:{ type: "function"}
				},
				children: {
					gridHeader: { property: "headers", repeat: true },
					gridLine: { property: "tabData", repeat: true, value: "cells" }
				}
			},

			gridHeader: {
				attributes: {
					width: { type: "number", property: "width", required: true },
					title: { type: "string", property: "title" },
					type: {
						type: "enum",
						values: [ "number", "date", "string" ],
						property: "type",
						required: true
					}
				},
				children: {
					gridCellCombo: { property: "tabData", repeat: true }
				}
			},

			gridCellCombo: {
				type: Array,
				attributes: {
					value: { property: "0", type: "string"},
					text: { property: "1", type: "string" }
				}
			},

			gridLine: {
				children: {
					gridCell: { property: "cells", repeat: true }
				}
			},

			gridCell: {
				attributes: {
					value: { type: "string" }
				}
			},

			codeLib: {
				type: maskat.widget.rialto.CodeLibWrapper,
				attributes: {
					bWithoutPlaceIn: { type: "boolean" },
					name: { type: "string", required: true },
					type: { type: "string" },
					top: { type: "number", required: true },
					left: { type: "number", required: true },
					width: { type: "number", required: true },
					position: {
						type: "enum",
						values: [ "static", "absolute", "relative" ],
						defaultValue: "absolute"
					},
					enable: { type: "boolean", defaultValue: true },
					draggable: { type: "boolean" },
					resizable: { type: "boolean" },
					autoResizableH: { type: "boolean" },
					autoResizableW: { type: "boolean" },
					parent: { type: "object"  },
					arrValue: { type: "object"  },
					boolWithLabel: { type: "boolean", property: "withLabel" },
					url: { type: "string", required: true },
					submitOnload: { type: "boolean" },
					alwaysRefresh: { type: "boolean" },
					codeWidth: { type: "number" },
					tabIndex: { type: "number", defaultValue: -1 }
				}
			}
		};

		return config;
	}


});
