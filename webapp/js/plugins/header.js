/**
 *
 * 用来控制标题栏的变化
 */
$(function(){
   window.app = window.app || {};
   app.plugins = app.plugins || {};

   $('#global-header-home').click(function(){
      if(app.curr.save){
         if(app.curr.save.length == 0){
            app.curr.save();
            location.hash = 'home';
         }else{
            app.curr.save(function(){
               location.hash = 'home';
            });
         }
      }else{
         location.hash = 'home';
      }
   });

   /**
    * 控制标题栏的变化
    * @param data
    * @param path
    */
   app.plugins.header = function(data,path){
      //获取当前的模块名称
      var module = path.split('-')[0];

      //默认数据
      var geDefault = app.route.default;
      //模块默认数据
      var moduleDefault = app.route[module + '-default'] || {};
      //继承默认设置
      data = $.extend({},$.extend({},geDefault,moduleDefault),data);

      //设置头部的显示隐藏
      if(data.hideHeader){
         $('#mainviewport').addClass('header-hide');
      }else{
         $('#mainviewport').removeClass('header-hide');
      }

      //设置头部的标题
      $('#global-header-title').text(data.title || '');

   }
});
//# sourceMappingURL=header.js.map
