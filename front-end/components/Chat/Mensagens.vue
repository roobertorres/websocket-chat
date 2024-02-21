<template>
	<div class="chat-messages flex-1 flex" style="overflow: auto; min-height: 0" id="mensagensContainer"
	     ref="mensagensContainer">
		<div class="messages-container flex flex-column">
			<template v-for="(mensagem, index) in mensagensStore.getMensagens" :key="mensagem.id_mensagem">
				<div class="flex gap-3 align-items-start"
				     :class="{ 'mt-3': (!mensagemAnteriorMesmoRemetente(mensagem) || !mensagemAnteriorMesmoMinuto(mensagem)) && index !== 0}"
				     :ref="el => {if (el) addObserver(el, mensagem)}">
					<div class="avatar-container">
						<Avatar
							v-if="!mensagemAnteriorMesmoRemetente(mensagem) || !mensagemAnteriorMesmoMinuto(mensagem)"
							:label="remetentUserName(mensagem.usuario_remetente).charAt(0)"
							shape="circle"
							size="normal"/>
					</div>
					<div class="message">
						<div v-if="!mensagemAnteriorMesmoRemetente(mensagem) || !mensagemAnteriorMesmoMinuto(mensagem)"
						     class="flex gap-2 align-items-center">
							<p class="m-0">
								<b>{{ remetentUserName(mensagem.usuario_remetente) }}</b>
							</p>
							<ChatMensagensDataHoraMensagem :data="mensagem.data_hora_mensagem"/>
						</div>
						<div class="mt-1 flex flex-column">
							<div class="mt-1 flex flex-column">
								<p class="m-0" :class="{ 'ml-5': messageMarginLeft(mensagem)  }">
									<template v-if="!mensagem.excluida">
										{{ mensagem.texto_mensagem }}
									</template>
								</p>
							</div>
						</div>
						<!--						<small>{{ mensagem.lida ? 'Lida!' : 'Não lida' }}</small>-->
					</div>
					<div class="flex h-full align-items-end gap-2">
						<!--						<small style="color: darkgray; white-space: nowrap;"-->
						<!--						       v-if="mensagem.lida">-->
						<!--							✓ Lida-->
						<!--						</small>-->
						<small>{{ mensagem.id_mensagem }}</small>

						<small>{{ mensagem.lida }}</small>
					</div>
				</div>
			</template>
		</div>
		<Button v-if="buttonFetchMessagesVisible"
		        :label="mensagensStore.buscandoMensagens ? 'Buscando...' : 'Carregar mais'" class="w-2 m-auto"
		        :loading="mensagensStore.buscandoMensagens"
		        @click="mensagensStore.buscarMensagens()" size="small" text/>
		<!--		<div v-else-if="!mensagensStore.buscandoMensagens" id="elemento">-->
		<div id="elemento">
			<h3>Este é o início desta conversa.</h3>
			<Divider/>
		</div>
	</div>
</template>

<script setup>
const mensagensContainer = ref(null)
const mensagensStore = useMensagensStore()

let readMessages = ref([])

let timeout = null

const markMessageAsRead = (id_mensagem) => {
	readMessages.value.push(id_mensagem)

	if (timeout) {
		clearTimeout(timeout)
		timeout = null
	}

	timeout = setTimeout(() => {
		useMensagensStore().registerMessagesAsRead(readMessages.value)
		console.log(readMessages.value.length, 'mensagens enviadas para o servidor')
		readMessages.value = []
		timeout = null
	}, 2000)
}

const addObserver = (el, mensagem) => {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting && mensagem.lida == 0) {
				markMessageAsRead(mensagem.id_mensagem)
			}
		})
	}, {
		root: mensagensContainer.value,
	})

	observer.observe(el)
}

onMounted(async () => {
	await mensagensStore.fetchChat()
	await nextTick()

	while (mensagensContainer.value.scrollHeight - 100 <= mensagensContainer.value.clientHeight && mensagensStore.getMessagesCount < mensagensStore.getMessagesCountDB) {
		await mensagensStore.buscarMensagens()
		await nextTick()
	}

	mensagensContainer.value.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
	mensagensContainer.value.removeEventListener('scroll', handleScroll)
})

const messageMarginLeft = (message) => {
	if (mensagemAnteriorMesmoRemetente(message) && !mensagemAnteriorMesmoMinuto(message)) {
		return false
	}
	else if (mensagemAnteriorMesmoRemetente(message) && mensagemAnteriorMesmoMinuto(message)) {
		return true
	}
	else {
		return false
	}
}

const remetentUserName = (id) => {
	const user = useMensagensStore().chatParticipants.get(id)

	if (user) {
		return user.nome_usuario
	}
	else if (id === useUsuarioStore().getUsuarioId) {
		return useUsuarioStore().getNomeUsuario
	}
	else {
		return '?'
	}
}

const buttonFetchMessagesVisible = computed(() => {
	return mensagensStore.getMessagesCount < mensagensStore.getMessagesCountDB || (mensagensStore.getMessagesCount === 0 && mensagensStore.buscandoMensagens)
})

const handleScroll = async () => {
	if (!mensagensStore.buscandoMensagens) {
		if ((mensagensContainer.value.clientHeight + (mensagensContainer.value.scrollTop * -1) >= mensagensContainer.value.scrollHeight - 500) && mensagensStore.getMessagesCount < mensagensStore.getMessagesCountDB) {
			await mensagensStore.buscarMensagens()
			await nextTick()
		}
	}
}

const mensagemAnteriorMesmoMinuto = (mensagem) => {
	const mensagem_anterior = {
		...mensagensStore.getMensagem(mensagem.id_mensagem - 1)
	}

	const horario_mensagem_anterior = new Date(mensagem_anterior.data_hora_mensagem).getTime()
	const horario_mensagem_atual = new Date(mensagem.data_hora_mensagem).getTime()

	return Number(((horario_mensagem_atual - horario_mensagem_anterior) / 1000 / 60).toFixed(0)) === 0
}

const mensagemAnteriorMesmoRemetente = (mensagem) => {
	const mensagem_anterior = {
		...mensagensStore.getMensagem(mensagem.id_mensagem - 1)
	}

	return mensagem_anterior && mensagem_anterior.usuario_remetente === mensagem.usuario_remetente
}

watch(() => mensagensStore.getMensagens, async () => {
	if (mensagensContainer.value.scrollTop > 0 && mensagensContainer.value.scrollTop < 5) mensagensContainer.value.scrollTop = 0
})
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

	.message {
		width: 100%;

		&:hover {
			background: var(--surface-hover);
		}
	}
}
</style>