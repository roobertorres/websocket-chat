import axios from '../custom/axios_instance.js'

export const useFriendRequestsStore = defineStore('friendRequests', {
    state: () => ({
        friendRequests: new Map(),
    }),
    getters: {
        getFriendRequests: (state) => Array.from(state.friendRequests.values()),
        getFriendRequestQuantity: (state) => state.getFriendRequests.length,
    },
    actions: {
        async fetchFriendRequests() {
            const { data } = await axios.get('/usuario/solicitacoes-amizade')
            data.forEach((request) => this.friendRequests.set(request.id_solicitacao_amizade, request))
            this.newFriendRequests = data.length
        },
        async acceptFriendRequest(id) {
            try {
                await axios.post(`/usuario/solicitacao-amizade/aceitar/${id}`)
                this.friendRequests.delete(id)
                useAmigosStore().fetchFriends()
            }
            catch (error) {
                console.error(error)
                useNuxtApp().$toast.add({
                    severity: 'info',
                    summary: 'Oops!',
                    detail: error.response ? error.response.data.mensagem : 'O servidor está indisponível'
                })

                if (error.response.status === 404) this.removeSentFriendRequest(id)
            }
        },
        async rejectFriendRequest(id) {
            try {
                await axios.post(`/usuario/solicitacao-amizade/recusar/${id}`)
                this.friendRequests.delete(id)
                this.newFriendRequests--
                useAmigosStore().fetchFriends()
            }
            catch (error) {
                console.error(error)
                useNuxtApp().$toast.add({
                    severity: 'info',
                    summary: 'Oops!',
                    detail: error.response ? error.response.data.mensagem : 'O servidor está indisponível'
                })

                if (error.response.status === 404) this.removeFriendRequest(id)
            }
        },
        async fetchFriendRequestsQuantity() {
            const { data } = await axios.get('/usuario/solicitacoes-amizade/quantidade')
            this.newFriendRequests = Number(data.quantidade)
        },
        newFriendRequest(request) {
            const exists = this.friendRequests.get(request.id_solicitacao_amizade)
            if (exists) return

            this.newFriendRequests++
            this.friendRequests.set(request.id_solicitacao_amizade, request)

            new Notification('WS Chat', {
                body: `${request.nome_usuario_solicitante} enviou uma solicitação de amizade!`
            })
        },
        removeFriendRequest(id) {
            this.friendRequests.delete(id)
            this.newFriendRequests--
        },
    },
})