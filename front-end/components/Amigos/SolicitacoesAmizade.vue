<template>
	<Card v-if="friendRequests.getFriendRequestsQuantity > 0">
		<template #content>
			<div class="field flex align-items-center justify-content-between">
				<div>
					<h3 class="mt-0 mb-1">Solicitações de amizade</h3>
					<small>Veja as solicitações de amizade pendentes</small>
				</div>
				<Badge severity="danger" :value="friendRequests.getSolicitacoesAmizade.length"/>
			</div>
			<Divider class="mt-1"/>
			<div v-for="solicitacao in friendRequests.getSolicitacoesAmizade"
			     :key="solicitacao.id_solicitacao_amizade"
			     class="flex gap-2 align-items-center">

				<Avatar v-if="solicitacao.foto" shape="circle"/>
				<Avatar v-else :label="solicitacao.nome_usuario.charAt(0).toUpperCase()" shape="circle"/>

				<div class="flex flex-column flex-1 chat-details w-1rem">
					<p class="m-0 text-md w-full" :title="solicitacao.nome_usuario">
						{{ solicitacao.nome_usuario }}
					</p>
					<small class="text-gray-400 w-full" :title="solicitacao.email">
						{{ solicitacao.email }}
					</small>
				</div>
				<div class="flex gap-2">
					<template v-if="solicitacao.processando">
						<ProgressSpinner class="w-2rem h-2rem m-1"/>
					</template>
					<template v-else>
						<Button label="Aceitar" outlined severity="success" size="small"
						        @click="friendRequests.acceptFriendRequest(solicitacao.id_solicitacao_amizade)"/>
						<Button label="Recusar" outlined severity="danger" size="small"
						        @click="friendRequests.rejectFriendRequest(solicitacao.id_solicitacao_amizade)"/>
					</template>
				</div>
			</div>
		</template>
	</Card>
</template>

<script setup>
const friendRequests = useFriendRequestsStore()

onMounted(() => {
	friendRequests.fetchFriendRequests()
})
</script>