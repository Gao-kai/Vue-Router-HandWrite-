import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter from '../my-vue-router/index.js';
import Home from '../views/Home.vue'
import About from '../views/About.vue'

// 执行插件VueRouter的install方法
Vue.use(VueRouter)

// 创建一个路由映射表
const routes = [{
		path: '/',
		name: 'Home',
		component: Home,
		children:[
			{
				path: 'a',
				name: 'HomeA',
				component: {
					render:(h)=> <h1>HomeA</h1>
				},
			},
			{
				path: 'b',
				name: 'HomeB',
				component: {
					render:(h)=> <h1>HomeB</h1>
				},
			}
		]
	},
	{
		path: '/about',
		name: 'About',
		component: About,
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		// component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
		children:[
			{
				path: 'c',
				name: 'AboutC',
				component: {
					render:(h)=> <h1>AboutC</h1>
				},
			},
			{
				path: 'd',
				name: 'AboutD',
				component: {
					render:(h)=> <h1>AboutD</h1>
				},
			}
		]
	}
]

// 导出一个router实例对象
const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL, // 这里的值默认是一个/
	routes
})

window.router = router;

// 手动添加路由
// router.matcher.addRoutes([
// 	{
// 		path: '/about',
// 		name: 'About',
// 		children:[
// 			{
// 				path: 'e',
// 				name: 'AboutE',
// 				component: {
// 					render:(h)=> <h1>AboutE</h1>
// 				},
// 			},
// 		]
// 	}
// ])

// 添加全局导航守卫
router.beforeEach((from,to,next)=>{
	console.log('路由发生变化，开始导航触发全局前置钩子1');
	setTimeout(()=>{
		console.log('鉴权完成1');
		next();
	},500)
})

router.beforeEach((from,to,next)=>{
	console.log('路由发生变化，开始导航触发全局前置钩子2');
	setTimeout(()=>{
		console.log('鉴权完成2')
		next();
	},500)
})

export default router
