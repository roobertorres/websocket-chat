<template>
	<div class="dashboard-layout flex h-full">
		<Toast position="bottom-center"/>
		<TheSidebar/>
		<NuxtPage class="dashboard-page flex-1 p-3" style="min-height: 0"/>
		<TheWebSocket/>
		<TheNotificationsPermission/>
		<TheLoader/>
	</div>
</template>

<style lang="scss">
.dashboard-layout {
	overflow: hidden;

	.dashboard-page {
		overflow-y: auto;
	}
}
</style>