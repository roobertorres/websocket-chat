<template>
    <div class="chat-messages flex-1 flex flex-column" style="overflow: auto; min-height: 0" id="mensagensContainer"
        ref="mensagensContainer">
        <ProgressBar v-if="useMensagensStore().buscandoMensagens" mode="indeterminate" style="height: 5px" />
        <template v-else>
            <div>
                <h3 class="">Este é o início desta conversa</h3>
                <Divider class="mb-1" />
            </div>
            <div class="flex flex-column">
                <template v-for="(mensagem, index) in useMensagensStore().getMensagens" :key="mensagem[1].id_mensagem">
                    <div class="flex gap-3 align-items-start"
                        :ref="index === useMensagensStore().getMensagens.length - 1 ? 'lastMessage' : null"
                        :class="{ 'mt-5': !mensagemAnteriorMesmoRemetente(mensagem[1]) }">
                        <Avatar v-show="!mensagemAnteriorMesmoRemetente(mensagem[1])"
                            :label="mensagem[1].nome_usuario_remetente?.charAt(0) || '?'" shape="circle" size="normal" />
                        <div>
                            <div v-if="!mensagemAnteriorMesmoRemetente(mensagem[1])" class="flex gap-2 align-items-center">
                                <p class="m-0">
                                    <b>{{ mensagem[1].nome_usuario_remetente || 'Usuário desconhecido' }}</b>
                                </p>
                                <small style="color: darkgray">
                                    {{ converterDataHorario(mensagem[1].data_hora_mensagem) }}
                                </small>
                            </div>
                            <div class="messages-minute mt-1 flex flex-column">
                                <p class="m-0" :class="{ 'ml-6': mensagemAnteriorMesmoRemetente(mensagem[1]) }">
                                    <template v-if="!mensagem.excluida">
                                        {{ mensagem[1].texto_mensagem }}
                                    </template>
                                    <template v-else>
                                        <i>Esta mensagem foi excluída</i>
                                    </template>
                                </p>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script setup>
const mensagensContainer = ref(null)

onMounted(async () => {
    await useMensagensStore().buscarMensagens(useRoute().params.id)
    await nextTick()
    mensagensContainer.value.scrollTop = mensagensContainer.value.scrollHeight
})

const mensagemAnteriorMesmoRemetente = (mensagem) => {
    const mensagem_anterior = {
        ...useMensagensStore().getMensagem(mensagem.id_mensagem - 1)
    }
    return mensagem_anterior.usuario_remetente === mensagem.usuario_remetente
    // return `Remetente mensagem anterior: ${mensagem_anterior.usuario_remetente} | Remetente mensagem atual: ${mensagem.usuario_remetente}`
}

const converterDataHorario = (data_hora) => {
    const data = new Date(data_hora)
    const hoje = new Date()

    if (data.toLocaleDateString() === hoje.toLocaleDateString()) {
        const horarioFormatado = data.toLocaleTimeString('pt-BR', { timeStyle: 'short' })
        return `Hoje, ${horarioFormatado}`
    }
    else {
        const dataFormatada = data.toLocaleDateString('pt-BR', { dateStyle: 'short' })
        const horarioFormatado = data.toLocaleTimeString('pt-BR', { timeStyle: 'short' })
        return `${dataFormatada} ${horarioFormatado}`
    }
}

watch(() => useMensagensStore().getMensagens, async () => {
    await nextTick()
    mensagensContainer.value.scrollTop = mensagensContainer.value.scrollHeight
})
</script>

<style scoped>
.chat-messages {
    padding-right: 1rem;

    &::-webkit-scrollbar-track {
        background-color: var(--surface-200);
        border-radius: 5px;
    }

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: var(--surface-50);
    }
}
</style>