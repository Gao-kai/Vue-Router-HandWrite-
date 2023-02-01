/* 
	routes数组进行扁平化 转为对象routeMap
 */
export default function createRouteMap(routes,routeMap){
	routeMap = routeMap || {};
	routes.forEach((route)=>{
		addRouteRecord(route,routeMap);
	})
	
	console.log('routeMap',routeMap);
	
	return {
		routeMap
	}
	
}

// path: '/home', path: 'c',
function addRouteRecord(route,routeMap,parentRecord){
	let path = null;
	// 父子路径拼接
	if(route.path){
		if(parentRecord?.path){
			if(parentRecord.path.endsWith("/")){
				path = `${parentRecord.path}${route.path}`;
			}else{
				path = `${parentRecord.path}/${route.path}`;
			}
		}else{
			path = route.path;
		}
	}
	
	// 创建路由记录
	let record= {
		path,
		component:route.component,
		props:route.props,
		meta:route.meta,
		parent:parentRecord // 存放父路由对应的record对象
	}
	
	// 将路由记录放入routeMap映射表
	if(!routeMap[path]){
		routeMap[path] = record;
	}
	
	// 递归添加
	if(route.children){
		route.children.forEach((childRoute)=>{
			addRouteRecord(childRoute,routeMap,route);
		})
	}
	
}
