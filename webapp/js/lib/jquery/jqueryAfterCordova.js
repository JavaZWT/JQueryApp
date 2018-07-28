/**
 * 在APP中延迟jQuery ready事件的执行 直至Cordova加载完成
 */

(function (){
    $.holdReady(true);//阻止jquery的ready事件
    //如果是APP 版本则要等到 cordova加载完成后才能执行ready事件
    if(navigator.userAgent.match('JQuery_([\\w])+_APP/([\\d.]+)')){
        document.addEventListener('deviceready',function(){
            console.log('cordova加载完成');
            $.holdReady(false);
        });
    }else{
        $.holdReady(false);
    }
})();
//# sourceMappingURL=jqueryAfterCordova.js.map
