<template>
    <template v-if="useSentFriendshipRequestsStore().getSentFriendshipRequests.length > 0">
        <Divider />
        <div class="field flex align-items-center justify-content-between">
            <div>
                <h4 class="mt-0 mb-1">Solicitações enviadas</h4>
            </div>
        </div>
        <div v-for="solicitacao in useSentFriendshipRequestsStore().getSentFriendshipRequests"
            :key="solicitacao.id_solicitacao_amizade" class="flex gap-2 align-items-center">

            <Avatar v-if="solicitacao.foto" shape="circle" />
            <Avatar v-else :label="solicitacao.nome_usuario?.charAt(0).toUpperCase() || '?'" shape="circle" />

            <div class="flex flex-column flex-1 chat-details w-1rem">
                <p class="m-0 text-md w-full" :title="solicitacao.nome_usuario">
                    {{ solicitacao.nome_usuario }}
                </p>
                <small class="text-gray-400 w-full" :title="solicitacao.email">
                    {{ solicitacao.email }}
                </small>
            </div>
            <div class="flex gap-2">
                <template v-if="solicitacao.processando">
                    <ProgressSpinner class="w-2rem h-2rem m-1" />
                </template>
                <template v-else>
                    <Button label="Cancelar solicitação" outlined severity="danger" size="small"
                        @click="cancelFriendshipRequest(solicitacao.id_solicitacao_amizade)" />
                </template>
            </div>
        </div>
    </template>
</template>

<script setup>
onMounted(() => {
    useSentFriendshipRequestsStore().fetchSentFriendshipRequests()
})

const cancelFriendshipRequest = async (id) => {
    useNuxtApp().$toast.removeAllGroups()

    await useSentFriendshipRequestsStore().cancelFriendshipRequest(id)
        .then(() => useNuxtApp().$toast.add({
            severity: 'success',
            summary: 'Feito!',
            detail: 'A solicitação foi removida',
            life: 3000
        }))
        .catch((err) => useNuxtApp().$toast.add({
            severity: 'info',
            detail: err.response ? err.response.data.message : 'Servidor indisponível',
            life: 5000
        }))
}
</script>