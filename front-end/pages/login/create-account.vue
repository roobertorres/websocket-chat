<template>
	<div class="create-account-page">
		<form @submit.prevent="createAccount()" class="flex flex-column">
			<div class="field">
				<label for="create-account-name">Seu nome</label>
				<InputText id="create-account-name" type="text" v-model="name" maxlength="45"
				           class="w-full mb-1" autocomplete="given-name"
				           required/>
				<small>Este será seu nome de exibição para os usuários</small>
			</div>
			<div class="field">
				<label for="create-account-email">E-mail</label>
				<InputText id="create-account-email" type="email" v-model="email" maxlength="100" class="w-full mb-1"
				           required autocomplete="email"/>
				<small>Será necessário confirmar este e-mail</small>
			</div>
			<div class="field">
				<label for="create-account-password">Senha</label>
				<Password v-model="password" maxlength="100" toggleMask class="w-full"
				          :inputProps="{ required: true, id: 'create-account-password', autocomplete: 'new-password', }"
				          :inputClass="'w-full'" :feedback="false"
				/>
			</div>
			<Button label="Criar conta" type="submit" :loading="processing" class="w-full field" rounded/>
			<NuxtLink :to="{name:'Fazer login'}">
				<Button label="Já tem uma conta?" text size="small" class="w-full" rounded/>
			</NuxtLink>
		</form>
		<Toast group="create-account" position="bottom-center"/>
	</div>
</template>

<script setup>
import { useLoginModalsStore } from "../../stores/loginModals.js";

definePageMeta({
	name: 'Criar conta',
})

const name = ref('')
const email = ref('')
const password = ref('')
const processing = ref(false)

const createAccount = async () => {
	useNuxtApp().$toast.removeGroup('create-account')
	processing.value = true

	try {
		await useNuxtApp().$axios.post('/criar-conta', {
			nome: name.value.trim(),
			email: email.value.trim(),
			senha: password.value.trim(),
		})

		useLoginModalsStore().setEmail(email.value.trim())

		name.value = ''
		email.value = ''
		password.value = ''

		await navigateTo({ name: 'Confirmar e-mail' })
	}
	catch (error) {
		console.error(error)
		useNuxtApp().$toast.add({
			group: 'create-account',
			severity: error.response ? 'info' : 'error',
			summary: 'Oops!',
			detail: error.response ? error.response.data.mensagem : 'Servidor indisponível',
		})
	}

	processing.value = false
}
</script>