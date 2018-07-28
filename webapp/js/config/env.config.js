(function(){
    //不同环境请修改env字符串
    var env = 'DEV';
    var config = {
        //生产环境配置
        PRODUCT:{
            env:'PRODUCT',
            serverPath:'',
        },
        //UAT环境配置
        UAT:{
            env:'UAT',
            serverPath:'',
        },
        //公司测试环境
        COM:{
            env:'COM',
            serverPath:'',
        },

        //本机环境
        DEV:{
            env:'DEV',
            serverPath:'http://127.0.0.1:8080/',
            // packageType : "s", // s：源代码 或 p：压缩打包（默认）
            packageType : "p",
            wechatPlatform : "",
        },
        UI:{
            env:'UI',
            serverPath:'',
        }
    };

    window.GloConfig = window.GloConfig || config[env];
    
    GloConfig.packageType = GloConfig.packageType == "s" ?  GloConfig.packageType :  "p";
    
    GloConfig.basePath = '';
})();
//# sourceMappingURL=env.config.js.map
