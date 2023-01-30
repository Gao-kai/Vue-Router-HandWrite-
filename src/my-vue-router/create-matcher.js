import createRouteMap from './create-router-map.js';

export default function createMatcher(routes){
	let {routeMap} = createRouteMap(routes);
	
	/* 
		动态添加多个路由
	 */
	function addRoutes(routes){
		createRouteMap(routes,routeMap);
	}
	
	/* 
		动态添加一个路由
	 */
	function addRoute(route){
		createRouteMap([route],routeMap);
	}
	
	/* 
		返回path匹配对应的路由对象
	 */
	function match(location){
		return routeMap[location];
	}
	
	
	return {
		addRoutes,
		addRoute,
		match
	}
}




