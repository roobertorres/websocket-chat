<template>
	<div class="login-container surface-card p-5 flex flex-column gap-3 border-round h-full w-full md:w-auto md:h-auto">
		<form @submit.prevent="login()" class="login-wrapper">
			<fieldset :disabled="processando" class="border-none">
				<h1 class="mt-0">WS</h1>
				<div class="field">
					<label for="email">E-mail</label>
					<InputText type="text" maxlength="100" id="email" v-model="email" class="w-full"/>
				</div>
				<div class="field">
					<label for="senha">Senha</label>
					<Password type="senha" maxlength="100" id="senha" v-model="senha" class="w-full" :feedback="false"
					          toggleMask/>
				</div>
				<div v-show="mensagem_erro !== ''" ref="mensagem_erro" class="text-center field">
					<small class="p-error">{{ mensagem_erro }}</small>
				</div>
				<Button label="Fazer login" class="w-full field" type="submit" :loading="processando"/>
				<LoginCriarConta/>
			</fieldset>
		</form>
	</div>
</template>

<script setup>
definePageMeta({
	layout: 'login',
	layoutTransition: {
		name: 'leave-dashboard',
	}
})
</script>

<script>

export default {
	data() {
		return {
			socket: null,
			email: '',
			senha: '',
			mensagem_erro: '',
			processando: false,
			device: null,
		}
	},
	methods: {
		async login() {
			this.processando = true

			await this.$axios.post('/login', {
				email: this.email,
				senha: this.senha
			})
				.then(async (response) => {
					this.mensagem_erro = ''
					navigateTo('/dashboard')
				})
				.catch((error) => {
					console.error(error)
					this.$refs.mensagem_erro.classList.add('shake')
					this.mensagem_erro = error.response ? error.response.data.mensagem : 'Servidor indisponível'

					setTimeout(() => {
						this.$refs.mensagem_erro.classList.remove('shake')
					}, 500)
				})

			this.processando = false
		}
	},
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