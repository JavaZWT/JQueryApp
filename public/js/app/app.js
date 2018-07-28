/**
 * 提供一些通用方法
 * @type {{}|*}
 */
jQuery(function(){
    window.app = window.app || window.api || {};

    //复制全局设置至app变量
    if(window.GloConfig){
        for(var key in GloConfig){
            app[key] = GloConfig[key];
        }
    }

    /**
     * 服务器地址 永远指向当前服务器的地址
     */
    app.SERVERPATH = (function(){
        //if(app.env != 'UI'){
            //return location.href.indexOf('http') == 0 ? app.LOCALPATH : GloConfig.serverPath;
        //}else{
    	if(api.isApp()||'DEV'==app.env){
    		return app.serverPath;
    	}else{
    		return "";
    	}
        //}
    })();

    /**
     * 根据分辨率判断当前的设备是否是手机
     * 在cordova加载后该方法会被重写
     * @returns {boolean}
     */
    app.isPhone = function(){
        return document.documentElement.clientWidth < 700;
    };

    /**
     * 获取html页面连接中的传参
     * @returns {{}} 返回对象
     */
    app.getParams = function(){
        var data = {};
        var str = location.search;
        if(str){
            str = str.slice(1);
            dataArr = str.split('&');
            for(var i=0;i<dataArr.length;i++){
                var _dataArr = dataArr[i].split('=');
                data[_dataArr[0]] = _dataArr[1];
            }
        }
        return data;
    };

    /**
     * 弹出提示
     * @param 对象或者字符串 如果为字符串则作为content其他使用默认值 options {
     * title: 标题 默认 提示
     * type:1为alert 2为 confirm 默认为1
     * content: 显示内容
     * cancleBtnText:取消按钮文字 默认 取消
     * confirmBtnText:确定按钮文字 默认 确定
     * cancleAction:点击取消执行的回调函数
     * confirmAction:点击确定执行的回调函数
     * }
     *
     * @return 弹窗对象{
     * show:显示弹窗
     * hide:隐藏
     * destory:销毁
     * source:当前弹窗的jquery对象
     * options:创建弹窗的参数
     * }
     */
    app.popupTipsList = {};
    app.popupTips = function(options){
        options._id = options.id;
        var _popupWin = null;
        //如果存在相同id的 则不再进行创建直接返回现有弹窗
        if(options._id && app.popupTipsList[options._id]){
            _popupWin =  app.popupTipsList[options._id];
        }else{
            options.id = 'global-alert-' + (new Date()).getTime() + parseInt(Math.random() * 100);
            options.cancleBtnId = options.id + '-cancel';
            options.confirmBtnId = options.id + '-confirm';
            options = $.extend({
                title:'提示',
                cancleBtnText:'取消',
                confirmBtnText:'确定',
                type:1,
            },options);

            if(options.type == 1){
                options.cancleHide = true;
            }

            var $popupWin = $('#global-alert').toHtml(options);
            $('#global-popups').append($popupWin);
            $popupWin = $('#'+options.id);

            _popupWin = {
                _destory:0,
                show:function(){
                    if(this._destory) return null;
                    app.globalShadow.show(options.id);
                    $popupWin.show();
                    return this;
                },
                hide:function(){
                    if(this._destory) return null;
                    app.globalShadow.hide(options.id);
                    $popupWin.hide();
                    return this;
                },
                destory:function(){
                    if(!this._destory){
                        if(options._id) app.popupTipsList[options._id] = null;
                        app.globalShadow.hide(options.id);
                        $popupWin.remove();
                        this._destory = 1;
                    }
                    return null;
                },
                source:$popupWin,
                options:options
            }

            if(options._id) app.popupTipsList[options._id] = _popupWin;

            $('#'+options.cancleBtnId).on('click',function(){
                if(options.cancleAction) options.cancleAction.apply(_popupWin);
            });
            $('#'+options.confirmBtnId).on('click',function(){
                if(options.confirmAction) options.confirmAction.apply(_popupWin);
            });
        }

        return _popupWin;
    }

    /**
     * alert提示框 同样内容的提示框只会同时存在一个
     * @param content 提示内容 会自动替换其中的\n换行符为<br />
     * @param callback 回调函数
     * @returns {*}
     */
    app.alert = function(content,callback){
        var _pop = this.popupTips({
            id:(content!=undefined&&content!=null)?(content.replace(/\n/g,'<br />')):"",
            content:content.replace(/\n/g,'<br />'),
            confirmAction:function(){
                if(callback) callback();
                this.destory();
            }
        }).show();

        return _pop;
    }

    /**
     * confirm提示框
     * @param content 提示的内容
     * @param callback 回调函数 回调函数接收参数 0点击的是取消 1点击的是确定
     * @returns {*}
     */
    app.confirm = function(content,callback){
        var _pop = this.popupTips({
            content:content.replace(/\n/g,'<br />'),
            type:2,
            cancleAction:function(){
                if(callback) callback(0);
                this.destory();
            },
            confirmAction:function(){
                if(callback) callback(1);
                this.destory();
            },
        }).show();
        return _pop;
    }

    /**
     * 根据当前环境跳转至不同的页面
     */
    app.devicePath = null;//APP中目录路径 在cordova加载完成后会进行赋值
    app.toRealURL = function(isLocal,url){
        //如果在APP 中运行 并且isLocal为1 则跳转至cordova本地路径
        if(this.client != 'Browser' && isLocal == 1){
            if(this.devicePath) window.open(this.devicePath + url);
        }else{
            location =  this.SERVERPATH + url;
        };
    };

    var ajaxConfig = {

    }

    //APP版本 需要加载其他的功能
    if(app.isApp()){
        //用户头像保存路径
        app.userPicUrl = 'cdvfile://localhost/temporary/userPic/userPhoto.jpg';
        /**
         * 特殊判断 如果设备型号存在于padList中 则认为是PAD 其他情况仍按照原逻辑处理
         * @returns {boolean|*}
         */
        var padList = ['N5100'];
        app._isPhone = app.isPhone;
        app.isPhone = function(){
            return padList.indexOf(device.model) == -1 && app._isPhone();
        }
        //为APP目录赋值
        app.devicePath = cordova.file.dataDirectory;

        document.addEventListener('backbutton',function(){
            if(app.curr.back) app.curr.back();
            else history.back();
        },false);

        app.deviceID = G.deviceID = device.uuid;
    }

    /**
     * 在ajax请求发送前 进行一些处理
     * @param jqXHR
     * @param setting
     */
    ajaxConfig.beforeSend = function(jqXHR){
        //如果超过一定时间没有返回 停止请求 同时记录setTime的值
        if(app.env != 'DEV') jqXHR.appTimeOutID = setTimeout(jqXHR.abort,10*60*1000);
        if(app.appBeforeSend) app.appBeforeSend(jqXHR);
    }

    //设置ajax
    $.ajaxSetup(ajaxConfig);

    //为a标签添加默认事件
    $('body').on('click','a.no-href',function(e){
        e.preventDefault();
    });
    // 设置jquery ajax完成后的默认操作
    $(document).ajaxComplete(function(event, xhr) {
        //请求完成后清除 延迟执行
        if(xhr.appTimeOutID){
            clearTimeout(xhr.appTimeOutID);
        }
    });

    /**
     * 通用的 ajax 请求方法 实际为调用 jQuery的ajax 方法
     * @param options 参数参照jQuery ajax 方法 增加一个属性 onlyJSON 默认为true 直接发送json字符串
     * @returns {*}
     */
    app.ajax = function(options){
        var globalLoadingID = 'ajax-'+ Date.now() + Math.floor(Math.random() * 1000);
        app.globalLoading.show(globalLoadingID);
        //默认的ajax设置
        var ajaxConfig = {
            type:'POST',
            dataType:'json',
            onlyJSON: false,
            xhrFields: {
                withCredentials: true
            },
            app_completeUrl:true,//自动拼接URL
            headers : {
                'app-client' : app.client,
                'app-device' : app.device,
            }
        }
        //继承默认设置
        options = $.extend(ajaxConfig,options);
        //如果是只发送json 则更改设置
        if(options.onlyJSON){
            options.processData = false;
            options.contentType = 'application/json;charset=UTF-8';
        }

        //重新设置 回调函数
        var _error = options.error;
        var _success = options.success;
        options.success = success;
        options.error = error;

        //如果自动完成URL 没有设置为false 则进行拼接
        if(options.app_completeUrl) options.url = app.SERVERPATH + options.url;
        //如果为json数据 且 data为对象 则进行转换
        if(options.contentType == 'application/json;charset=UTF-8' && (typeof options.data == 'object') ) options.data = JSON.stringify(options.data);

        //增加签名
        var now = new Date().getTime();
        options.headers['app-time'] = now;
        G.deviceID = G.deviceID || app.utils.getRandomValue();
        options.headers['app-deviceID'] = G.deviceID;
        options.headers['app-sign'] = CryptoJS.HmacSHA1(app.deviceID + now,app.apiSecretKey).toString(CryptoJS.enc.HEX);


        function success(data) {
            app.globalLoading.hide(globalLoadingID);
            if(!data || data.flag == 0){
                app.alert( (data && data.error) || '服务器发生错误');
                if(_success) _success(data);
            }else if(_success){
                _success(data);
            }
        }

        function error(xhr,state,error){
            app.globalLoading.hide(globalLoadingID);
            app.globalLoading.hide();
            if(xhr.getResponseHeader("app-timeout") == 'true'){
                app.alert('登录已过期,请重新登录',function(){
                    location.hash = '';
                });
            }else if(_error){
                _error(xhr,state,error);
                console.warn('[APP]连接服务器失败\n状态:',event,'\nxhr对象:',xhr,'\n发送使用的设置:',options);
            }else{
                app.alert('连接服务器失败');
                console.warn('[APP]连接服务器失败\n状态:',event,'\nxhr对象:',xhr,'\n发送使用的设置:',options);
            }
        }

        return $.ajax(options);
    }
})
