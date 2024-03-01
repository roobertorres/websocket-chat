<template>
	<Dialog :visible="useLoginModalsStore().confirmEmailVisible" :draggable="false"
	        :closable="false"
	        class="w-11 md:w-6 lg:w-25rem">
		<div class="flex flex-column align-items-center">
			<h2 class="m-0">Confirmação de e-mail</h2>
			<p class="text-center">Um código foi enviado ao seu e-mail,<br>insira-o abaixo para ativar
				sua conta.</p>
			<div class="flex flex-column gap-3">
				<InputOtp v-model="code" :length="5" variant="outlined"/>
				<Button label="Verificar" @click="verifyEmail" :loading="processing" class="field"/>
			</div>
			<div class="flex gap-3">

				<Button label="Reenviar código" text size="small" @click="resendCode"
				        :loading="resendingCode"/>
				<Button label="Cancelar" text size="small" @click="dimiss"/>
			</div>
		</div>
	</Dialog>
</template>

<script setup>
const code = ref('')
const processing = ref(false)
const resendingCode = ref(false)

const resendCode = async () => {
	resendingCode.value = true

	try {
		await useNuxtApp().$axios.post('/email-verification/resend-confirmation-code', {
			email: useLoginModalsStore().email.trim(),
		})

		useNuxtApp().$toast.add({
			life: 5000,
			severity: 'success',
			summary: 'Código reenviado',
		})
	}
	catch (error) {
		useNuxtApp().$toast.add({
			life: 5000,
			severity: error.response ? 'info' : 'error',
			summary: error.response ? 'Oops!' : 'Erro de conexão',
			detail: error.response ? error.response.data.message : 'Servidor indisponível',
		})
	}

	resendingCode.value = false
}

const verifyEmail = async () => {
	processing.value = true

	try {
		await useNuxtApp().$axios.put('/email-verification/confirm-email', {
			email: useLoginModalsStore().email.trim(),
			code: code.value,
		})

		await navigateTo('/dashboard')
	}
	catch (error) {
		useNuxtApp().$toast.add({
			life: 5000,
			severity: error.response ? 'info' : 'error',
			summary: error.response ? 'Oops!' : 'Erro de conexão',
			detail: error.response ? error.response.data.message : 'Servidor indisponível',
		})
	}

	processing.value = false

}

const dimiss = () => {
	code.value = ''
	useLoginModalsStore().confirmEmailVisible = false
	useLoginModalsStore().loginVisible = true
}
</script>