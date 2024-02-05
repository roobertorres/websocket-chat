<template>
	<!--	<pre>{{ useChatsStore().getChats }}</pre>-->
	<NuxtLink v-for="chat in useChatsStore().getChats" :to="{
        path: `/dashboard/chat/${chat.id_chat}`,
    }" class="sidebar-link border-round" activeClass="surface-100 link-active">
		<div class="sidebar-link border-round flex align-items-center justify-content-between w-full gap-2 p-2">
			<div class="flex gap-2 align-items-center flex-1">
				<div>
					<Avatar :label="chat.nome_usuario?.charAt(0) || '?'" shape="circle" size="normal"/>
				</div>
				<div class="flex flex-column flex-1 chat-details w-1rem">
					<p class="m-0 text-md w-full" :title="chat.nome_usuario">
						{{ chat.nome_usuario || 'Usuário desconhecido' }}
					</p>
					<small v-if="useAmigosStore().getFriendStatus(chat.id_usuario) === 'ONLINE'"
					       style="color: var(--green-400)">
						Online
					</small>
					<small v-if="useAmigosStore().getFriendStatus(chat.id_usuario) === 'AUSENTE'"
					       style="color: var(--yellow-400)">
						Online
					</small>
					<small v-if="useAmigosStore().getFriendStatus(chat.id_usuario) === 'NAO_PERTURBE'"
					       style="color: var(--red-400)">
						Não perturbe
					</small>
				</div>
			</div>
			<Badge v-show="chat.notificacoes" :value="chat.notificacoes" severity="danger"/>
		</div>
	</NuxtLink>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.chat-details * {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>