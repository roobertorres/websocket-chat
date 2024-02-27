<template>
	<div class="w-full flex flex-column gap-2">
		<div class="surface-card pl-3 pr-2 py-3 border-round flex align-items-center gap-2 justify-content-between">
			<div class="flex-1 flex gap-2 align-items-center">
				<Avatar
					:label="useUsuarioStore().getUsuarioPhoto? null :useUsuarioStore().getNomeUsuario?.charAt(0) || '?'"
					:image="useUsuarioStore().getUsuarioPhoto"
					shape="circle"/>
				<div class="flex flex-column align-items-start">
					<p class="m-0 w-8rem" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
						{{ useUsuarioStore().getNomeUsuario || '?' }}
					</p>
					<small style="color: var(--green-500)">Online</small>
				</div>
			</div>
			<Button @click="logout()" size="small" icon="pi pi-sign-out" severity="danger" text/>
		</div>
	</div>
</template>

<script setup>
const logout = async () => {
	await navigateTo('/logout')
}
</script>