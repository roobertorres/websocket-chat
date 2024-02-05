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
import { onBeforeUnmount } from 'vue';

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

	await useNuxtApp().$axios.post('/usuario/solicitar-amizade', {
		email: email.value
	})
		.then((response) => {
			erro.value = false
			retorno.value = response.data.mensagem
			email.value = ''
			timeOut()
			useSentFriendRequestsStore().fetchSentFriendRequests()
		})
		.catch((error) => {
			console.error(error)
			erro.value = true
			retorno.value = error.response ? error.response.data.mensagem : 'Servidor indisponível'
		})

	processando.value = false
}


</script>

<style lang="scss">
.p-success {
	color: var(--green-200);
}
</style>