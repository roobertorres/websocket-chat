<template>
	<div class="text-center">
		<Button label="Criar conta" class="w-full" outlined size="small"
		        @click="useLoginModalsStore().createAccountVisible = true" dismissableMask/>
	</div>
	<Dialog :visible="useLoginModalsStore().createAccountVisible" header="Criar conta" :draggable="false"
	        :closable="false"
	        class="w-11 md:w-6 lg:w-25rem">
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
				<Password inputId="create-account-password" v-model="password" maxlength="100" class="w-full" toggleMask
				          promptLabel="Digite uma senha" weakLabel="Fraca" mediumLabel="Satisfatória"
				          strongLabel="Segura" :inputProps="{autocomplete: 'new-password'}"
				          required/>
			</div>
			<Button label="Criar conta!" type="submit" :loading="processing" class="w-full field"/>
			<Button label="Já tem uma conta?" text size="small" class="m-auto"
			        @click="useLoginModalsStore().createAccountVisible=false"/>
		</form>
	</Dialog>
</template>

<script setup>
const name = ref('')
const email = ref('')
const password = ref('')
const processing = ref(false)

const createAccount = async () => {
	useNuxtApp().$toast.removeAllGroups()
	processing.value = true

	try {
		await useNuxtApp().$axios.post('/criar-conta', {
			nome: name.value.trim(),
			email: email.value.trim(),
			senha: password.value.trim(),
		})

		await navigateTo('/dashboard')
	}
	catch (error) {
		console.error(error)
		useNuxtApp().$toast.add({
			group: 'create-account',
			severity: error.response ? 'info' : 'error',
			detail: error.response ? error.response.data.mensagem : 'Servidor indisponível',
		})
	}

	processing.value = false
}
</script>