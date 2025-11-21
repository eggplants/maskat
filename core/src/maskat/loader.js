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
maskat.loaders[maskat.loaders.length] = function(){
	/* フレームワークパスを自動検出して maskat.location に格納 */
	var scripts = document.getElementsByTagName("script");
	var regexp = /\/core\/maskat\.js(\.uncompressed)?$/;

	for (var i = 0, len = scripts.length; i < len; i++) {
		var src = scripts[i].getAttribute("src");
		var match = src && src.match(regexp);
		if (match) {
			maskat.location = src.substring(0, match.index + 1);
			maskat.debug = (match[1] == ".uncompressed");
			break;
		}
	}

	/* メッセージリソースの読み込み */
	maskat.util.Message.loadTemplates(maskat.location + "core/messages.json");

	/* マスカットアプリケーションの生成 */
	maskat.app = new maskat.core.Application();

	/* プラグインマネージャの起動 */
	var manager = maskat.core.PluginManager.getInstance();
	try {
		manager.loadProperties(maskat.location + "properties.json");
		manager.loadProperties("properties.json");
	} catch (e) { /* suppress */ }

	manager.plugins.core = maskat.app;
	manager.launch(function() { maskat.app.run(); });

};
