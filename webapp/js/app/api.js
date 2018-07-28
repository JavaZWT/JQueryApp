var api = {
    contentID :'global-content',
    modalContentID: 'global-popups',
    requestData:{},//用来保存之前旧版本通过地址栏直接发送的数据
    basePath: GloConfig.basePath,
    apiSecretKey:'1234567890abcdefghijklmnopqrstuvwxyz',
    removeEventNS:'.curr_event',
    curr:{},//用于存储当前页面的数据
    route:{
        //默认的设置
        'default':{
            path : 'login',//如果lacation.hash为空 默认加载的页面
        },
        'login':{
            title:'首页',
            menuID:'global_menu_login',
            html:'html/module/login/login.html',
            js:['js/module/login/login.js']
        }
    },
    //全局的弹出框 只负责加载相关页面以及 js
    //通过 app.modal.exec(id,fn)来调用 如果页面中不存在 则会进行加载 @see app.modal.exec
    //show方法 执行顺序为 加载hmtl 加载js 执行fun 如果fun函数不存在 则加载后执行$('#id').show()
    modal:{
        
    }

};

$(function(){
    //当前文件的路径
    var _filePath = api.basePath;
	if(GloConfig.packageType == "s"){
		_filePath += 'js/index.js';
	} else {
		_filePath += 'js/index.min.js';
	}

    api.findCurrPath = function(){
        var path = null;
        var scripts = document.getElementsByTagName('script');
        for (var n = scripts.length-1; n>-1; n--) {
            var src = scripts[n].src.replace(/\?.*$/, ''); // 去掉查询字段
            console.log("path:::::", src);
            if (src.indexOf(_filePath) == (src.length - _filePath.length)) {
                path = src.substring(0, src.length - _filePath.length);
                break;
            }
        }

        if(path && path.lastIndexOf('/') != path.length-1) path += '/';
        
        console.log("path:::::", path);
        
        return path;
    };

    /**
     * 当前访问的地址
     */
    api.LOCALPATH = (function(){
        return api.findCurrPath();
    })();

    console.log(api.LOCALPATH);

    /**
     * 获取当前操作系统版本
     */
    api.OS = {
        Android:'Android',
        BlackBerry:'BlackBerry',
        iOS:'iOS',
        Windows : 'Windows',
        MacOS :'MacOS',
        WindowsMobile:'WindowsMobile',
        Other: 'Other',
        _Android : function() {
            return navigator.userAgent.match(/Android/i) ? true : false;
        },
        _BlackBerry : function() {
            return navigator.userAgent.match(/BlackBerry/i) ? true : false;
        },
        _iOS : function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
        },
        _Windows : function(){
            return navigator.userAgent.match(/Windows NT/i) ? true : false;
        },
        _MacOS : function(){
            return navigator.userAgent.match(/Macintosh/i) ? true : false;
        },
        _WindowsMobile : function() {
            return navigator.userAgent.match(/IEMobile/i) ? true : false;
        },
        is:function(name){
            if(name){
                return this['_'+name]();
            }else{
                return (this._Android() && this.Android) || (this._BlackBerry() && this.BlackBerry) || (this._iOS() && this.iOS) || (this._WindowsMobile() && this.WindowsMobile) || (this._Windows() && this.Windows) || (this._MacOS() && this.MacOS) || this.Other;
            }
        }
    }
    //当前运行环境为 APP 或 浏览器
    api._deviceVersion = (function(){
        //安卓APP 和 IOS APP中增加了自定义UA 用于识别当前的版本
        //其中安卓UA为 JQuery_ANDROID_APP/1.0 1.0为版本号
        //IOS UA为 JQuery_IOS_APP/1.0
        var reData = {};
        var match = navigator.userAgent.match('JQuery_([\\w]+)_APP/([\\d.]+)');
        if(match){
            reData.device = match[1] == 'IOS' ? api.OS.iOS : api.OS.Android;
            reData.version = match[2];
        }else{
            reData.device = 'Browser';
            reData.version = '0'
        }

        return reData;
    })();

    //当前操作系统
    api.device = api.OS.is();
    api.client = 'Browser';
    //如果是封壳的APP 则 修改值
    if(api._deviceVersion.device == api.OS.iOS || api._deviceVersion.device ==  api.OS.Android){
        api.device = api._deviceVersion.device;
        api.client = 'WebApp';
        api.WebAppVersion = api._deviceVersion.version
    }

    /**
     * 判断当前环境是否是APP
     */
    api.isApp = function(){
        return app.client != 'Browser';
    }

    /**
     * 判断当前是否为Android APP
     */
    api.isAndroidApp = function(){
        return api.client == 'WebApp' && api.device == api.OS.Android;
    }

    /**
     * 判断当前是否为iOS APP
     * @returns {boolean}
     */
    api.isIOSApp = function(){
        return api.client == 'WebApp' && api.device == api.OS.iOS;
    }

    //控制全局loading
    //show hide 方法可接受一个id值 默认值为 global 列表中所有id的loading全部被隐藏后 loading才会隐藏
    api.globalLoading = {
        _times: 0,
        _list:{},
        _hide:function(){
            this._list = {};
            $('#global-loading-shadow').hide();
        },
        hide:function(id){
            console.trace('隐藏全局Loading'+ (id ? (',id:' + id) : '') );
            id = id || 'global';
            if(this._list[id]){
                this._times = Math.max(this._times - 1,0);
                this._list[id] = null;
            }

            if(this._times === 0){
                $('#global-loading-shadow').hide();
            }
        },
        show:function(id){
            console.trace('显示全局Loading'+ (id ? (',id:' + id) : '' ) );
            id = id || 'global';
            if(!this._list[id]){
                this._times = Math.max(this._times,0) + 1;
                this._list[id] = true;
            }
            $('#global-loading-shadow').show();
        }
    }

    //控制全局shadow
    api.globalShadow = {
        _times: 0,
        _list:{},
        _hide:function(){
            this._list = {};
            $('#global-shadow').css('z-index','2000').hide();
        },
        hide:function(id){
            if(this._list[id]){
                this._times = Math.max(this._times - 1,0);
                this._list[id] = null;
            }

            var _arr = [];
            for(var key in this._list){
                _arr.push(this._list[key]);
            }
            $('#global-shadow').css('z-index',Math.max.apply(null,_arr))

            if(this._times === 0){
                $('#global-shadow').css('z-index','2000').hide();
            }
        },
        show:function(id){
            if(!this._list[id]){
                this._times = Math.max(this._times,0) + 1;
                this._list[id] = ($('#'+id).css('z-index') || 2000);

                if($('#'+id).length > 0){
                    $('#global-shadow').css('z-index',this._list[id] - 1);
                }
            }
            $('#global-shadow').show();
        }
    }

    /**
     * 执行相应id的 弹框的函数
     * @param id 上面配置的 modal的id
     * @param fn 字符串 调用modal中相应地方法(modal[fn]) 如果有第三个参数作为modal.fn的参数传入 多个参数请使用数组
     *           数组   依次调用modal中的相应方法或者数组元素本身即为函数 并将后续参数依次作为参数传入
     *           函数   直接执行 第三个参数作为该函数的参数
     *           空值   执行modal.show函数 如果不存在 执行 $('#id').show()
     * @params 从第三个参数开始 每个参数 依次作为第二个参数中的函数的参数
     * 例:
     * id为 test modal中函数定义为
     * modal.init = function(index,cleanFun){};
     * modal.test = function(a,b,c);
     * 则调用时使用
     * app.modal.exec('test',['init','test'],[index,cleanFun],[a,b,c])
     */
    api.modal.exec = function(id,fn/*data*/){
        //取得参数列表
        var _args = Array.prototype.slice.call(arguments,2);

        api.loadModal(id,function(loadData){
            if(loadData.flag && api.modal[id]){
                if(fn){//如果fn 参数存在 则执行
                    if(!$.isArray(fn)) fn = [fn];
                    //依次执行函数
                    for(var i=0;i<fn.length;i++){
                        var _fn = fn[i];
                        if(typeof _fn == 'string' && typeof api.modal[id][_fn] == 'function'){
                            api.modal[id][_fn].apply(api.modal[id],args(i));
                        }else if(typeof _fn == 'function'){
                            fn.apply(api.modal[id],args(i));
                        }
                    }
                }else if(api.modal[id].show){//fn不存在 show存在 则执行
                    api.modal[id].show();
                }else{//以上均不存在 则直接显示
                    $('#'+id).show();
                }
            }
        });

        function args(index){
            if(index > _args.length - 1){
                return null;
            }else{
                var arg = _args[index];
                if(!$.isArray(arg)) arg = [arg];
                return arg;
            };
        }
    };

    /**
     * 控制页面底部的显示隐藏
     * @type {{hide: Function, show: Function}}
     */
    api.footer = {
        hide:function(){
            $('#mainviewport').addClass('footer-hide');
        },
        show:function(){
            $('#mainviewport').removeClass('footer-hide');
        }
    };

    /**
     * 控制页面头的显示隐藏
     * @type {{hide: Function, show: Function}}
     */
    api.header = {
        hide:function(){
            $('#mainviewport').addClass('header-hide');
        },
        show:function(){
            $('#mainviewport').removeClass('header-hide');
        }
    };

    /**
     * 用于引入js文件
     * @param src js文件路径 可以为字符串或数组
     * @param loadType 0逐个加载 1 同时加载 默认为0
     * @param 加载完成的回调函数 可以为空
     */
    api.loadJS = function(src,loadType,callback){
        //将src放在数组中 便于统一处理
        if(!$.isArray(src)) src = [src];
        var needSrcs = [];
        var haveSrcs = [];

        //取得当前页面中的所有js标签
        var scripts = document.getElementsByTagName('script');

        for(var i=0;i<scripts.length;i++){
            haveSrcs.push(scripts[i].src);
        }

        for(var i=0;i<src.length;i++){
            if(haveSrcs.indexOf(src[i]) == -1) needSrcs.push(src[i]);
        }

        if(needSrcs.length > 0){
            if(loadType){
                parallelLoad();
            }else{
                serialLoad(0);
            }
        }

        var _data = {
            flag:1//,加载是否成功标记
        };

        /**
         * 串行加载
         * @param i
         */
        function serialLoad(i){
            var scriptE = document.createElement('script');
            scriptE.setAttribute('type','text/javascript');
            scriptE.onload = ready;
            scriptE.onerror = ready;
            scriptE.setAttribute('src',needSrcs[i]);
            document.head.appendChild(scriptE);

            function ready(e){
                if(e.type == 'error'){
                    console.error('[APP] 加载js出错,',e);
                    _data.flag = 0;
                }
                //如果不是最后一个 则继续加载
                if(i != needSrcs.length-1) {
                    serialLoad(i+1);
                }else{
                    if(callback){
                        callback(_data);
                    }
                }
            }
        }

        /**
         * 并行加载
         */
        function parallelLoad(){
            var loaded = 0;
            //加载所有js
            for(var i=0;i<needSrcs.length;i++){
                var scriptE = document.createElement('script');
                scriptE.setAttribute('type','text/javascript');
                scriptE.setAttribute('src',api.LOCALPATH+needSrcs[i]);
                scriptE.onload = ready;
                scriptE.onerror = ready;
                document.head.appendChild(scriptE);
            }

            function ready(e){
                if(e.type == 'error'){
                    _data.flag = 0;
                    console.error('[APP] 加载js出错',e);
                }
                loaded++;
                if(loaded == needSrcs.length){
                    if(callback) callback(_data);
                }
            }
        }
    };

    /**
     * 为元素添加事件或事件委托 会在页面切换时移除添加的事件 接受参数同jquery.on方法
     */
    api._removeEEList = [];//需要移除的事件的元素列表
    $.fn.app_on = function(){
        api._removeEEList.push($(this));
        if(arguments.length > 0){
            arguments[0] = arguments[0].replace(/\w+/g,'$&'+api.removeEventNS);
        }
        $(this).on.apply($(this),arguments);

    };

    /**
     * 加载全局modal弹出框
     * @param modalId
     * @param callback
     */
    api.loadModal = function(modalId,callback){
        var modalData = api.modal[modalId];
        if(!modalData){
            console.error('[APP] [加载modal错误] 没有查找到id为:'+modalId+'的相关配置');
            callback({html:0,js:0,flag:0,modal:modalData});
        }else{
            //已经加载过的modal不再进行加载
            if(modalData.ready){
                callback({html:1,js:1,flag:1,modal:modalData});
            }else{
                console.log('[APP] 开始加载modal:'+modalId);
                $.ajax({
                    url:api.LOCALPATH + api.basePath + modalData.html,
                    dataType:'html',
                    success:function(data){
                        $('#'+api.modalContentID).append(data);
                        if(modalData.js) api.loadJS(api.LOCALPATH + api.basePath + modalData.js,0,function(data){
                            var _data = {
                                html:1,
                                js:data.flag,
                                flag: data.flag,
                                modal:modalData
                            };
                            modalData.ready = true;
                            callback(_data);
                        });
                    },
                    error:function(){
                        console.error('[加载modal错误] 加载路径为:' + modalData.html + '的文件失败');
                        callback({html:0,js:0,flag:0,modal:modalData});
                    }
                });
            }
        }
    }

    /**
     * 加载指定路径的内容
     * @param path
     * @param callback
     */
    api.loadPath = function(path,callback){
        var route = api.route;

        //加载HTML
        $('#'+api.contentID).load(api.LOCALPATH + api.basePath + route[path].html,function(){
            //移除上一个页面加载的js
            if(api.curr && api.curr.js){
                api.curr.js.map(function(value){
                    $('script[src="'+api.LOCALPATH + api.basePath + value+'"]').remove();
                });
            }

            // 如果有需要移除的事件 则依次移
            if(api._removeEEList.length > 0){
                api._removeEEList.map(function(value){
                    value.off(api.removeEventNS);
                });
            }

            api.curr = route[path];

            if(api.curr.title) $('#header-title').text(api.curr.title);

            if(api.curr.hideHeadTitle){
                $('#header-title').text('');
            }else{
                $('#header-title').text(api.curr.title || '');
            }

            var jsArr = [];
            //如果存在js则遍历增加
            if(api.curr.js){
                api.curr.js.map(function(value){
                    jsArr.push(api.LOCALPATH + api.basePath +  value);
                });
            }else{
                if(callback) callback(api.curr);
            }

            //加载完成后将页面移动到顶端
            $('#'+api.contentID).scrollTop(0);

            api.loadJS(jsArr,0,function(){
                if(callback) callback(api.curr);
            });
        });
    };

    /**
     * 路径发生变化时触发加载页面的操作
     * 如果给出的路径 并没有进行配置 则不进行加载
     * 在加载页面之前会首先执行当前页面定义的 app.curr.clean 方法,以便当前页面在离开以前执行一些操作
     *
     */
    function loadViewport(){
    	var path;
    	if(location.hash.indexOf("?")>-1){
    		path = location.hash.substr(0,location.hash.indexOf("?"));
    	}else{
    		path = location.hash;
    	}
    	path = (path || '#' + api.route.default.path).slice(1);

        //如果没有配置路径则不做操作
        if(!api.route[path]){
            api.globalLoading.hide();
            console.log('[APP] 没有查询到路径:'+ path + ',不进行加载');
        }else if(api.curr.clean){
            switch(api.curr.clean.length){
                case 0://如果不包含参数 则认为这是一个同步 直接执行完成后 加载页面
                    api.curr.clean();
                    load();
                    break;
                case 1://如果只接收一个参数,则传入回调函数 等待页面完成后自行处理
                    api.curr.clean(load);
                    break;
                case 2://如果接收两个参数 则分别是 要跳转页面的hash,回调函数
                    api.curr.clean(path,load);
                    break;
                default://如果接收大于2个参数 则只传入三个 分别是 要跳转页面的hash,要跳转页面的配置在route中的数据,回调函数
                    api.curr.clean(path,api.route[path],load);
            }
        }else{
            load();
        }

        function load(){
            api.globalLoading.show();
            console.log('[APP] 开始加载页面['+path+']');
            api.loadPath(path,function(data){
                console.log('[APP] 加载页面<p>['+path+']</p>完成');

                api.plugins.header(data,path);

                //如果页面没有设置 则默认隐藏全局loading
                if(!data || !data.selfHideLoading) api.globalLoading.hide();
            });
        }
    }

    api.loadViewport = loadViewport;

    /**
     * 当浏览器的hash发生变化时进行页面的加载
     */
    window.onhashchange = loadViewport;

});

//# sourceMappingURL=api.js.map
