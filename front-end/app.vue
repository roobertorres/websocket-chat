<template>
	<NuxtLoadingIndicator/>
	<div id="app">
		<NuxtLayout>
			<NuxtPage/>
		</NuxtLayout>
	</div>
</template>

<script setup>
</script>

<style>
#app {
	height: 100dvh;
	position: relative;
	overflow: hidden;
}

.layout-transition-enter-active,
.layout-transition-leave-active {
	transition: .5s;
	position: absolute;
	width: 100%;
}

.layout-transition-enter-from,
.layout-transition-leave-to {
	opacity: 0;
	transform: scale(0.9) translateY(3%);
}

.layout-transition-enter-to,
.layout-transition-leave-from {
	opacity: 1;
	transform: scale(1);
}

</style>
