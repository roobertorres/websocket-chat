<template>
	<div class="confirm-email-page">
		<div class="flex flex-column align-items-center gap-3">
			<h2 class="m-0">Confirmação de e-mail</h2>
			<small>{{ useLoginModalsStore().getEmail }}</small>
			<p class="text-center m-0">Um código foi enviado ao e-mail acima,<br>insira-o abaixo para ativar
				sua conta.</p>
			<form @submit.prevent="verifyEmail" class="flex flex-column gap-3">
				<div class="flex flex-column gap-3">
					<InputOtp v-model="code" :length="5" variant="outlined"/>
					<Button label="Verificar" type="submit" :loading="processing" class="field"
					        :disabled="code.length < 5"/>
				</div>
			</form>
			<div class="flex gap-3">
				<Button label="Reenviar código" text size="small" @click="resendCode"
				        :loading="resendingCode"/>
				<Button label="Cancelar" text size="small" @click="dimiss"/>
			</div>
		</div>
		<Toast group="confirm-email" position="bottom-center"/>
	</div>
</template>

<script setup>
definePageMeta({
	name: 'Confirmar e-mail',
})

const code = ref('')
const processing = ref(false)
const resendingCode = ref(false)

const resendCode = async () => {
	resendingCode.value = true
	useNuxtApp().$toast.removeAllGroups()

	try {
		await useNuxtApp().$axios.post('/email-verification/resend-confirmation-code', {
			email: useLoginModalsStore().email.trim(),
		})

		useNuxtApp().$toast.add({
			life: 5000,
			severity: 'success',
			summary: 'Código reenviado',
			detail: 'Verifique seu e-mail',
		})
	}
	catch (error) {
		useNuxtApp().$toast.add({
			group: 'confirm-email',
			life: 5000,
			severity: error.response ? 'info' : 'error',
			summary: error.response ? 'Oops!' : 'Erro de conexão',
			detail: error.response ? error.response.data.message : 'Servidor indisponível',
		})
	}

	resendingCode.value = false
}

const verifyEmail = async () => {
	if (code.value.length === 5) {
		processing.value = true

		try {
			await useNuxtApp().$axios.put('/email-verification/confirm-email', {
				email: useLoginModalsStore().email.trim(),
				code: code.value,
			})

			await navigateTo('/dashboard')
			useNuxtApp().$toast.add({
				group: 'confirm-email',
				life: 8000,
				severity: 'success',
				summary: 'Conta ativada!',
				detail: 'Obrigado por confirmar seu e-mail.',
			})

			useLoginModalsStore().confirmEmailVisible = false
		}
		catch (error) {
			useNuxtApp().$toast.removeAllGroups()
			useNuxtApp().$toast.add({
				group: 'confirm-email',
				life: 5000,
				severity: error.response ? 'info' : 'error',
				summary: error.response ? 'Oops!' : 'Erro de conexão',
				detail: error.response ? error.response.data.message : 'Servidor indisponível',
			})
		}

		processing.value = false
	}
}

const dimiss = () => {
	code.value = ''
	useLoginModalsStore().confirmEmailVisible = false
	useLoginModalsStore().loginVisible = true
}
</script>