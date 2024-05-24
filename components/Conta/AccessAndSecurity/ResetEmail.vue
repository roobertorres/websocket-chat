<template>
	<section>
		<div class="field">
			<h4 class="m-0 mb-2">E-mail</h4>
			<InputText type="email" disabled :value="useUsuarioStore().getUsuarioEmail" maxlength="100"
			           class="w-full mb-1"/>
			<small class="reset-email-button text-blue-400" @click="visible=true">Alterar e-mail</small>
		</div>
		<Dialog v-model:visible="visible" header="Alterar e-mail" modal :draggable="false">
			<div class="field">
				<label for="reset-email-new-email">Novo e-mail</label>
				<InputText id="reset-email-new-email" type="email" v-model="new_email" maxlength="100"
				           class="w-full mb-1"
				           required autocomplete="email"/>
			</div>
			<Button label="Prosseguir" class="w-full" @click="requestEmailReset" :loading="processing"/>
			<Toast group="reset-email" position="bottom-center"/>
		</Dialog>
	</section>
</template>

<script setup>
const visible = ref(false)
const new_email = ref('')
const processing = ref(false)

const requestEmailReset = async () => {
	processing.value = true
	useNuxtApp().$toast.removeGroup('reset-email')

	try {
		await useNuxtApp().$axios.post('/usuario/reset-email', {
			new_email: new_email.value,
		})
	}
	catch (error) {
		console.error(error)
		useNuxtApp().$toast.add({
			group: 'reset-email',
			summary: 'Oops!',
			detail: error.response ? error.response.data.mensagem : 'Servidor indisponível',
			severity: error.response ? 'info' : 'error',
		})
	}

	processing.value = false
}
</script>

<style scoped lang="scss">
.reset-email-button {
	cursor: pointer;
}
</style>