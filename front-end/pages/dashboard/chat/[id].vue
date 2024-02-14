<template>
	<div class="chat-page flex-1 flex flex-column gap-3" style="min-height: 0">
		<div class="chat-header flex gap-3 align-items-center justify-content-between">
			<div class="chat-header flex gap-3 align-items-center ">
				<Avatar :label="chatUserNameData?.nome_usuario.charAt(0) || '?'" shape="circle" size="large"/>
				<div>
					<h3 class="m-0">{{ chatUserNameData?.nome_usuario || 'Carregando...' }}</h3>
					<small class="">{{ chatUserNameData?.email || 'Carregando...' }}</small>
				</div>
			</div>
			<div>
				<small class="m-0">Online agora</small>
			</div>
		</div>
		<div class="flex-1 surface-100 border-round flex flex-column shadow-3 p-3 gap-4 shadow-5"
		     style="overflow: hidden">
			<ChatMensagens/>
			<ChatCampoEnviarMensagem/>
		</div>
	</div>
</template>

<script setup>
const mensagensStore = useMensagensStore()

const chatUserNameData = computed(() => {
	const chatUser = Array.from(mensagensStore.chatParticipants.values()).find(item => item.id_usuario !== useUsuarioStore().getUsuarioId)
	return chatUser
})

definePageMeta({
	layout: 'dashboard'
})
</script>