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
                    let mensagem = await JSON.parse(message.data)
                    console.log('📨 Mensagem recebida:', mensagem)

                    if (mensagem.grupo === 'FRIEND_ACTIVITY') {
                        useAmigosStore().setFriendStatus(mensagem.id_usuario, mensagem.tipo)
                    }

                    if (mensagem.grupo === 'LIMPAR_NOTIFICACOES_CHAT') {
                        useChatsStore().limparNotificacoes(mensagem.id_chat)
                    }

                    if (mensagem.grupo === 'TOKEN_INVALIDO') {
                        this.socket = null
                        useUsuarioStore().setUsuario(null)
                        return navigateTo('/login')
                    }

                    if (mensagem.grupo === 'MENSAGEM') {
                        switch (mensagem.tipo) {
                            case 'RECEBIDA':
                                if (mensagem.mensagem.chat_mensagem == useRoute().params.id) {
                                    useMensagensStore().adicionarMensagem(mensagem.mensagem.id_mensagem, mensagem.mensagem)
                                }
                                else {
                                    new Notification(mensagem.mensagem.nome_usuario_remetente, {
                                        body: mensagem.mensagem.texto_mensagem,
                                    })

                                    useChatsStore().adicionarNotificacao(mensagem.mensagem)
                                }
                                break
                            case 'ENVIADA':
                                if (mensagem.mensagem.chat_mensagem == useRoute().params.id) {
                                    useMensagensStore().adicionarMensagem(mensagem.mensagem.id_mensagem, mensagem.mensagem)
                                }
                                break
                            case 'LIDA':
                                useMensagensStore().markMessagesAsRead(mensagem.mensagem.id_mensagem)
                                break
                        }
                    }

                    if (mensagem.grupo === 'SOLICITACAO_AMIZADE') {
                        switch (mensagem.tipo) {
                            case 'ENVIADA':
                                useSentFriendRequestsStore().addSentFriendRequest(mensagem.solicitacao)
                                break
                            case 'RECEBIDA':
                                useFriendRequestsStore().newFriendRequest(mensagem.solicitacao)
                                break
                            case 'ACEITA':
                                useSentFriendRequestsStore().removeSentFriendRequest(mensagem.solicitacao.id_solicitacao_amizade)
                                useAmigosStore().newFriend(mensagem.solicitacao)
                                break
                            case 'ACEITOU':
                                useFriendRequestsStore().removeFriendRequest(mensagem.solicitacao.id_solicitacao_amizade)
                                useAmigosStore().fetchFriends()
                                break
                            case 'RECUSOU':
                                useFriendRequestsStore().removeFriendRequest(mensagem.solicitacao.id_solicitacao_amizade)
                                break
                            case 'RECUSADA':
                                useSentFriendRequestsStore().removeSentFriendRequest(mensagem.solicitacao.id_solicitacao_amizade)
                                break
                            case 'CANCELAR_RECEBIDA':
                                useFriendRequestsStore().removeFriendRequest(mensagem.solicitacao.id_solicitacao_amizade)
                                break
                            case 'CANCELAR_ENVIADA':
                                useSentFriendRequestsStore().removeSentFriendRequest(mensagem.solicitacao.id_solicitacao_amizade)
                                break
                        }
                    }
                }
            }
        },
        close() {
            this.socket.close()
            this.socket = null
        },
        sendMessage(message) {
            this.socket.send(JSON.stringify(message))
        }
    }
})