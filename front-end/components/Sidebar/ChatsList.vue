<template>
    <!-- <pre>{{ useChatsStore().getChats }}</pre> -->
    <NuxtLink v-for="chat in useChatsStore().getChats" :to="{
        path: '/dashboard/chat',
        query: {
            id: chat[1].id_chat
        }
    }" class="sidebar-link border-round" activeClass="surface-100 link-active">
        <div class="sidebar-link border-round flex align-items-center justify-content-between w-full gap-2 p-2">
            <div class="flex gap-2 align-items-center flex-1">
                <div>
                    <Avatar :label="chat[1].nome_usuario?.charAt(0) || '?'" shape="circle" size="normal" />
                </div>
                <div class="flex flex-column flex-1 chat-details w-1rem">
                    <p class="m-0 text-md w-full" :title="chat[1].nome_usuario">
                        {{ chat[1].nome_usuario || 'Usuário desconhecido' }}
                    </p>
                    <small style="color: var(--green-400)">Online</small>
                </div>
            </div>
            <Badge v-show="chat[1].notificacoes" :value="chat[1].notificacoes" severity="danger" />
        </div>
    </NuxtLink>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    useChatsStore().buscarChats()
})
</script>

<style lang="scss" scoped>
.chat-details * {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>