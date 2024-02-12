import axios from '../custom/axios_instance.js'

// Store de mensagens para o chat atualmente aberto
export const useMensagensStore = defineStore('mensagensStore', {
    state: () => ({
        mensagens: new Map(),
        buscandoMensagens: false,
        totalMessagesDB: 0,
    }),
    getters: {
        getMensagens: state => Array.from(state.mensagens.values()),
        getMensagem: state => id_mensagem => state.mensagens.get(id_mensagem),
        getMessagesCount: state => state.mensagens.size,
        getMessagesCountDB: state => state.totalMessagesDB,
    },
    actions: {
        clearMessages() {
            this.mensagens.clear()
            this.totalMessagesDB = 0
        },
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
                    useNuxtApp().$toast.add({
                        severity: 'info',
                        summary: 'Oops!',
                        detail: error.response ? error.response.data.mensagem : 'O servidor está indisponível'
                    })
                }
            }
        },
        async buscarMensagens(id_chat = useRoute().params.id) {
            this.buscandoMensagens = true

            let last_id = this.getMensagens[0]?.id_mensagem || null
            console.log('Último id: ', last_id)

            try {
                const response = await axios.get(`/chat/mensagens/${id_chat}`, {
                    params: {
                        last: last_id
                    }
                })

                response.data.forEach(item => {
                    this.adicionarMensagem(item.id_mensagem, item)
                })

                this.totalMessagesDB = Number(response.headers['x-total-count'])
            }
            catch (err) {
                console.error(err)
                useNuxtApp().$toast.removeAllGroups()
                useNuxtApp().$toast.add({
                    severity: 'warn',
                    summary: 'Oops!',
                    detail: 'Não conseguimos buscar as mensagens no momento. Tente novamente mais tarde.',
                })
            }

            this.buscandoMensagens = false
        }
    }
})