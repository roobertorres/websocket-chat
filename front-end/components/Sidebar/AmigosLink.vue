<template>
	<NuxtLink :to="{name:'dashboard-amigos'}" activeClass="surface-100 link-active"
	          class="sidebar-link flex align-items-center py-3 border-round px-3 gap-3 justify-content-between">
		<div class="flex align-items-center gap-3">
			<i class="pi pi-users"/>
			<p class="m-0 text-md">Amigos</p>
		</div>
		<Badge v-if="friends.getFriendRequestQuantity > 0" :value="friends.getFriendRequestQuantity" severity="danger"/>
	</NuxtLink>
</template>

<script setup>
const friends = useFriendRequestsStore()

onMounted(async () => {
	await friends.fetchFriendRequestsQuantity()
})
</script>