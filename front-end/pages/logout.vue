<template></template>

<script setup>

onMounted(async () => {
    await useNuxtApp().$axios.get('/logout')
        .then(() => {
            useWebsocketStore().close()
        })
        .catch(() => { })

    navigateTo({
        name: 'login',
        replace: true,
        query: {
            logout: true
        }
    })
})
</script>