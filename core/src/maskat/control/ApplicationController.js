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
 * @class イベント発生元のマスカット部品名、およびイベントの種類から、適切なコマンドをアプリケーションに追加するクラスです。
 *
 * @name maskat.control.ApplicationController
 */ 
maskat.lang.Class.declare("maskat.control.ApplicationController", {

	/** @scope maskat.control.ApplicationController.prototype */
	
	/**
	 * コンストラクタです。 
	 */
	initialize: function(){
		this.app = null;
		this.init = null;
		this.commands = {};
	},

	setApplication: function(app){
		this.app = app;
	},

	getCommand: function(event){
		var path = [event.layoutId, event.widgetId, event.type, (event.branch || "")];
		var command = maskat.lang.Object.find(path, this.commands);
		
		if (!command) {
			path[0] = "";
			command = maskat.lang.Object.find(path, this.commands);
		}
		return command;
	},

	addCommand: function(command){
		var branch = command.branch || "";
		var scope = maskat.lang.Object.create(
			[command.layoutId, command.widgetId, command.eventType], this.commands);
		scope[branch] = command;
	},

	start: function() {
		if (this.init) {
			this.init.execute(this.app);
		}
	},

	handleEvent: function(event){
		var command = this.getCommand(event);
		if (command) {
			command.execute(this.app);
		}
	}

});
