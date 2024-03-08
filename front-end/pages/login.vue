<template>
	<div class="login-container border-round flex gap-3 p-6 m-4">
		<div class="flex flex-column justify-content-between flex-1">
			<img src="/images/ws-chat-logo.svg" style="width: 12rem"/>
			<div class="flex flex-column gap-1">
				<h2>{{ useRoute().name }}</h2>
				<small style="color: darkgray">WS Chat © {{ new Date().getFullYear() }} TORRES</small>
				<small style="color: darkgray">Nenhum direito reservado.</small>
			</div>
		</div>
		<Divider layout="vertical"/>
		<div class="pages-container flex-1">
			<NuxtPage :transition="{name: 'login-pages-fade'}"/>
		</div>
	</div>
</template>

<script setup>
definePageMeta({
	layout: 'login',
})
</script>

<style scoped lang="scss">
.login-container {
	background: var(--surface-50);
	max-width: 1000px;
	width: 1000px;
	transition: 1s;

	.pages-container {
		//position: relative;
		display: grid;
		transition: 1s;
	}
}
</style>

<style lang="scss">
.login-pages-fade-enter-active,
.login-pages-fade-leave-active {
	grid-area: 1 / 1 / 2 / 2;
	transition: .25s;
	transition-delay: .25s;
}

.login-pages-fade-leave-active {
	//position: absolute;
	transition: .25s;
}

.login-pages-fade-leave-from,
.login-pages-fade-enter-to {
	opacity: 1;
}

.login-pages-fade-enter-from,
.login-pages-fade-leave-to {
	opacity: 0;
}

</style>