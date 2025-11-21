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
 * @class 利用可能状態を変更するターゲットと変更内容を持つクラスです。
 *
 * @name maskat.control.SetEnableCommand
 * @extends maskat.control.Command
 */ 
maskat.lang.Class.declare("maskat.control.SetEnabledCommand")
	.extend("maskat.control.Command", {

	/** @scope maskat.control.SetEnableCommand.prototype  */
	
	/**
	 * コンストラクタです。 
	 */
	initialize: function(target, enabled){
		this.target = target;
		this.enabled = enabled;
	},
	
	execute: function(){
		this.target.setEnabled(this.enabled);
		return false;
	}

});

