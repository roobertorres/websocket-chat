<template>
	<div class="dashboard-layout flex h-full">
		<Toast position="bottom-center"/>
		<TheSidebar/>
		<div class="page-container">
			<NuxtPage class="dashboard-page p-3"/>
		</div>
		<TheWebSocket/>
		<TheNotificationsPermission/>
		<TheLoader/>
	</div>
</template>

<style lang="scss">
.dashboard-layout {
	overflow: hidden;

	.page-container {
		position: relative;
		flex: 1;
		display: flex;

		.dashboard-page {
			min-height: 0;
			overflow-y: auto;
			flex: 1;
		}
	}
}
</style>
<script setup>
</script>