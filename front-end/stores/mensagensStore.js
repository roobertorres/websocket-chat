import axios from '../custom/axios_instance.js'
import { useChatsStore } from './chatsStore.js'

// Store de mensagens para o chat atualmente aberto
export const useMensagensStore = defineStore('mensagensStore', {
    state: () => ({
        mensagens: new Map(),
        buscandoMensagens: false,
    }),
    getters: {
        getMensagens: state => state.mensagens,
    },
    actions: {
        adicionarMensagem(id_mensagem, mensagem) {
            this.mensagens.set(id_mensagem, mensagem)
        },
        async enviarMensagem(id_chat, mensagem) {
            try {
                const { data } = await axios.post(`/chat/mensagens/${id_chat}`, {
                    'texto_mensagem': mensagem
                })
                return data
            }
            catch (error) {
                console.error(error)
                throw error
            }
        },
        async buscarMensagens(id_chat) {
            this.buscandoMensagens = true

            const { data } = await axios.get(`/chat/mensagens/${id_chat}`)

            data.forEach(item => {
                this.adicionarMensagem(item.id_mensagem, {
                    id_mensagem: item.id_mensagem,
                    texto_mensagem: item.texto_mensagem,
                    nome_usuario_remetente: item.nome_usuario_remetente,
                    data_hora_mensagem: item.data_hora_mensagem,
                    excluida: item.excluida,
                })
            })

            this.buscandoMensagens = false
        }
    }
})