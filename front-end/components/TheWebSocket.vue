<script setup>

const websocket = useWebsocketStore()
const desconectado = ref(false)

onMounted(async () => {

    websocket.socket = null

    if (process.client && !websocket.socket) {
        websocket.socket = new WebSocket('ws://localhost:8080')

        websocket.socket.onopen = async () => {
            console.log('▶️ Conectado ao websocket')
        }

        websocket.socket.onclose = async () => {
            console.log('⏹️ Desconectado do websocket')
            desconectado.value = true

            while (websocket.socket.readyState !== 1) {

                while (websocket.socket.readyState === 3) {
                    console.log('🔄 Tentando reconectar ao websocket')
                    websocket.socket = new WebSocket('ws://localhost:8080')
                }

                await new Promise((resolve) => setTimeout(() => { resolve() }, 5000))
            }

            if (websocket.socket.readyState === 1) desconectado.value = false
        }

        websocket.socket.onmessage = async (message) => {
            console.log('📨 Mensagem recebida:', message)

            let mensagem = await JSON.parse(message.data)

            if (mensagem.grupo === 'FRIEND_ACTIVITY') {
                console.log(mensagem.id_usuario, mensagem.tipo)
                useAmigosStore().setFriendStatus(mensagem.id_usuario, mensagem.tipo)
            }

            if (mensagem.grupo === 'LIMPAR_NOTIFICACOES_CHAT') {
                useChatsStore().limparNotificacoes(mensagem.id_chat)
            }

            if (mensagem.grupo === 'MENSAGEM_RECEBIDA') {

                if (useRoute().path === '/dashboard/chat' && (mensagem.mensagem.chat_mensagem == useRoute().query.id)) {
                    useMensagensStore().adicionarMensagem(mensagem.mensagem.id_mensagem, mensagem.mensagem)
                }
                else {

                    new Notification(mensagem.mensagem.nome_usuario_remetente, {
                        body: mensagem.mensagem.texto_mensagem,
                        icon: '/users/roberto-torres.png'
                    })

                    useChatsStore().adicionarNotificacao(mensagem.mensagem)
                }
            }

            if (mensagem.grupo === 'MENSAGEM_ENVIADA') {
                if (useRoute().path === '/dashboard/chat' && (mensagem.mensagem.chat_mensagem == useRoute().query.id)) {
                    useMensagensStore().adicionarMensagem(mensagem.mensagem.id_mensagem, {
                        ...mensagem.mensagem,
                        nome_usuario_remetente: useUsuarioStore().getNomeUsuario,
                    })
                }
            }

            if (mensagem.grupo === 'TOKEN_INVALIDO') {
                websocket.socket = null
                useUsuarioStore().setUsuario(null)
                return navigateTo('/login')
            }

            if (mensagem.grupo === 'SOLICITACAO_AMIZADE') {
                const amigosStore = useAmigosStore()
                amigosStore.notificacoes.push(mensagem.solicitacao)
            }
        }
    }
})
</script>

<template>
    <Dialog v-model:visible="desconectado" modal position="bottom" :closable="false" :showHeader="false" :draggable="false"
        :resizable="false">
        <div class="flex flex-column align-items-center gap-3 px-3 pt-5 text-center">
            <i class="pi pi-spin pi-spinner text-3xl" />
            <div>
                <h3 class="m-0">Conexão perdida</h3>
                <p class="m-0 mt-2">Tentando reconectar...</p>
            </div>
            <NuxtLink to="/logout">
                <p class="m-0 p-error">Sair</p>
            </NuxtLink>
        </div>
    </Dialog>
</template>