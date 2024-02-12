<template>
	<div class="chat-messages flex-1 flex flex-column" style="overflow: auto; min-height: 0" id="mensagensContainer"
	     ref="mensagensContainer">
		<ProgressSpinner v-if="mensagensStore.getMessagesCount < mensagensStore.getMessagesCountDB" mode="indeterminate"
		                 style="height: 2.5rem"/>
		<template v-if="mensagensStore.getMessagesCount > 0">
			<!--			<div>-->
			<!--				<p>Mensagens no front: {{ mensagensStore.getMessagesCount }}</p>-->
			<!--				<p>Mensagens no banco: {{ mensagensStore.getMessagesCountDB }}</p>-->
			<!--				&lt;!&ndash;				<pre>{{ mensagensStore.getMensagens }}</pre>&ndash;&gt;-->
			<!--				<Divider class="mb-1"/>-->
			<!--			</div>-->
			<div class="flex flex-column">
				<template v-for="(mensagem, index) in mensagensStore.getMensagens" :key="mensagem.id_mensagem">
					<div class="flex gap-3 align-items-start"
					     :ref="index === mensagensStore.getMensagens.length - 1 ? 'lastMessage' : null"
					     :class="{ 'mt-5': !mensagemAnteriorMesmoRemetente(mensagem) }">
						<Avatar v-show="!mensagemAnteriorMesmoRemetente(mensagem)"
						        :label="mensagem.nome_usuario_remetente?.charAt(0) || '?'" shape="circle"
						        size="normal"/>
						<div>
							<div v-if="!mensagemAnteriorMesmoRemetente(mensagem)"
							     class="flex gap-2 align-items-center">
								<p class="m-0">
									<b>{{ mensagem.nome_usuario_remetente || 'Usuário desconhecido' }}</b>
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
		</template>
	</div>
</template>

<script setup>
const mensagensContainer = ref(null)
const mensagensStore = useMensagensStore()

onBeforeUnmount(() => {
	mensagensStore.clearMessages()
	mensagensContainer.value.removeEventListener('scroll', handleScroll())
})

const handleScroll = async () => {
	if (mensagensContainer.value.scrollTop === 0 && !mensagensStore.buscandoMensagens) {
		await mensagensStore.buscarMensagens()
	}
}

onMounted(async () => {
	mensagensStore.clearMessages()
	await mensagensStore.buscarMensagens()
	await nextTick()

	while ((!(mensagensContainer.value.scrollHeight - 50 > mensagensContainer.value.clientHeight)) && mensagensStore.getMessagesCount < mensagensStore.getMessagesCountDB) {
		await mensagensStore.buscarMensagens()
		// await new Promise(resolve => setTimeout(resolve, 1000))
	}

	mensagensContainer.value.scrollTop = mensagensContainer.value.scrollHeight

	mensagensContainer.value.addEventListener('scroll', handleScroll)
})

const fetchMessages = async () => {
	return await mensagensStore.buscarMensagens(useRoute().params.id)
}

const mensagemAnteriorMesmoRemetente = (mensagem) => {
	const mensagem_anterior = {
		...mensagensStore.getMensagem(mensagem.id_mensagem - 1)
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

watch(() => mensagensStore.getMensagens, async () => {
	await nextTick()
	// mensagensContainer.value.scrollTop = mensagensContainer.value.scrollHeight
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