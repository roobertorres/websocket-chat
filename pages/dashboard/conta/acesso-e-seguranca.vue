<template>
	<div class="access-and-security-page">
		<h3>{{ useRoute().name }}</h3>
		<Divider/>
		<ContaAccessAndSecurityResetEmail/>
		<Divider/>
		<ContaAccessAndSecurityResetPassword/>
		<Divider/>
		<ContaAccessAndSecurityDeleteAccount/>
	</div>
</template>

<script setup>
definePageMeta({
	name: 'Acesso e Segurança',
	// pageTransition: 'page-transition-fade',
})

const email = ref('email@dominio.com.br')
</script>