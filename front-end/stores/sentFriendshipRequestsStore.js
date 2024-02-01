import axios from '@/custom/axios_instance.js'

export const useSentFriendshipRequestsStore = defineStore('sentFriendshipRequests', {
    state: () => ({
        sentFriendshipRequests: [],
    }),
    getters: {
        getSentFriendshipRequests: (state) => state.sentFriendshipRequests,
    },
    actions: {
        async fetchSentFriendshipRequests() {
            const { data } = await axios.get('/usuario/solicitacoes-amizade/enviadas')
            this.sentFriendshipRequests = data
        },
        async cancelFriendshipRequest(id) {
            try {
                const { data } = await axios.delete(`/usuario/solicitacoes-amizade/cancelar/${id}`)
                this.sentFriendshipRequests = this.sentFriendshipRequests.filter((request) => request.id_solicitacao_amizade !== id)
                return data
            }
            catch (err) {
                // console.error(err)
                throw new Error(err)
            }
        }
    }
})