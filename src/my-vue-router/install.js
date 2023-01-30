/* 
	VueRouter.install是一个函数，参数为Vue构造函数
	
	当我们在调用Vue.use的时候会优先将传入的参数比如VueRouter进行执行
	如果VueRouter是一个类 那么类是不可以直接调用的
	所以我们就需要手动在类VueRouter上挂载一个install方法供Vue.use加载插件时调用
	
 */
import RouterLink from './component/router-link.js';
import RouterView from './component/router-view.js';

export let Vue;
function install(VueCtor) {
	console.log('1.-----install方法执行');

	// important：在install方法执行时将传入的Vue构造函数赋值给全局变量Vue供多处调用
	Vue = VueCtor;

	/* 
		1. Vue.mixin
		混入的对象会在new Vue的时候通过mergeOptions和用户自己传入的options进行合并 并通过继承让每一个Vue组件都有
		保证所有组件在初始化时都会执行此方法
		
		2. 给根实例及组件实例共同挂载一个属性_routerRoot，值为根Vue实例
		方便后续通过_routerRoot._router获取到共享的new VueRouter产生的router实例对象
		
		3. 用原型不是更简单？
		如果我们new 两次Vue,一次传递router属性一次不传递
		如果是原型挂载 那么没有传递router属性的这个实例也可以在this.$router上获取到路由对象
		这很明显是不科学的，而下面这种解决方案 就可以保证你不传递就获取不到
		
		4. Vue源码中
		并没有在每一个组件内部共享 也就是this.$router = this.$parent && this.$parent.$router;
		而是将根实例共享出去 其他组件在初始化的时候将根实例挂在自己的_routerRoot属性上
		然后通过代理劫持在访问$router的时候再去_routerRoot属性上的_router取值
	 */
	Vue.mixin({
		beforeCreate() {
			// 这里的this是new Vue产生的实例 或者new 继承自Vue类的产生的实例
			if (this.$options.router) {
				// 如果在当前实例对象的$options上发现有router属性 那么代表这是根实例
				this._routerRoot = this;
				this._router = this.$options.router;
				
				// 拿到根实例this的_router实例对象 然后初始化路由系统
				this._router.init(this);
			

				/* 
					给当前根实例this上新增一个响应式属性_route 值为router.history.current对象
					保证可以在任意组件中通过this._route获取到当前路由实例的current对象 
					不能使用set方法 因为不可以给this上添加响应式属性
					取值 收集依赖
					存值 也就是路由切换之后 transtionTo方法执行 this.current重新赋值为新的route
					此时应该触发页面更新
					
					defineReactive 会将对象this上的_route变为响应式
					同时将this._router.history.current对象中的每一个属性也变为响应式的
					递归构建响应式系统 
				 */
				Vue.util.defineReactive(this,'_route',this._router.history.current);
				
				
				
				
			} else {
				// 代表这是组件实例 组件渲染是从父到子 所以一定可以获取到
				this._routerRoot = this.$parent && this.$parent._routerRoot;
			}
		}
	})
	

	/* 
		使用代理劫持而不是使用直接定义Vue.prototype.xxx
		直接定义等于共享了属性
		而劫持只有在访问的时候才会返回值，为了取值方便
	 */
	Object.defineProperty(Vue.prototype, "$router", {
		get() {
			return this?._routerRoot?._router;
		}
	})
	
	/* 
		保证所有组件上都有一个$route属性 指向当前路由实例的current属性
		current对象包含了当前的路径信息和渲染组件的队列 [爷，父，子]
	 */
	Object.defineProperty(Vue.prototype, "$route", {
		get() {
			return this?._routerRoot?._route;
		}
	})
	
	/* 
		定义Router-Link组件
		<router-link to="/a">切换HomeA</router-link>
		将router-link组件的默认插槽'切换HomeA'渲染为一个a组件即可
		一个组件的所有插槽都会放在当前组件的$slots属性上
		其中$slots.default属性指的是匿名默认插槽
	 */
	Vue.component('router-link',RouterLink)
	
	Vue.component('router-view',RouterView)
}
export default install;
