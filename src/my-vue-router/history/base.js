/* 
	根据路由记录和path信息计算出当前的
	routeRecord 路由记录 就是routes中的一条条配置信息
	location 路径对象 内含path属性
 */
function createRoute(routeRecord,location){
	let matched = [];
	if(routeRecord){
		// 递归查找收集要渲染的组件 
		while(routeRecord){
			matched.unshift(routeRecord);
			routeRecord = routeRecord.parent;
		}
	}
	
	return {
		...location,
		matched
	}
}

function runQuene(hooksQuene,from,to,cb){
	function next(index){
		if(index >= hooksQuene.length){
			// 所有钩子执行完毕 再去执行跳转逻辑
			cb();
			return;
		}
		
		// 依次调用注册好的hooks
		let hook = hooksQuene[index];
		if(hook){
			hook(from,to,()=>next(index+1));
		}
	}
	
	next(0);
}


export default class Base {
	constructor(router) {
		this.router = router;

		this.current = createRoute(null,{
			path:"/"
		});
	}

	/* 
		核心API
		点击router-link标签 会触发transtionTo 并执行路径切换
		hashChange监听到切换 也会触发transtionTo 并执行路径切换
		
		1. 获取到也切换的目标路径 可能是一个 /about 也可能是一个 /about/a
		2. 基于路径从路由映射表中取出对应的组件配置对象 record 里面包含component属性 parent属性
		3. 计算所有要渲染的组件也就是route对象 内部的matched属性是一个数组 数组中是依次需要渲染的record对象
		
	 */
	transtionTo(location, listener) {
		let record = this.router.match(location);
		let route = createRoute(record,{path:location});
		console.log('route',route);
		/* 
			如何判定是重复操作：
			1. 要跳转的目标路径前后一致
			2. 目标路径匹配的matched数组长度一致
		 */
		if(location === this.current.path && route.matched.length === this.current.matched.length){
			// 说明重复点击跳转 或者重复跳转一个相同的路径 这里要拦截 避免多次执行相同逻辑
			console.log('前后一样，不执行跳转逻辑',listener)
			return;
		}
		
		// 先处理导航守卫 然后再决定是否执行跳转逻辑
		let quene = [].concat(this.router.beforeEachHooks,this.router.beforeResolveHooks,this.router.afterEachHooks)

		runQuene(quene,this.current,route,()=>{
			// 将最新的匹配结果赋值给this.current 便于下一次比较
			this.current = route;
			
			/* 
				首次进来listener是监听器 监听路由变化
				后面进来listener是回调函数 用于执行路由切换
			 */
			listener && listener();
			console.log('执行了listener',listener)
			
			// 首次进来不会执行只保持 后续给this.current重新赋值之后就会执行
			// 将最新路由route传递过去 执行rootApp._route = newRoute;
			// 触发rootApp._route的setter  触发页面更新渲染
			this.cb && this.cb(route);
		})
		
	}
	
	// 接收一个回调函数 内部放着更新this._route的逻辑 为了触发响应式更新
	listen(cb){
		this.cb = cb;
	}
	
}
