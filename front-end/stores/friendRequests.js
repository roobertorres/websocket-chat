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
            this.friendRequests = data
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
        }
    },
})