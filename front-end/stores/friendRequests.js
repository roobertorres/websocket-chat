import axios from '../custom/axios_instance.js'

export const useFriendRequestsStore = defineStore('friendRequests', {
    state: () => ({
        friendRequests: new Map(),
        newFriendRequests: 0,
    }),
    getters: {
        getFriendRequests: (state) => Array.from(state.friendRequests.values()),
        getNewFriendRequests: (state) => state.newFriendRequests,
    },
    actions: {
        async fetchFriendRequests() {
            const { data } = await axios.get('/usuario/solicitacoes-amizade')
            data.forEach((request) => this.friendRequests.set(request.id_solicitacao_amizade, request))
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
                    detail: error.response ? error.response.data.message : 'O servidor está indisponível'
                })
            }
        },
        async rejectFriendRequest(id) {
            try {
                await axios.post(`/usuario/solicitacao-amizade/recusar/${id}`)
                this.friendRequests.delete(id)
                useAmigosStore().fetchFriends()
            }
            catch (error) {
                console.error(error)
                useNuxtApp().$toast.add({
                    severity: 'info',
                    summary: 'Oops!',
                    detail: error.response ? error.response.data.message : 'O servidor está indisponível'
                })
            }
        },
        async fetchFriendRequestsQuantity() {
            const { data } = await axios.get('/usuario/solicitacoes-amizade/quantidade')
            this.newFriendRequests = Number(data.quantidade)
        },
        newFriendRequest(request) {
            const exists = this.friendRequests.get(request.id_solicitacao_amizade)
            if (exists) return

            this.friendRequests.set(request.id_solicitacao_amizade, request)
            this.newFriendRequests++

            new Notification('Nova solicitação de amizade', {
                body: `${request.nome_usuario_solicitante} quer ser seu amigo!`
            })
        },
        removeFriendRequest(id) {
            this.friendRequests.delete(id)
            this.newFriendRequests--
        },
    },
})