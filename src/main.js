/* 
	这里引入的vue是runtion-only运行时版本
	不支持我们在new Vue的时候手动传入template进行模板编译
	内部是通过loader将.vue文件转化为一个js对象 也就是后面导入的App组件
	这个App组件是一个js对象 上面有一个render方法
	当我们在调用h方法也就是_c方法的时候 参数为组件对象 此时就会去调用组件独享上的render方法进行渲染
	
	解决方案：
	1. 引入vue的编译-运行时版本 带有模板编译的版本
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

let vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
