import axios from '../custom/axios_instance.js'

export const useAmigosStore = defineStore('amigosStore', {
    state: () => ({
        amigos: new Map(),
        solicitacoes_amizade: [],
        quantidade_solicitacoes: 0,
        notificacoes: [],
    }),
    getters: {
        getAmigos: (state) => Array.from(state.amigos.values()),
        getAmigo: (state) => id_usuario => state.amigos.get(id_usuario),
        getSolicitacoesAmizade: (state) => state.solicitacoes_amizade,
    },
    actions: {
        setFriendStatus(id, status) {
            const amigo = this.amigos.get(id)
            if (amigo) amigo.status = status
        },
        async buscarAmigos() {
            const { data } = await axios.get('/usuario/amigos')
            if (data) data.forEach(amigo => this.amigos.set(amigo.id_usuario, amigo))
        },
        async removerAmigo(id_usuario) {
            try {
                await axios.post(`/usuario/amigos/remover/${id_usuario}`)
                this.buscarAmigos()
            }
            catch (error) {
                console.error(error)
                throw error
            }
        },
        async aceitarSolicitacao(id) {
            this.solicitacoes_amizade.find(item => item.id_solicitacao_amizade === id).processando = true

            try {
                await axios.post(`/usuario/solicitacao-amizade/aceitar/${id}`)
                this.solicitacoes_amizade = this.solicitacoes_amizade.filter(item => item.id_solicitacao_amizade !== id)
                this.buscarAmigos()
            }
            catch (error) {
                console.error(error)
                this.solicitacoes_amizade.find(item => item.id_solicitacao_amizade === id).processando = false
                useNuxtApp().$toast.add({ severity: 'info', summary: 'Oops!', detail: error.response ? error.response.data.message : 'O servidor está indisponível' })
            }
        },
        async recusarSolicitacao(id) {
            this.solicitacoes_amizade.find(item => item.id_solicitacao_amizade === id).processando = true

            try {
                const response = await axios.post(`/usuario/solicitacao-amizade/recusar/${id}`)
                this.solicitacoes_amizade = this.solicitacoes_amizade.filter(item => item.id_solicitacao_amizade !== id)
                this.buscarAmigos()
            }
            catch (error) {
                console.error(error)
                this.solicitacoes_amizade.find(item => item.id_solicitacao_amizade === solicitacao.id).processando = false
                useNuxtApp().$toast.add({ severity: 'info', summary: 'Oops!', detail: error.response ? error.response.data.message : 'O servidor está indisponível' })
            }
        },
        async buscarSolicitacoes() {
            const { data } = await axios.get('/usuario/solicitacoes-amizade')

            this.solicitacoes_amizade = data.map(solicitacao => {
                solicitacao.processando = false
                return solicitacao
            })
        },
        async buscarQuantidadeSolicitacoes() {
            const { data } = await axios.get('/usuario/solicitacoes-amizade/quantidade')
            this.quantidade_solicitacoes = data.quantidade
        }
    }
})