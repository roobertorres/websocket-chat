<template>
    <div class="dashboard-layout flex h-full">
        <Toast position="bottom-center"/>
        <TheSidebar/>
        <div class="page-container">
            <NuxtPage class="p-3 flex-1" style="min-height: 0; overflow-y: auto"/>
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
    }
}
</style>
<script setup>
</script>