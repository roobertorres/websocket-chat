<template>
	<Card>
		<template #content>
			<div class="field flex align-items-center justify-content-between">
				<h3 class="m-0">Gerenciar amigos</h3>
				<InputText v-if="useAmigosStore().getAmigos" icon="pi pi-user" placeholder="Buscar usuário"
				           size="small"/>
			</div>
			<pre>{{ useAmigosStore().getAmigos }}</pre>
			<div class="flex flex-column gap-3">
				<template v-if="useAmigosStore().getAmigos.length > 0">
					<div v-for="amigo in useAmigosStore().getAmigos" :key="amigo.id_usuario"
					     class="gap-2 border-2 surface-border border-round p-3 flex justify-content-between align-items-center">
						<div class="flex flex-column gap-3">

							<div class="flex gap-2 align-items-center">
								<Avatar :label="amigo.nome_usuario.charAt(0) || '?'" shape="circle" size="normal"/>
								<div class="flex flex-column gap-1">
									<h4 class="m-0">{{ amigo.nome_usuario }}</h4>
									<small>{{ amigo.email }}</small>
								</div>
							</div>
							<div class="flex align-items-center gap-1">
								<Badge v-if="amigo.status === 'ONLINE'" severity="success" value="Online"/>
								<Badge v-else-if="amigo.status === 'AUSENTE'" severity="warning" value="Ausente"/>
								<Badge v-else-if="amigo.status === 'NAO_PERTURBE'" severity="danger"
								       value="Não perturbe"/>
								<small style="color: lightgray">
									| Amigos desde {{ converterDataAmizade(amigo.amigos_desde) }}
								</small>
							</div>

						</div>
						<div class="flex gap-3">
							<Button v-tooltip.bottom="'Abrir conversa'"
							        icon="pi pi-comments"
							        outlined rounded @click="navigateTo(`chat/${amigo.id_chat_privado}`)"/>
							<Button v-tooltip.bottom="'Excluir amigo'" icon="pi pi-trash" outlined rounded
							        severity="danger"/>
						</div>
					</div>
				</template>
				<div v-else class="flex flex-column align-items-center justify-content-center mt-3 py-2">
					<i class="pi pi-users text-5xl text-gray-400"/>
					<p class="text-gray-400">Seus futuros amigos aparecerão aqui.</p>
				</div>
			</div>
		</template>
	</Card>
</template>

<script setup>

onMounted(async () => {
	await useAmigosStore().buscarAmigos()
})

const converterDataAmizade = (data) => {
	return new Date(data).toLocaleDateString()
}
</script>