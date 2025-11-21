/*
 * Copyright (c)  2006-2011 Maskat Project.
 *
 * This software is the confidential and proprietary information of
 * NTT DATA CORPORATION ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with NTT DATA.
*/
maskat.lang.Class.declare("maskat.widget.maskat.WidgetLibrary")
	.extend("maskat.layout.WidgetLibrary", {

	getPrefix: function() {
		return "maskat";
	},

	getNamespaceURI: function() {
		return "http://maskat.sourceforge.jp/widget/maskat/1.0.0";
	},

	getBindingConfiguration: function() {
		return {
			grid: {
				type: maskat.widget.maskat.Grid,
				attributes: {
					id: { type: "string"},
					name: { type: "string", required: true },
					top: { type: "length" },
					left: { type: "length" },
					width: { type: "length" },
					height: { type: "length" },
					url: { type: "string" },
					initRows: { type: "number", defaultValue: 25 },
					minRowHeight: { type: "length", defaultValue: "21px" },
					onclick: { type: "function"},
					selectable: { type: "boolean", defaultValue: false },
					tabIndex: { type: "number" }
				},
				children: {
					row: { property: "cells", repeat: true , value:"cell"}
				}
			},

			row: {
				children: {
					cell: { property: "cell", repeat: true}
				}
			},

			cell: {
				attributes: {
					value: { type: "string" },
					name: {type: "string" },
					width: { type: "length" },
					field: { type: "string" },
					formatter: {type: "function"},
					sortable: { type: "boolean", defaultValue: false },
					sorter: { type: "function" },
					headerCssText: { type: "string", defaultValue: "" },
					rowCssText: { type: "string", defaultValue: "" },
					editable: { type: "boolean", defaultValue: false },
					validator: { type: "function" },
					rowSpan: { type: "number" },
					colSpan: { type: "number" },
					rowHidden: { type: "boolean", defaultValue: false },
					headerHidden: { type: "boolean", defaultValue: false }
				}
			}
		};
	}

});
