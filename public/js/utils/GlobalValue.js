/**
 * 存储全局变量
 * 
 */
(function() {
	try {
		// 存储全局变量
		window.G = window.G || {};

		// 需要存储的变量 所有需要存储的变量必须在此处声明 如果不声明 则无法赋值
		var keys = [ {
			name : 'operationType',//操作类型 0:新增 1:修改 2:复制 3:查看
		}, {
			name : 'deviceID',//设备ID
		} ];
		/**
		 * 清空数据
		 * @param type 默认为null 只清空本处声明的数据 all:清空sessionStorage
		 */
		G.clear = function(type) {
			if (type == 'all') {
				sessionStorage.clear();
			} else {
				for (var i = 0; i < keys.length; i++) {
					sessionStorage.removeItem(keys[i].name);
				}
			}
		};
		G.serialize = function(keyArray) {
			var data = "";
			if (keyArray != undefined && keyArray != null && keyArray) {
				for (var i = 0; i < keyArray.length; i++) {
					data += keyArray[i] + sessionStorage[keyArray[i]] + "&";
				}
			} else {
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i].name;
					var value = sessionStorage[keys[i].name];
					if (key != undefined && key != null && key != ""
							&& value != undefined && value != null
							&& value != "") {
						data += key + "=" + value + "&";
					} else {
						continue;
					}
				}
			}
			return data;
		}
		for (var i = 0; i < keys.length; i++) {
			// 保存变量 防止取值错误
			(function(data) {
				// 为全局变量增加存取器属性
				Object.defineProperty(G, data.name, {
					get : function() {
						return sessionStorage[data.name];
					},
					set : function(value) {
						// 如果name 属性为数组 说明改值需要设置多个参数
						if (Array.isArray(data.name)) {
							for (var j = 0; j < data.name.length; j++) {
								sessionStorage[data.name[j]] = value;
							}
						} else {
							sessionStorage[data.name] = value;
						}
					}
				});
			})(keys[i]);
		}

		//禁止对G变量进行扩展
		if (Object.preventExtensions)
			Object.preventExtensions(G);
	} catch (error) {
		if (window.console)
			console.error("G全局变量没有加载", error);
	}
})();