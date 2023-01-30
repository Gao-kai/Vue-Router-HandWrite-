export default {
	props:{
		to:{type:String,required:true},
		tag:{type:String,default:'a'}
	},
	methods:{
		handler(){
			console.log('router-link被点击 路径变化 组件需要切换');
			// this.to 就是要跳转过去的目标地址
			this.$router.push(this.to);
		}
	},
	// 组件渲染才会调用
	render(){
		let tag = this.tag;			
		return <tag onClick={this.handler}>{this.$slots.default}</tag>
	}
}