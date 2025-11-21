var rialtoConfig =  {	version : 0.9,
				isDebug 		: false,					
				traceLevel		:0,	
				isTestVersion 	: false,
				language	    : 'en'
		 };

// protocol file: absolute local path for rialtoEngine
if (document.location.protocol ==  "file:"){
	rialtoConfig.isFilePath=true;
	rialtoConfig.pathRialtoE = 'rialtoEngine/';
}
// protocol http: ; (relative path) url for rialtoEngine  
else{
	if (document.location.protocol ==  "http:" || document.location.protocol == "https:"){
		rialtoConfig.isFilePath=false;
		rialtoConfig.pathRialtoE = 'rialtoEngine/';
	}	
}
//save the path name	
rialtoConfig.pathName=document.location.pathname;

rialtoConfig.skin = 'standart';

//-----------------------------------------------------------------------------------

if (rialtoConfig.isTestVersion)
	rialtoConfig.skin = 'test';

rialtoConfig.baseIdCssWithSkin 	= 'behavior';
rialtoConfig.skinList 			= ['standart','test'];

rialtoConfig.baseIdCssComposer			= 'composer';
rialtoConfig.extIdCssComposerDesignMode = 'design';
rialtoConfig.extIdCssComposerTryMode 	= 'try';
rialtoConfig.userAgentIsIE = (navigator.appName == "Microsoft Internet Explorer");	
rialtoConfig.userAgentIsGecko = (navigator.userAgent.indexOf('Gecko') != -1);

