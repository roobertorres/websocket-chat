import axios from '../custom/axios_instance.js'

export const useChatsStore = defineStore('chatsStore', {
    state: () => ({
        chats: new Map(),
        chatUsers: new Map(),
        buscandoChats: false,
    }),
    getters: {
        getChats: state => Array.from(state.chats.values()),
        getNotificacoesChat: state => id_chat => {
            const chat = state.chats.get(id_chat)
            return chat ? chat.notificacoes : 0
        },
    },
    actions: {
        limparNotificacoes(id_chat) {
            const chat = this.chats.get(id_chat)
            if (chat) {
                chat.notificacoes = 0
            }
        },
        adicionarNotificacao(notificacao) {
            const chat = this.chats.get(notificacao.chat_mensagem)
            if (chat) {
                chat.notificacoes++
            }
            else {
                this.chats.set(notificacao.chat_mensagem, {
                    id_chat: notificacao.chat_mensagem,
                    nome_usuario: notificacao.nome_usuario_remetente,
                    notificacoes: 1,
                })
            }
        },
        async buscarChats() {
            this.buscandoChats = true
            const { data } = await axios.get(`/chat`)

            data.forEach(item => {
                this.chats.set(item.id_chat, {
                    ...item,
                    notificacoes: 0,
                })

                this.chatUsers.set(item.id_usuario, {
                    id_usuario: item.id_usuario,
                    nome_usuario: item.nome_usuario,
                })
            })

            this.buscandoChats = false
        }
    }
})