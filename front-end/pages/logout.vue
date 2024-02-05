<template></template>

<script setup>

onMounted(async () => {
	useNuxtApp().$axios.get('/logout')
		.then(() => {
			useWebsocketStore().socket.close()
		})
		.catch(() => {
		})

	navigateTo({
		name: 'login',
		replace: true,
		query: {
			logout: true
		}
	})
})
</script>