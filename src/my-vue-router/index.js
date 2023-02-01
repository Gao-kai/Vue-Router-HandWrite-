/**
 * TODO
 * 1. 如何基于用户传入的routes属性构建出一个路由映射表 树 => 扁平化
 * 2. 为什么在任意一个组件实例上都可以获取到this.$router 它的值是一个VueRouter的实例
 * 3. 将根实例注入的router属性共享给每一个组件
 */

import install,{Vue} from "./install.js";
import createMatcher from "./create-matcher.js";
import HashHistory from './history/hash.js';
import HTML5History from './history/history.js';

class VueRouter {
	constructor(options) {
		let routes = options.routes;
		
		/* 
			创建路由匹配器，内部工作：
			1. 创建路由映射表 path=> component
			2. 创建匹配器matcher并添加到router实例对象上
			3. 在matcher上添加动态添加路由和返回路由信息的方法
			addRoutes
			addRoute
			match
		 */
		this.matcher = createMatcher(routes);
		console.log('2.创建this.matcher',this.matcher);
		
		/* 
			基于不同的路由模式创建不同的路由系统
			hash
			history
			abstract
		 */
		let mode = options.mode || 'hash';
		if(mode === 'hash'){
			this.history = new HashHistory(this); // hashChange
		}else if(mode === 'history'){
			this.history = new HTML5History(this); // popState
		}
		
		/* 
			存放导航守卫的数组
		 */
		this.beforeEachHooks = []; // 前置
		this.beforeResolveHooks = []; // 解析
		this.afterEachHooks = []; // 后置 不会接受 next 函数也不会改变导航本身
	
	}
	
	// 代理一层match 传入路径 调用自身matcher上的match方法 返回匹配组件
	match(location){
		return this.matcher.match(location);
	}
	
	// rootApp就是new Vue生成的根实例 这里给根实例初始化路由系统
	init(rootApp){
		let history = this.history;
		
		// 拿到初始路径来渲染首次展示的组件
		let currentLocation = history.getCurrentLocation();
		
		// 初始化路由的时候先执行一次transtionTo方法 获取到当前路径匹配到的组件 并安装监听器
		history.transtionTo(currentLocation,()=>{
			// 安装路径变化监听器
			history.setupListener();
		})
		
		// 根据路径的变化匹配对应的组件进行渲染 路径变化 => 更新视图(响应式路径 )
		history.listen((newRoute)=>{
			rootApp._route = newRoute;
		});
	}
	
	/* 路由跳转... */
	push(location){
		return this.history.push(location);
	}
	
	// 全局前置导航守卫...
	beforeEach(callback){
		this.beforeEachHooks.push(callback);
	}
}


// 安装
VueRouter.install = install;


export default VueRouter;
