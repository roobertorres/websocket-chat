<template>
    <Card>
        <template #content>
            <div class="field flex align-items-center justify-content-between">
                <h3 class="m-0">Gerenciar amigos</h3>
                <InputText v-if="amigos.getAmigos.length > 0" icon="pi pi-user" placeholder="Buscar usuário" size="small" />
            </div>
            <!-- <pre>{{ amigos.getAmigos }}</pre> -->
            <div class="flex flex-column gap-3">
                <template v-if="amigos.getAmigos.length > 0">
                    <div v-for="amigo in amigos.getAmigos" :key="amigo.id_usuario"
                        class="gap-2 border-2 surface-border border-round p-3 flex justify-content-between align-items-center">
                        <div class="flex flex-column gap-3">

                            <div class="flex gap-2 align-items-center">
                                <Avatar :label="amigo.nome_usuario.charAt(0) || '?'" size="normal" shape="circle" />
                                <div class="flex flex-column gap-1">
                                    <h4 class="m-0">{{ amigo.nome_usuario }}</h4>
                                    <small>{{ amigo.email }}</small>
                                </div>
                            </div>
                            <div class="flex align-items-center gap-1">
                                <Badge v-if="amigo.status === 'ONLINE'" value="Online" severity="success" />
                                <Badge v-else-if="amigo.status === 'AUSENTE'" value="Ausente" severity="warning" />
                                <Badge v-else-if="amigo.status === 'NAO_PERTURBE'" value="Não perturbe" severity="danger" />
                                <small style="color: lightgray">
                                    | Amigos desde {{ converterDataAmizade(amigo.amigos_desde) }}
                                </small>
                            </div>

                        </div>
                        <div class="flex gap-3">
                            <Button @click="abrirConversa(amigo.id_chat_privado)" v-tooltip.bottom="'Abrir conversa'"
                                icon="pi pi-comments" outlined rounded />
                            <Button icon="pi pi-trash" outlined rounded severity="danger"
                                v-tooltip.bottom="'Excluir amigo'" />
                        </div>
                    </div>
                </template>
                <div v-else class="flex flex-column align-items-center justify-content-center mt-3 py-2">
                    <i class="pi pi-users text-5xl text-gray-400" />
                    <p class="text-gray-400">Seus futuros amigos aparecerão aqui.</p>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
const amigos = useAmigosStore()

onMounted(async () => {
    await amigos.buscarAmigos()
})

const converterDataAmizade = (data) => {
    return new Date(data).toLocaleDateString()
}

const abrirConversa = async (id) => {
    await navigateTo({
        path: '/dashboard/chat',
        query: {
            id
        }
    })
}
</script>