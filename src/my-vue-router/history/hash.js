import Base from './base.js';

function ensureSlash(){
	if(window.location.hash){
		return;
	}
	
	// 如果没有hash值 那么需要默认给一个/
	window.location.hash = "/";
}

function getHash(){
	return window.location.hash.slice(1);
}

function supportPushState(){
	return window.history && typeof window.history.pushState === 'function';
}

export default class HashHistory extends Base{
	constructor(router){
		super(router);
		
		// 初始化hash路由的时候 要给定一个默认的hash路径
		ensureSlash();
	}
	
	// 安装hash监听器 监听hash的变化
	setupListener(){
		window.addEventListener('hashchange',()=>{
			console.log('监听到hash变化，HashHistory-getHash值为',getHash());
			this.transtionTo(getHash());
		})
	}
	
	getCurrentLocation(){
		return getHash();
	}
	
	push(location){
		this.transtionTo(location,()=>{
			// 匹配到组件的同时 切换浏览器地址栏的路径
			window.location.hash = location;
		});
	}
}