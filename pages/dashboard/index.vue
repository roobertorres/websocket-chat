<template>
    <div class="gap-1 flex-1 flex flex-column align-items-center justify-content-center">
        <h1>Olá, {{ useUsuarioStore().getNomeUsuario }}! 👋</h1>
        <h4 class="m-0">Bem-vindo ao WS Chat. Use seus chats para conversar.</h4>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'dashboard',
    pageTransition: {
        name: 'page-transition'
    }
})
</script>

<style>
.login-fade-enter-active,
.login-fade-leave-active {
    transition: .7s;
    position: absolute;
    width: 100%;
}

.login-fade-enter-from,
.login-fade-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.login-fade-enter-to,
.login-fade-leave-from {
    opacity: 1;
    transform: scale(1);
}
</style>