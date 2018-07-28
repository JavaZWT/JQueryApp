/**
 * 用于判断当前访问的浏览器类型,以便引用不同的cordova.js文件
 * 请注意将该文件引入放置到html文件的末尾,否则无法正常工作
 */
(function (){
	window.appVersion = app_cordova_checkApp();
	
	//如果不是浏览器版本 需要添加cordova
	if(appVersion != 'Browser'){
		var scriptE = document.createElement('script');
		scriptE.setAttribute('type','text/javascript');
		scriptE.setAttribute('src',findCordovaPath() + appVersion+'/cordova.js');
		document.body.appendChild(scriptE);
	}
	
	function app_cordova_checkApp(){
		//安卓APP UA中增加了自定义的 字符串 用此来判断用户使用的是安卓APP访问
		if(navigator.userAgent.indexOf('JQuery_ANDROID_APP') != -1){
			return 'Android';
		}else if(localStorage.app_version == 'IPAD' || navigator.userAgent.indexOf('JQuery_IOS_APP') != -1){
			//IOS由于修改UA无效 所以 在localStorage中增加了数据 用于判断
			return 'IOS';
		}else{
			return 'Browser';
		}
	}
	
	function findCordovaPath() {
	    var path = null;
	    var scripts = document.getElementsByTagName('script');
	    var term = '/cordova.js';
	    for (var n = scripts.length-1; n>-1; n--) {
	        var src = scripts[n].src.replace(/\?.*$/, ''); // Strip any query param (CB-6007).
	        if (src.indexOf(term) == (src.length - term.length)) {
	            path = src.substring(0, src.length - term.length) + '/';
	            break;
	        }
	    }
	    return path;
	}
})();
//# sourceMappingURL=cordova.js.map
