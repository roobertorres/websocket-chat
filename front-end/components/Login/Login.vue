<template>
	<Dialog :visible="useLoginModalsStore().loginVisible" :draggable="false" :closable="false"
	        class="w-11 md:w-6 lg:w-25rem">
		<div class="flex flex-column align-items-center gap-4">
			<img src="/images/ws-chat-logo.svg" style="width: 12rem"/>
			<form @submit.prevent="login()" class="login-wrapper">
				<fieldset :disabled="processing" class="border-none">
					<div class="field">
						<label for="login-email">E-mail</label>
						<InputText type="text" maxlength="100" id="login-email" v-model="useLoginModalsStore().email"
						           class="w-full"/>
					</div>
					<div class="field">
						<label for="login-password">password</label>
						<Password type="password" maxlength="100" id="login-password" v-model="password" class="w-full"
						          :feedback="false"
						          toggleMask/>
					</div>
					<div v-show="error_message !== ''" ref="error_message_container" class="text-center field">
						<small class="p-error">{{ error_message }}</small>
					</div>
					<Button label="Fazer login" class="w-full field" type="submit" :loading="processing"/>
					<LoginCriarConta/>
				</fieldset>
			</form>
		</div>
	</Dialog>
</template>

<script setup>
const password = ref('')
const error_message = ref('')
const error_message_container = ref(null)
const processing = ref(false)

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
.leave-dashboard-enter-active,
.leave-dashboard-leave-active {
	transition: .7s;
	position: absolute;
	width: 100%;
}

.leave-dashboard-enter-from,
.leave-dashboard-leave-to {
	opacity: 0;
	transform: scale(0.9);
}

.leave-dashboard-enter-to,
.leave-dashboard-leave-from {

	opacity: 1;
	transform: scale(1);
}

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