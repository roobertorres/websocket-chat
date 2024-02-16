<template>
	<form @submit.prevent="enviarMensagem()">
		<div class="chat-footer flex gap-2">
			<InputText type="text" maxlength="200" placeholder="Digite sua mensagem" v-model="mensagem"
			           id="campo-enviar-mensagem" class="flex-1" autofocus/>
			<Button type="submit" icon="pi pi-send" :loading="enviando" :disabled="!mensagem"/>
		</div>
	</form>
</template>

<script setup>
let mensagem = ref('')
let enviando = ref(false)

const enviarMensagem = async () => {
	enviando.value = true

	const id_chat = useRoute().params.id

	await useMensagensStore().enviarMensagem(id_chat, mensagem.value)
		.then(() => {
			mensagem.value = ''
			enviando.value = false
		})

	await nextTick()
	document.getElementById('campo-enviar-mensagem').focus()
}
</script>
