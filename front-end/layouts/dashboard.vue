<template>
    <div class="dashboard-layout flex h-full">
        <Toast position="bottom-center" />
        <TheSidebar />
        <NuxtPage class="dashboard-page flex-1 p-4" style="min-height: 0" />
        <TheWebSocket />
        <TheNotificationsPermission />
    </div>
</template>

<style lang="scss">
.dashboard-layout {
    overflow: hidden;

    .dashboard-page {
        border: 1px solid red;
        overflow-y: auto;
    }
}
</style>