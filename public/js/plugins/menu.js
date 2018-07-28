$(function(){
    /**
     * 建立菜单的相关映射关系
     * @type {null}
     */
    app.menuIndex = null;
    app.initMenuMapping = function(){
        //建立id与序号的映射
        if(!this.menuIndex || !this.menuUrl){
            this.menuIndex = {};
            this.menuUrl = {};
            for(var i=0 ;i<this.menu.length; i++){
                //将序号保存到 菜单序号对象中
                this.menuIndex[this.menu[i].id] = [i];
                //如果有子菜单 则需要获取子菜单信息
                if(this.menu[i].items){
                    for(var j=0 ;j< this.menu[i].items.length; j++){
                        //对于二级目录 数组 0位保存 一级菜单序号 1位保存二级菜单序号
                        this.menuIndex[this.menu[i].items[j].id] = [i,j];
                    }
                }
            }
        }
    }
    /**
     * 用于存储菜单id到index的对应关系 便于查找 格式为{
     *     id(菜单的id) : [菜单在GloConfig.menu中的序号]
     * }
     */
    //根据菜单id直接获取菜单的json数据
    app.getMenuData = function(id){
        app.initMenuMapping();
        //根据映射关系 取出菜单所对应在菜单配置中的序号 一级菜单获取数组长度为1 二级菜单为长度为2
        var _menuIndexArr = this.menuIndex[id];

        var menuData = {};
        if(_menuIndexArr){
            menuData = this.menu;//为菜单赋值 便于进行循环
            for(var i=0;i<_menuIndexArr.length;i++){
                menuData = menuData[_menuIndexArr[i]];
                if(menuData.items && i != (_menuIndexArr.length-1) ) menuData = menuData.items;
            }
        }
        return menuData;
    }

    /**
     * 重置
     */
    app.resetMenuState = function(menu){
        if(menu){
            for(var i=0;i<menu.length;i++){
                menu[i].auth = 0;
                menu[i].active = 0;
                if(menu[i].items) app.resetMenuState(menu[i].items);
            }
        }
    }

    //为菜单增加事件
    $('#global-first-menu').on('click','.menu-item',clickMenu);

    function clickMenu(e){
        var id = null;
        var me = null;
        //如果是字符串类型 则说明传入的是id
        if(typeof e == 'string'){
            id = e;
            me = $('#'+id);
        }else{
            id = $(this).attr('id');
            me = $(this);
        }
        var menuData = app.getMenuData(id);

        //如果不是一级菜单，需要获取菜单列表用于显示
        if(menuData.nodeLevel!=1){
            parentMenuList=app.getMenuData(menuData.parentID);
            //不是一级菜单如果有冒泡事件需要阻止
            if(e.stopPropagation) e.stopPropagation();
        }
        //记录上次点击的菜单id
        sessionStorage.lastClickMenu=sessionStorage.clickMenu;
        //记录本次点击的菜单id
        sessionStorage.clickMenu = me.attr('id')?me.attr('id'):id;

        if(menuData.exec){
            eval(menuData.exec);
        }
        if(menuData.func){
            eval(menuData.func);
        }
        if(!menuData.noLink){
            app.loadPath(menuData.url);
        }

        //改变菜单状态
        for ( var index in app.menu) {
            if (app.menu[index].id === id && sessionStorage.clickMenu === id) {
                app.menu[index].active = 1;
            } else {
                app.menu[index].active = 0;
            }
            if (app.menu[index].items) {
                for ( var itemIndex in app.menu[index].items) {
                    if (app.menu[index].items[itemIndex].id === id
                        && sessionStorage.clickMenu === id) {
                        app.menu[index].items[itemIndex].active = 1;
                    } else {
                        app.menu[index].items[itemIndex].active = 0;
                    }
                }
            }
        }


        if(menuData.nodeLevel==1){// 一级菜单
            $('#global-first-menu').template(app.menu);
            $('.menu-item').removeClass('item-width2');
            $('.menu-item').addClass('item-width1');
        }else if(menuData.nodeLevel==2){//二级菜单
            $('#global-first-menu').template(parentMenuList.items);
            $('.menu-item').removeClass('item-width1');
            $('.menu-item').addClass('item-width2');
        }

        $('#mainviewport').removeClass('menu-hide');
    }

    app.clickMenu = clickMenu;
    app.changeMenuActive = function(e){
        var id = null;
        var me = null;
        var parentMenuList=null;
        //如果是字符串类型 则说明传入的是id
        if(typeof e == 'string'){
            id = e;
            me = $('#'+id);
        }else{
            id = $(this).attr('id');
            me = $(this);
        }

        var menuData = app.getMenuData(id);

        //如果不是一级菜单，需要获取菜单列表用于显示
        if(menuData.nodeLevel!=1){
            parentMenuList=app.getMenuData(menuData.parentID);
            //不是一级菜单如果有冒泡事件需要阻止
            if(e.stopPropagation) e.stopPropagation();
        }

        //记录本次点击的菜单id
        sessionStorage.clickMenu = me.attr('id')?me.attr('id'):id;
        //记录上次点击的菜单id
        sessionStorage.lastClickMenu=sessionStorage.clickMenu;

        //改变菜单状态
        for(var index in app.menu){
            if(app.menu[index].id===id&&sessionStorage.clickMenu===id){
                app.menu[index].active = 1;
            }else{
                app.menu[index].active = 0;
            }
            if(app.menu[index].items){
                for(var itemIndex in app.menu[index].items){
                    if(app.menu[index].items[itemIndex].id===id&&sessionStorage.clickMenu===id){
                        app.menu[index].items[itemIndex].active = 1;
                    }else{
                        app.menu[index].items[itemIndex].active = 0;
                    }
                }
            }
        }
        if(menuData.nodeLevel==1){//一级菜单
            $('#global-first-menu').template(app.menu);
            $('.menu-item').removeClass('item-width2');
            $('.menu-item').addClass('item-width1');
        }else if(menuData.nodeLevel==2){//二级菜单
            $('#global-first-menu').template(parentMenuList.items);
            $('.menu-item').removeClass('item-width1');
            $('.menu-item').addClass('item-width2');
        }
        $('#mainviewport').removeClass('menu-hide');
    };
})

