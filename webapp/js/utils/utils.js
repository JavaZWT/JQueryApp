/**
 * Created by LHY on 16/7/25.
 */

$(function(){
    var app = window.app = window.app || {};
    var utils = app.utils = app.utils || {};
    /**
     * 为起止时间输入框设置最大值 最小值 请在设置完输入框初始值后调用该方法 如果输入框初始值为空 则默认为当前日期
     *
     * @param startID
     *            开始时间控件ID
     * @param endID
     *            结束时间控件ID
     * @param maxRange
     *            最大日期范围 默认无控制
     * @param maxRangeUnit
     *            最大日期范围的单位 Y:年 M:月 D:日 其他值默认为D 只有maxRange不为空时 该参数才有意义
     */
    utils.initMin_MaxDate = function(startID, endID, maxRange, maxRangeUnit) {
        var startInput = $('#' + startID);
        var endInput = $('#' + endID);
        var methodObj = {
            Y : {
                set : 'setFullYear',
                get : 'getFullYear'
            },
            M : {
                set : 'setMonth',
                get : 'getMonth'
            },
            D : {
                set : 'setDate',
                get : 'getDate'
            }
        };

        //为开始时间输入框添加事件 设置最大 最小值
        startInput.blur(setMinMax);
        endInput.blur(setMinMax);

        // 如果输入框不存在初始值 则设置初始值为当前日期
        if (!startInput.val())
            startInput.val(ACLIFE.formatDate());
        if (!endInput.val())
            endInput.val(ACLIFE.formatDate());
        // 初始化输入框的最大最小值
        setMinMax();

        function setMinMax(e) {
            //endInput.attr('min', startInput.val());
            endInput.data('min', startInput.val());
            //startInput.attr('max', endInput.val());
            startInput.data('max', endInput.val());

            // 如果包含输入区间 则进行更多控制
            if (maxRange) {
                var startDate = ACLIFE.strToDate(startInput.val());
                var endDate = ACLIFE.strToDate(endInput.val());
                if (!methodObj[maxRangeUnit]) maxRangeUnit = 'D';

                var _set = methodObj[maxRangeUnit].set;
                var _get = methodObj[maxRangeUnit].get;

                var maxEndDate = new Date(startDate.getTime());
                maxEndDate[_set](maxEndDate[_get]() + maxRange);
                endInput.data('max', ACLIFE.formatDate(maxEndDate));
                var minStartDate = new Date(endDate.getTime());
                minStartDate[_set](minStartDate[_get]() - maxRange);
                startInput.data('min', ACLIFE.formatDate(minStartDate));
            }

            if(e){
                if($(this).attr('id') == startInput.attr('id')){
                    // 判断输入的值是否符合要求
                    check(endInput, 'min');
                    check(endInput, 'max');
                }else{
                    check(startInput, 'min');
                    check(startInput, 'max');
                }
            }else{
                check(endInput, 'min');
                check(endInput, 'max');
                check(startInput, 'min');
                check(startInput, 'max');
            }
        }

        // 对输入的值进行校验 查看是否在区间中
        function check(input, type) {
            if (type == 'min') {
                if (!input.val() || (input.data('min') && ACLIFE.strToDate(input.val()) < ACLIFE.strToDate(input.data('min'))) ) {
                    input.val(input.data('min'));
                }
            } else {
                if (!input.val() || input.data('max') && ACLIFE.strToDate(input.val()) > ACLIFE.strToDate(input.data('max'))) {
                    input.val(input.data('max'));
                }
            }
        }
    };

    /**
     * 限制输入框输入的内容长度
     */
    utils.inputMaxLength = function(field, length) {
        if (!length)
            return;
        field.keyup(function() {
            // 过滤输入框长度
            if (length && field.val().length > length) {
                field.val(field.val().slice(0, length));
            }
        });
    };

    /**
     * 发送邮件 调用系统内置邮件客户端发送邮件
     * @param receiver 收件人
     * @param subject 主题
     * @param content 邮件内容
     */
    utils.sendMail = function(receiver,subject,content){
        window.open('mailto:'+(receiver || '')+'?subject='+subject+'&body='+content,'_system');
    };

    /**
     * 限制输入框只能输入数字
     */
    app.onlyNumber = function(field, length) {
        field.keyup(function(event) {
            // 过滤长度
            if (length && field.val().length > length) {
                field.val(field.val().slice(0, length));
            }
            // 过滤非数字
            field.val(field.val().replace(/[^0-9]/g, ''));
        });
    };

    /**
     * 将数字字符串添加千粉符
     */
    utils.splitNumber = function(str){
        str = str ||'';

        var result = '';
        var lastIndex = str.lastIndexOf('.');
        if(lastIndex != -1){
            result = str.slice(lastIndex);
            str = str.slice(0,lastIndex);
        }

        while(str.length > 3){
            result = ','+str.slice(-3)+result;
            str = str.slice(0,-3);
        }
        return str + result;
    };

    /**
     * 将数字转换为中文
     * @param n
     * @returns {string}
     */
    utils.toChineseNum = function(n){
        var chineseNum = '';
        var shu = ['零','一','二','三','四','五','六','七','八','九'];
        var danwei = ['','十','百','千','万','十','百','千','亿'];
        var lastNotZeroFlag = false;//上一个数不是零为 true
        var ys = 0;
        for(var i=0;n>0;i++){
            ys = n%10;
            n = parseInt(n/10);
            if(ys == 0){
                if(lastNotZeroFlag){
                    chineseNum = shu[ys] + chineseNum;
                    lastNotZeroFlag = false;
                }
            }else{
                chineseNum = shu[ys] + danwei[i] + chineseNum;
                lastNotZeroFlag = true;
            }
        }

        if(chineseNum.indexOf('一十') == 0){
            chineseNum = chineseNum.substring(1,chineseNum.length);
        }

        return chineseNum;
    }

    /**
     * 对日期进行加减操作 该方法不会修改传入的Date对象
     * @param date 如果为null 则表示为当前日期
     * @param unit 单位 y:年 M:月 d:日 h:小时 m:分钟 s:秒
     * @param value 增加的数值 可以为负数
     * @return 返回值为修改后的新的Date对象
     */
    utils.addDate = function(date,unit,value){
        date = date ? date instanceof Date ? new Date(date.getTime()) : new Date(date) : new Date();
        var units = {
            y:'FullYear',
            M:'Month',
            d:'Date',
            h:'Hours',
            m:'Minutes',
            s:'Seconds'
        }

        try{
            if(units[unit]){
                date['set'+units[unit]](date['get'+units[unit]]() + parseInt(value));
            }
        }catch (e){
            console.error(e);
        }

        return date;
    }

    /**
     * 获取当前日期字符串
     */
    utils.getCurrDate = function(){
        return this.getDateStr();
    }

    utils.getDateStr = function(date){
        date = date ? date instanceof Date ? new Date(date.getTime()) : new Date(date) : new Date();
        var year = date.getFullYear();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        day = day < 10 ? '0'+day : day;
        month = month < 10 ? '0' + month : month;

        return year + '-' + month + '-' + day;
    }


    /**
     * 获取本周的所有日期
     * @param date
     */
    utils.getWeekDates = function(date){
        date = date ? date instanceof Date ? new Date(date.getTime()) : new Date(date) : new Date();
        var day = date.getDay();
        var week = [];
        for(var i=1;i<=5;i++){
            week.push(this.addDate(date,'d',i - day));
        }
        return week;
    }

    /**
     * 判断是否为假日 目前为周六或周日
     * @param date(可选) 毫秒数或Date 不传或传null为当前日期
     */
    utils.isHoliday = function(date){
        date = date ? date instanceof Date ? new Date(date.getTime()) : new Date(date) : new Date();
        var day = date.getDay();
        return day === 6 || day === 7;
    }

    /**
     * 获取随机字符串如果浏览器支持crypto.getRandomValues 则调用该方法 如果不支持则使用其他方法计算
     * @returns {*}
     */
    utils.getRandomValue = function(){
        if(window.Unint32Array && window.crypto && window.crypto.getRandomValue){
            return crypto.getRandomValues(new Uint32Array(1))[0];
        }else{
            return Math.ceil (( (new Date().getTime() * 9301 + 49297) % 233280)/233280.0 * 10000);
        }
    }
    /**
     * 角度转换为弧度
     * @param angle
     */
    utils.angleToRad = function(angle){
        angle = angle || 0;
        return 2 * Math.PI/360 * angle;
    }

    /**
     * 根据角度计算余弦值
     * @param angle
     */
    utils.cos = function(angle){
        return Math.cos(utils.angleToRad(angle));
    }

    /**
     * 根据角度计算正弦值
     * @param angle
     */
    utils.sin = function(angle){
        return Math.sin(utils.angleToRad(angle));
    }
});

//# sourceMappingURL=utils.js.map
