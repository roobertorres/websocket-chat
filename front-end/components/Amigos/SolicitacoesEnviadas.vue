<template>
	<template v-if="sentFriendRequests.getSentFriendRequestsQuantity > 0">
		<Divider/>
		<div class="field flex align-items-center justify-content-between">
			<div>
				<h4 class="mt-0 mb-1">Solicitações enviadas</h4>
			</div>
		</div>
		<div class="flex flex-column gap-3">
			<div v-for="solicitacao in sentFriendRequests.getSentFriendRequests"
			     :key="solicitacao.id_solicitacao_amizade" class="flex gap-2 align-items-center">

				<Avatar v-if="solicitacao.foto" shape="circle"/>
				<Avatar v-else :label="solicitacao.nome_usuario_solicitado?.charAt(0).toUpperCase() || '?'"
				        shape="circle"/>

				<div class="flex flex-column flex-1 chat-details w-1rem">
					<p class="m-0 text-md w-full" :title="solicitacao.nome_usuario_solicitado">
						{{ solicitacao.nome_usuario_solicitado }}
					</p>
					<small class="text-gray-400 w-full" :title="solicitacao.email">
						{{ solicitacao.email_usuario_solicitado }}
					</small>
				</div>
				<div class="flex gap-2">
					<template v-if="solicitacao.processando">
						<ProgressSpinner class="w-2rem h-2rem m-1"/>
					</template>
					<template v-else>
						<Button label="Cancelar solicitação" outlined severity="danger" size="small"
						        @click="sentFriendRequests.cancelFriendshipRequest(solicitacao.id_solicitacao_amizade)"/>
					</template>
				</div>
			</div>
		</div>
	</template>
</template>

<script setup>
const sentFriendRequests = useSentFriendRequestsStore()

onMounted(() => {
	sentFriendRequests.fetchSentFriendRequests()
})

onBeforeUnmount(() => {
	sentFriendRequests.clearSentFriendRequests()
})
</script>