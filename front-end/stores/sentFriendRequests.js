import axios from '@/custom/axios_instance.js'

export const useSentFriendRequestsStore = defineStore('SentFriendRequests', {
    state: () => ({
        sentFriendRequests: new Map(),
    }),
    getters: {
        getSentFriendRequests: (state) => Array.from(state.SentFriendRequests.values()),
        getSentFriendRequestsQuantity: (state) => state.sentFriendRequests.size,
    },
    actions: {
        async fetchSentFriendRequests() {
            const { data } = await axios.get('/usuario/solicitacoes-amizade/enviadas')
            this.sentFriendRequests = data
        },
        async cancelFriendshipRequest(id) {
            try {
                const { data } = await axios.delete(`/usuario/solicitacoes-amizade/cancelar/${id}`)
                this.sentFriendRequests = this.SentFriendRequests.filter((request) => request.id_solicitacao_amizade !== id)
                return data
            }
            catch (err) {
                // console.error(err)
                throw new Error(err)
            }
        }
    }
})