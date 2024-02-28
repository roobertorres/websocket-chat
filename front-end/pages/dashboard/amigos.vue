<template>
    <div class="flex flex-column gap-3">
        <div class="page-title">
            <h2 class="mb-0">Amigos</h2>
        </div>
        <AmigosAdicionarAmigos/>
        <AmigosSolicitacoesAmizade/>
        <AmigosGerenciarAmigos/>

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