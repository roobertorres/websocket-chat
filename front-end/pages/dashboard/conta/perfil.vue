<template>
	<div>
		<h3>{{ useRoute().name }}</h3>
		<Divider/>
		<div class="field">
			<label for="profile-photo">Foto de perfil</label>
			<ContaPerfilProfilePhoto :fetching="fetching" :photo="photo" @new-photo="newPhoto"/>
		</div>
		<form @submit.prevent="saveProfile">
			<div class="field">
				<label for="profile-name">Seu nome</label>
				<InputText id="profile-name" v-model="name" class="w-full" maxlength="45" minlength="1" required/>
			</div>
			<div class="field">
				<label for="profile-email">Seu e-mail</label>
				<InputText id="profile-email" v-model="email" :loading="fetching" class="w-full" disabled
				           maxlength="100"
				           minlength="1" required type="email"/>
			</div>
			<Divider/>
			<div class="flex gap-2">
				<Button :disabled="sameInformation" :loading="processing" label="Salvar" type="submit"/>
				<Button :disabled="sameInformation || processing" label="Resetar" text
				        type="reset" @click="resetInformation"/>
			</div>
		</form>
	</div>
</template>

<script setup>
definePageMeta({
	name: 'Perfil',
	pageTransition: 'page-transition-fade',
})

const name = ref('')
const email = ref('')
const photo = ref('')
const processing = ref(false)
const fetching = ref(true)

onMounted(async () => {
	try {
		const { data } = await useNuxtApp().$axios.get('/account/profile')
		name.value = data.name
		email.value = data.email
		photo.value = data.photo
	}
	catch (error) {
		console.error(error)
	}

	fetching.value = false
})

const saveProfile = async () => {
	processing.value = true

	try {
		await useNuxtApp().$axios.patch('/account/profile', {
			name: name.value,
			photo: photo.value,
		})
		useUsuarioStore().setNomeUsuario(name.value)
		useUsuarioStore().setUsuarioPhoto(photo.value)

		useNuxtApp().$toast.removeAllGroups()
		useNuxtApp().$toast.add({
			severity: 'success',
			summary: 'Sucesso!',
			detail: 'Atualizamos seu perfil',
			life: 4000,
		})
	}
	catch (error) {
		console.error(error)
	}

	processing.value = false
}

const sameInformation = computed(() => {
	const same_name = name.value === useUsuarioStore().getNomeUsuario
	const same_email = email.value === useUsuarioStore().getUsuarioEmail
	const same_photo = photo.value === useUsuarioStore().getUsuarioPhoto
	return same_name && same_email && same_photo
})

const resetInformation = () => {
	name.value = useUsuarioStore().getNomeUsuario
	email.value = useUsuarioStore().getUsuarioEmail
	photo.value = useUsuarioStore().getUsuarioPhoto
}

const newPhoto = (new_photo) => {
	photo.value = new_photo
}
</script>
