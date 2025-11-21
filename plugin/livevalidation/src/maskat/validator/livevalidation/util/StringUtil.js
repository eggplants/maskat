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
 * 文字列処理に関するユーティリティクラスです。
 */
maskat.lang.Class.declare("maskat.validator.livevalidation.util.StringUtil", {

	_static: {
		
		/**
		 * 引数で与えた文字列を区切り文字で分割し、配列に変換して返却します。
		 * 
		 * 区切り文字として扱いたくないときは'#'でエスケープしてください。
		 * '#'自身分割後の文字列に含めたい場合は'##'と設定してください。
		 * 
		 * @param {string} target 変換対象の文字列
		 * @param {string} delimiterString 区切り文字列
		 * @return 区切り文字列により分割された配列 
		 */
		split: function(target, delimiterString) {
			var delimiter = delimiterString || ',';
			var escapeChar = '#';

			// エスケープ文字のエスケープ処理
			var patternEscapeChar = new RegExp(escapeChar + escapeChar, 'g');
			var escapeStringEscapeChar = '#{ESCAPE_STRING_ESCAPE_CHAR}';
			var str = target.replace(patternEscapeChar, escapeStringEscapeChar);

			// 区切り文字のエスケープ処理
			var escapeStringDelimiter = '#{ESCAPE_STRING_DELIMITER}';
			var patternDelmiter =
				new RegExp(escapeChar + delimiter, 'g');  
			str = str.replace(patternDelmiter, escapeStringDelimiter);

			// 配列への分割とエスケープした文字の復元
			var result = str.split(delimiter);

			var patternEscapeCharReverse = new RegExp(escapeStringEscapeChar, 'g');
			var patternDelimiterReverse = new RegExp(escapeStringDelimiter, 'g');			

			for (var i = 0, length = result.length; i < length; i++) {
				var work = result[i].replace(patternDelimiterReverse, delimiter);
				work = work.replace(patternEscapeCharReverse, escapeChar);
				result[i] = work;  
			}

			return result;
		}
	}
});
