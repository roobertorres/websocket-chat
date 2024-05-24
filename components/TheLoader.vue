<template>
	<Transition>
		<div v-if="loading" class="loader flex align-items-center justify-content-center">
			<div class="flex flex-column justify-content-center gap-3">
				<ProgressSpinner/>
				<h3>{{ action }}</h3>
			</div>
		</div>
	</Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>

<script setup>
let loading = ref(true)
let action = ref('')

onMounted(async () => {
	action.value = 'Procurando seus amigos...'
	await useAmigosStore().fetchFriends()

	action.value = 'Organizando suas conversas...'
	await useChatsStore().buscarChats()

	loading.value = false
})
</script>

<style lang="scss" scoped>
.loader {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
	background: var(--surface-ground);
}
</style>
```