<template>
	<div class="login-container surface-card p-5 flex flex-column gap-3 border-round w-auto :h-auto">
		<Login/>
		<LoginCriarConta/>
		<LoginConfirmEmail/>
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