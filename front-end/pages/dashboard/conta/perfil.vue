<template>
	<h3>{{ useRoute().name }}</h3>
	<Divider/>
	<div class="field">
		<label for="profile-photo">Foto de perfil</label>
		<ContaPerfilProfilePhoto @new-photo="newPhoto"/>
	</div>
	<div class="field">
		<label for="profile-name">Seu nome</label>
		<InputText id="profile-name" v-model="nome" minlength="1" maxlength="45" class="w-full"/>
	</div>
	<div class="field">
		<label for="profile-email">Seu e-mail</label>
		<InputText id="profile-email" v-model="email" type="email" minlength="1" maxlength="100" class="w-full"
		           disabled/>
	</div>
	<Divider/>
	<Button label="Salvar" type="submit"/>
</template>

<script setup>
definePageMeta({
	name: 'Perfil',
})

const nome = ref('')
const email = ref('')

const newPhoto = (photo) => {
	console.log(photo)
}
</script>
