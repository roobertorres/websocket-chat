
import TheNotificationPermission from '../components/TheNotificationPermission.vue';
<template>
    <div class="dashboard-layout flex h-full">
        <Toast position="bottom-center" />
        <TheSidebar />
        <div class="flex flex-column flex-1 bg-secondary p-4" style="min-height: 0">
            <NuxtPage />
        </div>
        <TheWebSocket />
        <TheNotificationsPermission />
    </div>
</template>

<style lang="scss" scoped>
.dashboard-layout {
    * {
        // color: var(--text-color) !important;
    }
}
</style>