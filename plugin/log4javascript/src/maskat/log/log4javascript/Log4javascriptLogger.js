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
 * Log4javascriptログ出力 API の実装クラスです。
 *
 * @name maskat.log.log4javascript.Log4javascriptLogger
 * @extends maskat.log.Log
 */
maskat.lang.Class.declare("maskat.log.log4javascript.Log4javascriptLogger")
	.extend("maskat.log.Log", {

	/** @scope maskat.log.log4javascript.Log4javascriptLogger */

	initialize: function(logger) {
		this.logger = logger;
	},

	getLevel: function() {
		switch(this.logger.getLevel()) {
		case log4javascript.Level.TRACE:
			return maskat.log.Log.TRACE;
		case log4javascript.Level.DEBUG:
			return maskat.log.Log.DEBUG;
		case log4javascript.Level.INFO:
			return maskat.log.Log.INFO;
		case log4javascript.Level.WARN:
			return maskat.log.Log.WARN;
		case log4javascript.Level.ERROR:
			return maskat.log.Log.ERROR;
		case log4javascript.Level.FATAL:
			return maskat.log.Log.FATAL;
		}
		return maskat.log.Log.FATAL;
	},

	trace: function(message, error) {
		this.logger.trace(message, error);
	},

	debug: function(message, error) {
		this.logger.debug(message, error);
	},

	info: function(message, error) {
		this.logger.info(message, error);
	},

	warn: function(message, error) {
		this.logger.warn(message, error);
	},

	error: function(message, error) {
		this.logger.error(message, error);
	},

	fatal: function(message, error) {
		this.logger.fatal(message, error);
	}
});

