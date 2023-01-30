export default {
	/* 
		router-view组件是一个无任何状态的组件
		所以可以采用函数式组件来声明
		比如将组件标记为 functional，这意味它无状态 (没有响应式数据)
		函数式组件内部没有实例 (没有 this 上下文)
		如果我们想要在组件内部拿到实例this 可以采用第二个参数context来获取
		
		组件需要的一切都是通过 context 参数传递，它是一个包括如下字段的对象：
		props：提供所有 prop 的对象
		children：VNode 子节点的数组
		slots：一个函数，返回了包含所有插槽的对象
		scopedSlots：(2.6.0+) 一个暴露传入的作用域插槽的对象。也以函数形式暴露普通插槽。
		data：传递给组件的整个数据对象，作为 createElement 的第二个参数传入组件
		parent：对父组件的引用 
		
		组件渲染顺序：
		先是根组件app.vue中的router-view组件被加载
		然后是其子组件的router-view组件被加载
		所以我们可以通过router-view组件的parent引用间接获取父组件实例this
	 */
	functional: true,
	render(h,{parent,data}){
		// console.log('data',data)
		// 获取router-view组件所处的路由信息对象
		let route = parent.$route;
		let depth = 0;
		
		// 不停的通过parent属性进行查找父组件引用 然后depth++ 
		// 方便后面取到正确的record对象 增加标识位
		data.routerView = true;
		
		// 每次渲染符合条件就让depth++
		while(parent){
			if(parent.$vnode && parent.$vnode.data.routerView){
				depth++;
			}
			parent = parent.$parent;
		}
		
		
		// 按照顺序加载获取record对象
		let record = route.matched[depth];
		if(!record){
			return h();
		}
		
		// 渲染对应的record.component组件 
		return h(record.component,data);
	}
}