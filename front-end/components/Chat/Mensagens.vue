<template>
    <div class="chat-messages flex-1 flex flex-column gap-3 justify-content-end" style="overflow: auto; min-height: 0"
        ref="mensagensContainer">
        <ProgressBar v-if="mensagensStore.buscandoMensagens" mode="indeterminate" style="height: 5px" />
        <template v-else>
            <div v-if="mensagensStore.getMensagens.length > 0">
                <p class="">Este é o início desta conversa</p>
                <Divider class="m-0" />
            </div>
            <template v-for="(mensagem, index) in mensagensStore.getMensagens" :key="mensagem[1].id_mensagem">
                <div class="flex gap-3" :ref="index === mensagensStore.getMensagens.length - 1 ? 'lastMessage' : null">
                    <Avatar :label="mensagem[1].nome_usuario_remetente?.charAt(0) || '?'" shape="circle" size="normal" />
                    <div>
                        <small class="flex gap-2">
                            <b>{{ mensagem[1].nome_usuario_remetente || 'Usuário desconhecido' }}</b>
                            <span style="color: darkgray">
                                {{ converterDataHorario(mensagem[1].data_hora_mensagem) }}
                            </span>
                        </small>
                        <div class="messages-minute mt-1 flex flex-column">
                            <p class="m-0">
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
                <!-- <pre>
                    {{ mensagem }}
                </pre> -->
            </template>
        </template>
    </div>
</template>

<script setup>
const mensagensStore = useMensagensStore()
const mensagensContainer = ref(null)

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

onMounted(async () => {
    await mensagensStore.buscarMensagens(useRoute().query.id)
})

watch(() => mensagensStore.getMensagens.length, async () => {
    mensagensContainer.value.scrollTop = mensagensContainer.value.scrollHeight
})
</script>
