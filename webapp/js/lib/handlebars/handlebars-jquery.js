/**
 * 集成模板数据插件
 */
(function($){
	var compiled = {};
	/**
	 * 直接使用模板替换当前元素的html内容
     * 操作后会将元素中原模板内容清除 同时将模板保存到 data('template') 数据保存在 data('tplData')
	 * @type {Function}
	 */
	$.fn.template = $.fn.tpl = function(data){
        var me = $(this);
        //获取模板
        var template = me.data('template');
        if(me.data('template')){
            template = me.data('template');
        }else if ($(this).hasClass('template')){
            template = me.html();
            me.html('');
            me.removeClass('template');
        }else{
            template = me.find('.template').first().html();
        }
		//保存模板
        $(this).data('template',template);

		if(!compiled[template]) compiled[template] = Handlebars.compile(template);
		$(this).html(compiled[template](data)).data('tplData',data);
	};
	$.fn.template1 = function(data){
		var template = $.trim($(this).first().html());
		if(compiled[template] == undefined){
			compiled[template] = Handlebars.compile(template);
		}
		return $(compiled[template](data));
	};
	$.fn.toHtml = function(data){
		var template = $.trim($(this).first().html());
		if(!compiled[template]) compiled[template] = Handlebars.compile(template);
		return $(compiled[template](data));
	}

    $.extend({
        toHtml:function(template,data){
            compiled[template] = Handlebars.compile(template);
            return $(compiled[template](data));
        }
    });

    //demo
	//如果文本长度过长，以省略号显示,截取长度参数为trunLen
	Handlebars.registerHelper('formatTextLength', function(text,trunLen){
		var omitStr = "……";
		if(text!=undefined){
			var newText = $.trim(text);
			if(newText.length>trunLen){
				return newText.substr(0,trunLen)+omitStr;
			}
		}
		return text;
	});

})(jQuery);

//# sourceMappingURL=handlebars-jquery.js.map
