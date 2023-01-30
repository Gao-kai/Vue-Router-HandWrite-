<template>
	<div class="home">
		<h1>这是Home组件</h1>
		<router-link to="/a">切换HomeA</router-link>
		<router-link to="/b">切换HomeB</router-link>
		<router-view></router-view>
	</div>
</template>

<script>
	// @ is an alias to /src
	// import HelloWorld from '@/components/HelloWorld.vue'

	export default {
		name: 'Home',
		components: {
			// HelloWorld
		}
	}
</script>
