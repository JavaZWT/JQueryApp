/**
 * 菜单均在此文件配置
 */
(function (){
    //底部菜单 使用app.menu访问
    GloConfig.menu = [
        {//主页
            id: 'global_menu_1',
            title: '首页',
            nodeCode:1,
            nodeLevel:1,
            classNode:'menu-nodeCode1',
            url: 'home',
        },
        {//客户管理
            id: 'global_menu_2',
            title: '客户管理',
            nodeCode:2,
            nodeLevel:1,
            classNode:'menu-nodeCode2',
            url:'customList'//在这儿进入的是客户列表详情页
        },
        {//财务分析
            id: 'global_menu_3',
            title: '财务分析',
            nodeCode:3,
            nodeLevel:1,
            classNode:'menu-nodeCode3',
            url:'finance-enter'
            //func:'sino.alert("敬请期待！");'
        },
        {//建议书
            id: 'global_menu_4',
            title: '建议书',
            nodeCode: 4,
            nodeLevel:1,
            classNode:'menu-nodeCode4',
            url:'suggest-product'
        },
        {//活动量管理
            id: 'global_menu_5',
            title: '活动量管理',
            nodeCode: 5,
            nodeLevel:1,
            classNode:'menu-nodeCode5',
            url:'activity-personalGoal',
            items:[
                {
                    id: 'global_menu_5_1',
                    title: '目标制定',
                    nodeLevel:2,
                    nodeCode:'5_1',
                    parentID:'global_menu_5',
                    classNode:'menu-nodeCode5-1',
                    url:'activity-personalGoal'
                },
                {
                    id: 'global_menu_5_2',
                    title: '目标审核',
                    nodeLevel:2,
                    nodeCode:'5_2',
                    parentID:'global_menu_5',
                    classNode:'menu-nodeCode5-2',
                    url:'activity-goalCheck'
                },
                {
                    id: 'global_menu_5_3',
                    title: '工作日志',
                    nodeLevel:2,
                    nodeCode:'5_3',
                    parentID:'global_menu_5',
                    classNode:'menu-nodeCode5-3',
                    url:'activity-calendar'
                },
                {
                    id: 'global_menu_5_4',
                    title: '活动量统计分析',
                    nodeCode:'5_4',
                    nodeLevel:2,
                    parentID:'global_menu_5',
                    classNode:'menu-nodeCode5-4',
                    url:'activity-statisticAnalysis'
                }
            ]
        },
        {//我
            id:'global_menu_6',
            title:'我',
            nodeCode:6,
            nodeLevel:1,
            classNode:'menu-nodeCode6',
            url:'user-home'
        }
    ];
})();