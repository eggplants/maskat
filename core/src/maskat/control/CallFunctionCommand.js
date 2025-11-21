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
 * @class 実行する関数を持つクラスです。
 *
 * @name maskat.control.CallFunctionCommand
 * @extends maskat.control.Command
 */ 
maskat.lang.Class.declare("maskat.control.CallFunctionCommand")
	.extend("maskat.control.Command", {

	/** @scope maskat.control.CallFunctionCommand.prototype  */
	
	/**
	 * コンストラクタです。 
	 */
	initialize: function(name){
		this.name = name;
	},
	
	execute: function(){
		this.func();
		return false;
	}
});

