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
 * @class 可視化を変更するターゲットと変更内容を持つクラスです。
 *
 * @name maskat.control.SetVisibleCommand
 * @extends maskat.control.Command
 */ 
maskat.lang.Class.declare("maskat.control.SetVisibleCommand")
	.extend("maskat.control.Command", {

	/** @scope maskat.control.SetVisibleCommand.prototype  */
	
	/**
	 * コンストラクタです。 
	 */
	initialize: function(target, visible){
		this.target = target;
		this.visible = visible;
	},
	
	execute: function(){
		this.target.setVisible(this.visible);
		return false;
	}

});

