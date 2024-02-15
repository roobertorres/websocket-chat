<template>
	<div class="text-center">
		<Button label="Criar conta" class="w-full" outlined size="small" @click="visivel = true" dismissableMask/>
	</div>
	<Dialog v-model:visible="visivel" header="Criar conta" modal :draggable="false" class="w-11 md:w-6 lg:w-25rem">
		<form @submit.prevent="createAccount()">
			<div class="field">
				<label for="criar-conta-nome">Nome</label>
				<InputText id="criar-conta-nome" type="text" v-model="nome" maxlength="45" class="w-full" required/>
			</div>
			<div class="field">
				<label for="criar-conta-email">E-mail</label>
				<InputText id="criar-conta-email" type="email" v-model="email" maxlength="100" class="w-full" required/>
			</div>
			<div class="field">
				<label for="criar-conta-senha">Senha</label>
				<Password id="criar-conta-senha" v-model="senha" maxlength="100" class="w-full" toggleMask
				          promptLabel="Digite uma senha" weakLabel="Fraca" mediumLabel="Satisfatória"
				          strongLabel="Segura"
				          required/>
			</div>
			<Button label="Criar conta!" type="submit" :loading="processando" class="w-full field"/>
			<div class="text-center">
				<InlineMessage v-show="mensagem_erro !== ''" severity="info">{{ mensagem_erro }}</InlineMessage>
			</div>
		</form>
	</Dialog>
</template>

<script setup>
const nome = ref('')
const email = ref('')
const senha = ref('')
const visivel = ref(false)
const mensagem_erro = ref('')
const processando = ref(false)

const createAccount = async () => {
	useNuxtApp().$toast.removeAllGroups()
	processando.value = true

	try {
		await useNuxtApp().$axios.post('/criar-conta', {
			nome: nome.value.trim(),
			email: email.value.trim(),
			senha: senha.value.trim(),
		})

		navigateTo('/dashboard')
	}
	catch (error) {
		if (error.response) {
			mensagem_erro.value = error.response.data.mensagem
		}
		else {
			console.error(error)
		}
	}

	processando.value = false
}
</script>