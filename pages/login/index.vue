<template>
	<div class="login-page">
		<form @submit.prevent="login()">
			<fieldset :disabled="processing" class="border-none p-0 m-0">
				<div class="field">
					<label for="login-email">E-mail</label>
					<InputText type="text" maxlength="100" id="login-email"
					           v-model="loginModals.email" autocomplete="email"
					           class="w-full"/>
				</div>
				<div class="field">
					<label for="login-password">Senha</label>
					<Password type="password" maxlength="100" id="login-password" v-model="password"
					          class="w-full mb-1"
					          :feedback="false"
					          :inputProps="{required: true, id: 'login-password', autocomplete: 'current-password',}"
					          :inputClass="'w-full'"
					          toggleMask/>
					<small style="cursor: pointer">Esqueceu sua senha?</small>
				</div>
				<div v-show="error_message !== ''" ref="error_message_container" class="text-center field">
					<small class="p-error">{{ error_message }}</small>
				</div>
				<div class="flex gap-2 justify-content-end">
					<NuxtLink :to="{name: 'Criar conta'}">
						<Button label="Criar conta" text rounded/>
					</NuxtLink>

					<Button label="Acessar" type="submit" :loading="processing" rounded/>
				</div>
			</fieldset>
		</form>
	</div>
</template>

<script setup>
definePageMeta({
	name: 'Fazer login',
})

const password = ref('')
const error_message = ref('')
const error_message_container = ref(null)
const processing = ref(false)

const loginModals = useLoginModalsStore()

const login = async () => {
	processing.value = true

	try {
		const { data } = await useNuxtApp().$axios.post('/login', {
			email: useLoginModalsStore().email.trim(),
			senha: password.value,
		})

		error_message.value = ''

		if (data.requires_confirmation) {
			useLoginModalsStore().loginVisible = false
			useLoginModalsStore().confirmEmailVisible = true
		}
		else {
			await navigateTo({ name: 'dashboard' })
		}
	}
	catch (error) {
		console.error(error)
		error_message_container.value.classList.add('shake')
		error_message.value = error.response ? error.response.data.mensagem : 'Servidor indisponível'

		setTimeout(() => {
			error_message_container.value.classList.remove('shake')
		}, 500)
	}

	processing.value = false
}
</script>
<style lang="scss">
.shake {
	animation: shake 0.5s;
}

@keyframes shake {
	0% {
		transform: translateX(0)
	}

	25% {
		transform: translateX(5px)
	}

	50% {
		transform: translateX(-5px)
	}

	75% {
		transform: translateX(5px)
	}

	100% {
		transform: translateX(0)
	}
}
</style>