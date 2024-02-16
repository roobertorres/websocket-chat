<template>
	<Card>
		<template #content>
			<div class="field">
				<h3 class="mt-0">Adicionar amigos</h3>
			</div>
			<form @submit.prevent="solicitarAmizade()">
				<div class="flex gap-2">
					<InputText id="adicionar-amigo-email" v-model="email" :class="{ 'p-invalid': erro }"
					           :disabled="processando"
					           class="flex-1" maxlength="100" placeholder="E-mail do contato"
					           required
					           type="email"/>
					<Button :loading="processando" label="Solicitar" type="submit"/>
				</div>
			</form>
			<p v-if="retorno !== ''" :class="{ 'p-success': !erro }" class="mb-0 p-error">
				{{ retorno }}
			</p>
			<AmigosSolicitacoesEnviadas/>
		</template>
	</Card>
</template>

<script setup>
const email = ref('')
const retorno = ref('')
const erro = ref(false)
const processando = ref(false)

const timeOut = () => setTimeout(() => {
	retorno.value = ''
}, 5000)

const solicitarAmizade = async () => {
	clearTimeout(timeOut())
	processando.value = true

	try {
		const { data } = await useNuxtApp().$axios.post('/usuario/solicitar-amizade', {
			'email': email.value
		})

		erro.value = false
		retorno.value = data.mensagem
		email.value = ''
		timeOut()
		useSentFriendRequestsStore().fetchSentFriendRequests()
	}
	catch (error) {
		console.error('Erro ao solicitar amizade: ', error)
		erro.value = true
		retorno.value = error.response ? error.response.data.mensagem : 'Não conseguimos acessar o servidor neste momento.'
	}

	processando.value = false
}
</script>

<style lang="scss">
.p-success {
	color: var(--green-200);
}
</style>