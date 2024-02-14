<script setup>

onMounted(async () => {
	useWebsocketStore().connect()
})

onBeforeUnmount(() => {
	useWebsocketStore().close()
})
</script>

<template>
	<Dialog :visible="!useWebsocketStore().isConnected" modal position="bottom"
	        :closable="false"
	        :showHeader="false"
	        :draggable="false"
	        :resizable="false">
		<div class="flex flex-column align-items-center gap-3 px-3 pt-5 text-center">
			<i class="pi pi-spin pi-spinner text-3xl"/>
			<div>
				<h3 class="m-0">Conexão perdida</h3>
				<p class="m-0 mt-2">Tentando reconectar...</p>
			</div>
			<NuxtLink to="/logout">
				<p class="m-0 p-error">Sair</p>
			</NuxtLink>
		</div>
	</Dialog>
</template>