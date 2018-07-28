/**
 * 菜单均在此文件配置 数据库中只配置
 * Created by LHY on 16/1/29.
 */
(function (){
    //菜单 使用app.menu访问
    GloConfig.menu = [
        {//主页
            id: 'global_menu_1',
            title: '首页',
            nodeCode:1,
            url: 'home',
        },
        {//客户管理
            id: 'global_menu_2',
            title: '准客户管理',
            nodeCode:2,
            url:'custom-customQuery'
        },
        {//建议书
            id: 'global_menu_3',
            title: '建议书',
            nodeCode:3,
            url:'suggest-querySuggest'
        },
        {//电子投保
            id: 'global_menu_4',
            title: '电子投保',
            nodeCode: 4,
            url:'eform-queryEform'
            //insured	
        },
        {//后台管理
            id: 'global_menu_5',
            title:'后台管理',
            noLink:true,
            nodeCode:5,
            items:[
                {
                    id: 'global_menu_5_2',
                    title: '设备管理',
                    nodeCode:'5_2',
                    url:'device-queryDevice'
                },
                {
                    id: 'global_menu_5_3',
                    title: '设备使用统计',
                    nodeCode:'5_3',
                    url:'device-deviceStatistics'
                },
                {
                    id: 'global_menu_5_4',
                    title: '用户管理',
                    nodeCode:'5_4',
                    url:'user-queryUser'
                },
                {
                    id: 'global_menu_5_5',
                    title: '机构管理',
                    nodeCode:'5_5',
                    url:'com-queryCom'
                } 
            ]
        },
        {//退出
            id: 'global_menu_6',
            title:'退出',
            noLink:true,
            exec:'app.logout()',
            nodeCode:6,
        }
    ];
})();