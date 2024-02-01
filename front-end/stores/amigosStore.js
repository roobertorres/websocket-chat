import axios from '../custom/axios_instance.js'

export const useAmigosStore = defineStore('amigosStore', {
    state: () => ({
        amigos: [],
        solicitacoes_amizade: [],
        quantidade_solicitacoes: 0,
        notificacoes: [],
    }),
    getters: {
        getAmigos: (state) => state.amigos,
        getSolicitacoesAmizade: (state) => state.solicitacoes_amizade,
    },
    actions: {
        async buscarAmigos() {
            const { data } = await axios.get('/usuario/amigos')
            this.amigos = data
        },
        async removerAmigo(id_usuario) {
            try {
                const response = await axios.post(`/usuario/amigos/remover/${id_usuario}`)
                this.buscarAmigos()
            }
            catch (error) {
                console.error(error)
                throw error
            }
        },
        async aceitarSolicitacao(solicitacao) {
            this.solicitacoes_amizade.find(item => item.id_solicitacao_amizade === solicitacao.id_solicitacao_amizade).processando = true

            try {
                const response = await axios.post(`/usuario/solicitacao-amizade/aceitar/${solicitacao.id_solicitacao_amizade}`)
                this.solicitacoes_amizade = this.solicitacoes_amizade.filter(item => item.id_solicitacao_amizade !== solicitacao.id_solicitacao_amizade)
                this.buscarAmigos()
            }
            catch (error) {
                this.solicitacoes_amizade.find(item => item.id_solicitacao_amizade === solicitacao.id_solicitacao_amizade).processando = false
                console.error(error)
                throw error
            }
        },
        async recusarSolicitacao(id_solicitacao_amizade) {
            this.solicitacoes_amizade.find(item => item.id_solicitacao_amizade === id_solicitacao_amizade).processando = true

            try {
                const response = await axios.post(`/usuario/solicitacao-amizade/recusar/${id_solicitacao_amizade}`)
                this.solicitacoes_amizade = this.solicitacoes_amizade.filter(item => item.id_solicitacao_amizade !== id_solicitacao_amizade)
                this.buscarAmigos()
            }
            catch (error) {
                this.solicitacoes_amizade.find(item => item.id_solicitacao_amizade === solicitacao.id_solicitacao_amizade).processando = false
                console.error(error)
                throw error
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