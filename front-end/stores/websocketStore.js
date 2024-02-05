export const useWebsocketStore = defineStore('websocketStore', {
    state: () => ({
        socket: null,
        connected: false,
    }),
    getters: {
        isConnected: (state) => state.connected,
    },
    actions: {
        connect() {
            if (process.client) {
                this.socket = null
                this.socket = new WebSocket('ws://localhost:8080')
                console.log('🔌 Conectando ao websocket...')

                this.socket.onopen = async () => {
                    console.log('▶️ Conectado ao websocket')
                    this.connected = true
                }

                this.socket.onclose = async () => {
                    console.log('⏹️ Desconectado do websocket')
                    this.connected = false
                    new Promise(resolve => setTimeout(resolve, 2000))
                    if (this.socket) this.connect()
                }

                this.socket.onmessage = async (message) => {
                    console.log('📨 Mensagem recebida:', message)
                    let mensagem = await JSON.parse(message.data)

                    if (mensagem.grupo === 'FRIEND_ACTIVITY') {
                        useAmigosStore().setFriendStatus(mensagem.id_usuario, mensagem.tipo)
                    }

                    if (mensagem.grupo === 'LIMPAR_NOTIFICACOES_CHAT') {
                        useChatsStore().limparNotificacoes(mensagem.id_chat)
                    }

                    if (mensagem.grupo === 'MENSAGEM_RECEBIDA') {

                        if (mensagem.mensagem.chat_mensagem == useRoute().params.id) {
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
                        if (mensagem.mensagem.chat_mensagem == useRoute().params.id) {
                            useMensagensStore().adicionarMensagem(mensagem.mensagem.id_mensagem, {
                                ...mensagem.mensagem,
                                nome_usuario_remetente: useUsuarioStore().getNomeUsuario,
                            })
                        }
                    }

                    if (mensagem.grupo === 'TOKEN_INVALIDO') {
                        this.socket = null
                        useUsuarioStore().setUsuario(null)
                        return navigateTo('/login')
                    }

                    if (mensagem.grupo === 'SOLICITACAO_AMIZADE') {
                        useAmigosStore().notificacoes.push(mensagem.solicitacao)
                    }
                }
            }
        },
        close() {
            this.socket.close()
            this.socket = null
        },
    }
})