import axios from '../custom/axios_instance.js'

// Store de mensagens para o chat atualmente aberto
export const useMensagensStore = defineStore('mensagensStore', {
    state: () => ({
        mensagens: new Map(),
        buscandoMensagens: false,
    }),
    getters: {
        // retornar mensagens ordenadas pelo id asc
        getMensagens: state => state.mensagens,
        getMensagem: state => id_mensagem => state.mensagens.get(id_mensagem),
    },
    actions: {
        adicionarMensagem(id_mensagem, mensagem) {
            this.mensagens.set(id_mensagem, mensagem)
            this.mensagens = new Map([...this.mensagens.entries()].sort((a, b) => a[0] - b[0]))
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
                if (error.response) {
                    useNuxtApp().$toast.removeAllGroups()
                    useNuxtApp().$toast.add({ severity: 'info', summary: 'Oops!', detail: error.response ? error.response.data.mensagem : 'O servidor está indisponível' })
                }
            }
        },
        async fetchLastMessageID(id_chat) {
            const { data } = await axios.get(`/chat/mensagens/ultima-mensagem/${id_chat}`)
            return data.id_mensagem
        },
        async buscarMensagens(id_chat) {
            this.mensagens.clear()
            this.buscandoMensagens = true

            const id_ultima_mensagem = this.mensagens ? this.mensagens.get(this.mensagens.size - 1)?.id_mensagem : await this.fetchLastMessageID(id_chat)

            const { data } = await axios.get(`/chat/mensagens/${id_chat}`, {
                params: {
                    last: id_ultima_mensagem
                }
            })

            data.forEach(item => {
                this.adicionarMensagem(item.id_mensagem, item)
            })

            this.buscandoMensagens = false
        }
    }
})