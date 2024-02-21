import axios from '../custom/axios_instance.js'
import { useWebsocketStore } from "./websocketStore.js";

// Store de mensagens para o chat atualmente aberto
export const useMensagensStore = defineStore('mensagensStore', {
    state: () => ({
        chatParticipants: new Map(),
        mensagens: new Map(),
        buscandoMensagens: false,
        totalMessagesDB: 0,
        lastReadMessage: null,
    }),
    getters: {
        getChatParticipant: state => id_usuario => state.chatParticipants.get(id_usuario),
        getMensagens: state => Array.from(state.mensagens.values()),
        getMensagem: state => id_mensagem => state.mensagens.get(id_mensagem),
        getMessagesCount: state => state.mensagens.size,
        getMessagesCountDB: state => state.totalMessagesDB,
        getLastReadMessage: state => state.lastReadMessage,
    },
    actions: {
        markMessagesAsRead(last_message_id) {
            this.lastReadMessage = last_message_id
        },
        async registerMessagesAsRead(messages) {
            useWebsocketStore().sendMessage({
                grupo: 'MENSAGEM',
                tipo: 'LIDA',
                mensagens: messages,
            })
            
            console.log(messages)
        },
        async enviarMensagem(id_chat, mensagem) {
            try {
                const { data } = await axios.post(`/chat/mensagens/${id_chat}`, {
                    'texto_mensagem': mensagem
                })

                this.adicionarMensagem(data.id_mensagem, {
                    ...data,
                    id_usuario_remetente: useUsuarioStore().getIdUsuario,
                    excluida: 0,
                    lida: 1,
                })
            }
            catch (error) {
                useNuxtApp().$toast.removeAllGroups()
                useNuxtApp().$toast.add({
                    severity: 'warn',
                    summary: 'Oops!',
                    detail: error.response ? error.response.data.mensagem : 'O servidor está indisponível'
                })
                throw new Error()
            }
        },
        async buscarMensagens(clear_notifications = false) {
            const id_chat = useRoute().params.id
            this.buscandoMensagens = true

            let last_id = this.getMensagens[0]?.id_mensagem || null

            try {
                const response = await axios.get(`/chat/mensagens/${id_chat}`, {
                    params: {
                        last: last_id,
                        clear_notifications: clear_notifications ? true : null
                    }
                })

                response.data.forEach(item => {
                    this.adicionarMensagem(item.id_mensagem, item)
                })

                this.totalMessagesDB = Number(response.headers['x-total-count'])
            }
            catch (error) {
                console.error(error)
                useNuxtApp().$toast.removeAllGroups()

                if (error.response.status === 404) {
                    await navigateTo('/dashboard')

                    useNuxtApp().$toast.add({
                        severity: 'info',
                        summary: 'Conversa não encontrada',
                        detail: 'A conversa solicitada não existe. Levamos você para a página inicial :)',
                    })
                }
                else {
                    useNuxtApp().$toast.add({
                        severity: 'warn',
                        summary: 'Oops!',
                        detail: 'Não conseguimos buscar as mensagens no momento. Tente novamente mais tarde.',
                    })
                }
            }

            this.buscandoMensagens = false
        },
        adicionarMensagem(id_mensagem, mensagem) {
            const exists = this.mensagens.get(id_mensagem)
            if (exists) return

            this.mensagens.set(id_mensagem, mensagem)
            this.mensagens = new Map([...this.mensagens.entries()].sort((a, b) => a[0] - b[0]))
        },
        async fetchChat() {
            const id_chat = useRoute().params.id

            try {
                const { data } = await axios.get(`/chat/participantes/${id_chat}`)
                this.chatParticipants.clear()

                data.forEach(participant => {
                    this.chatParticipants.set(participant.id_usuario, participant)
                })

                this.mensagens.clear()
                await this.buscarMensagens(true)
            }
            catch (error) {
                console.error(error)
            }
        },
        clearMessages() {
            this.mensagens.clear()
            this.totalMessagesDB = 0
        },
    }
})