<template>
	<div class="chat-messages flex-1 flex" style="overflow: auto; min-height: 0" id="mensagensContainer"
	     ref="mensagensContainer">
		<div class="messages-container flex flex-column">
			<template v-for="(mensagem, index) in mensagensStore.getMensagens" :key="mensagem.id_mensagem">
				<div class="flex gap-3 align-items-start"
				     :ref="index === mensagensStore.getMensagens.length - 1 ? 'lastMessage' : null"
				     :class="{ 'mt-4': !mensagemAnteriorMesmoRemetente(mensagem) &&  mensagensStore.getMessagesCount < mensagensStore.getMessagesCountDB}">
					<Avatar v-show="!mensagemAnteriorMesmoRemetente(mensagem)"
					        :label="mensagem.nome_usuario_remetente?.charAt(0) || '?'" shape="circle"
					        size="normal"/>
					<div>
						<div v-if="!mensagemAnteriorMesmoRemetente(mensagem)"
						     class="flex gap-2 align-items-center">
							<p class="m-0">
								<b>{{ remetentUserName(mensagem.usuario_remetente) }}</b>
							</p>
							<small style="color: darkgray">
								{{ converterDataHorario(mensagem.data_hora_mensagem) }}
							</small>
						</div>
						<div class="messages-minute mt-1 flex flex-column">
							<p class="m-0" :class="{ 'ml-6': mensagemAnteriorMesmoRemetente(mensagem) }">
								<template v-if="!mensagem.excluida">
									{{ mensagem.texto_mensagem }}
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
		<Button v-if="buttonFetchMessagesVisible"
		        :label="mensagensStore.buscandoMensagens ? 'Buscando...' : 'Carregar mais'" class="w-2 m-auto"
		        :loading="mensagensStore.buscandoMensagens"
		        @click="mensagensStore.buscarMensagens()" size="small" text/>
		<div v-else-if="!mensagensStore.buscandoMensagens">
			<h3>Este é o início desta conversa.</h3>
			<Divider/>
		</div>
	</div>
</template>

<script setup>
const mensagensContainer = ref(null)
const mensagensStore = useMensagensStore()

const remetentUserName = (id) => {
	const user = useChatsStore().chatUsers.get(id)

	if (user) {
		return user.nome_usuario
	}
	else if (id === useUsuarioStore().getUsuarioId) {
		return useUsuarioStore().getNomeUsuario
	}
	else {
		return useUsuarioStore().getUsuarioId
	}
}

const buttonFetchMessagesVisible = computed(() => {
	return mensagensStore.getMessagesCount < mensagensStore.getMessagesCountDB || (mensagensStore.getMessagesCount === 0 && mensagensStore.buscandoMensagens)
})

onMounted(async () => {
	await mensagensStore.fetchChat()
	await nextTick()

	while (mensagensContainer.value.scrollHeight - 200 <= mensagensContainer.value.clientHeight && mensagensStore.getMessagesCount < mensagensStore.getMessagesCountDB) {
		await mensagensStore.buscarMensagens()
		await nextTick()
	}

	mensagensContainer.value.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
	mensagensContainer.value.removeEventListener('scroll', handleScroll)
})

const handleScroll = async () => {
	if (!mensagensStore.buscandoMensagens) {
		if ((mensagensContainer.value.clientHeight + (mensagensContainer.value.scrollTop * -1) >= mensagensContainer.value.scrollHeight - 500) && mensagensStore.getMessagesCount < mensagensStore.getMessagesCountDB) {
			await mensagensStore.buscarMensagens()
			await nextTick()
		}
	}
}

const mensagemAnteriorMesmoRemetente = (mensagem) => {
	const mensagem_anterior = {
		...mensagensStore.getMensagem(mensagem.id_mensagem - 1)
	}

	const horario_mensagem_anterior = new Date(mensagem_anterior.data_hora_mensagem).getTime()
	const horario_mensagem_atual = new Date(mensagem.data_hora_mensagem).getTime()

	const same_minute = Number(((horario_mensagem_atual - horario_mensagem_anterior) / 1000 / 60).toFixed(0)) === 0
	const same_user = mensagem_anterior && mensagem_anterior.usuario_remetente === mensagem.usuario_remetente

	return same_minute && same_user
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

// watch(() => mensagensStore.getMensagens, async () => {
// 	await nextTick()
// mensagensContainer.value.scrollBottom = mensagensContainer.value.scrollHeight
// })
</script>

<style scoped>
.chat-messages {
	padding-right: 1rem;
	flex-direction: column-reverse;

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