<template>
	<NuxtLoadingIndicator/>
</template>

<script setup>
onMounted(async () => {
	useNuxtApp().$axios.get('/logout')
		.then(() => {
			useWebsocketStore().socket.close()
		})
		.catch(() => {
		})

	await navigateTo({
		name: 'Fazer login',
		replace: true,
		query: {
			logout: true
		}
	})
})
</script>