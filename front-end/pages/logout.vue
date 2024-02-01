<template></template>

<script setup>

onMounted(async () => {
    useNuxtApp().$axios.get('/logout')
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