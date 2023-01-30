import Base from './base.js';
export default class HTML5History extends Base{
	constructor(router){
		super(router);
	}
	
	// 安装hash监听器 监听hash的变化
	setupListener(){
		window.addEventListener('popstate',function(){
			console.log('监听到hash变化，HTML5History-getHash值为',window.location.pathname);
			this.transtionTo(window.location.pathname);
			
		})
	}
	
	getCurrentLocation(){
		return window.location.pathname;
	}
	
	push(location){
		this.transtionTo(location,()=>{
			// 匹配到组件的同时 切换浏览器地址栏的路径
			history.pushState({},'',location)
		});
	}
}