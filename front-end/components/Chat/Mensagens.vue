<template>
	<div class="chat-messages flex-1 flex" style="overflow: auto; min-height: 0" id="mensagensContainer"
	     ref="mensagensContainer">
		<div class="messages-container flex flex-column">
			<template v-for="(mensagem, index) in mensagensStore.getMensagens" :key="mensagem.id_mensagem">
				<div class="flex gap-3 align-items-start message py-1 px-1 border-round"
				     @contextmenu="onRightClick($event, mensagem.id_mensagem)"
				     :class="{ 'mt-3': (!mensagemAnteriorMesmoRemetente(mensagem) || !mensagemAnteriorMesmoMinuto(mensagem)) && index !== 0}"
				     :ref="el => {if (el) addObserver(el, mensagem)}">
					<div class="avatar-container">
						<Avatar
							v-if="!mensagemAnteriorMesmoRemetente(mensagem) || !mensagemAnteriorMesmoMinuto(mensagem)"
							:label="remetentUserName(mensagem.usuario_remetente).charAt(0)"
							shape="circle"
							size="normal"/>
					</div>
					<div :class="{ 'pl-5': messageMarginLeft(mensagem)  }" class="flex-1">
						<div
							v-if="!mensagemAnteriorMesmoRemetente(mensagem) || !mensagemAnteriorMesmoMinuto(mensagem)"
							class="flex gap-2 align-items-center">
							<p class="m-0">
								<b>{{ remetentUserName(mensagem.usuario_remetente) }}</b>
							</p>
							<ChatMensagensDataHoraMensagem :data="mensagem.data_hora_mensagem"/>
						</div>
						<div class="flex flex-column">
							<p class="m-0" style="word-break: break-word">
								<template v-if="!mensagem.excluida">
									<span>{{ mensagem.texto_mensagem }}</span>
									<small v-if="mensagem.lida && mensagem.usuario_remetente === useUsuarioStore().getUsuarioId" style="color: deepskyblue"> ✓</small>
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
		<div id="elemento">
			<h3>Este é o início desta conversa.</h3>
			<Divider/>
		</div>
	</div>
	<ContextMenu ref="menu" :model="messageOptions">
		<template #item="{ item, props }">
			<a v-ripple class="flex align-items-center" v-bind="props.action">
				<span :class="item.icon"/>
				<span class="ml-2">{{ item.label }}</span>
				<Badge v-if="item.badge" class="ml-auto" :value="item.badge"/>
				<span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{
						item.shortcut
					}}</span>
				<i v-if="item.items" class="pi pi-angle-right ml-auto"></i>
			</a>
		</template>
	</ContextMenu>
</template>

<script setup>
const mensagensContainer = ref(null)
const mensagensStore = useMensagensStore()

const menu = ref(null)
const selectedId = ref(null)

const onRightClick = (event, id) => {
	selectedId.value = id
	menu.value.show(event)
};

const messageOptions = ref([
	{
		label: 'Lida em ...',
		disabled: true,
		icon: 'pi pi-eye',

	},
	{
		separator: true,
	},
	{
		label: 'Excluir',
		icon: 'pi pi-trash',
	},
])

let readMessages = new Map()

let timeout = null

const markMessageAsRead = (id_mensagem) => {
	readMessages.set(id_mensagem)

	if (timeout) {
		clearTimeout(timeout)
	}

	timeout = setTimeout(() => {
		useMensagensStore().registerMessagesAsRead(Array.from(readMessages.keys()))
		readMessages.clear()
		timeout = null
	}, 2000)

}

const addObserver = (el, mensagem) => {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (mensagem.lida === 0 && mensagem.usuario_remetente !== useUsuarioStore().getUsuarioId) {
				if (entry.isIntersecting) {
					markMessageAsRead(mensagem.id_mensagem)
				}
				else {
					// Not visible
					if (entry.boundingClientRect.top < 0) {
						// Top of the element is above the viewport
						markMessageAsRead(mensagem.id_mensagem)
					}
				}
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

const timeMessageSeen = (time) => {
	return time ? new Date(time).toLocaleTimeString('pt-BR', {
		timeStyle: 'short',
	}) : 'Não lida'
}

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
	overflow-y: auto;
	overflow-x: hidden;

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