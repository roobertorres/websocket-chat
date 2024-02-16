import axios from '@/custom/axios_instance.js'

export const useSentFriendRequestsStore = defineStore('SentFriendRequests', {
    state: () => ({
        sentFriendRequests: new Map(),
    }),
    getters: {
        getSentFriendRequests: (state) => Array.from(state.sentFriendRequests.values()),
        getSentFriendRequestsQuantity: (state) => state.sentFriendRequests.size,
    },
    actions: {
        async fetchSentFriendRequests() {
            const { data } = await axios.get('/usuario/solicitacoes-amizade/enviadas')
            data.forEach((request) => this.sentFriendRequests.set(request.id_solicitacao_amizade, request))
        },
        async cancelFriendshipRequest(id) {
            useNuxtApp().$toast.removeAllGroups()

            try {
                await axios.delete(`/usuario/solicitacoes-amizade/cancelar/${id}`)
                this.sentFriendRequests.delete(id)

                useNuxtApp().$toast.add({
                    severity: 'success',
                    summary: 'Feito!',
                    detail: 'A solicitação foi removida',
                    life: 3000
                })
            }
            catch (error) {
                console.error(error)
                useNuxtApp().$toast.add({
                    severity: 'info',
                    summary: 'Oops!',
                    detail: error.response ? error.response.data.mensagem : 'Servidor indisponível',
                    life: 5000
                })

                console.log(error.response.status)

                if (error.response.status === 404) this.removeSentFriendRequest(id)
            }
        },
        clearSentFriendRequests() {
            this.sentFriendRequests.clear()
        },
        addSentFriendRequest(request) {
            this.sentFriendRequests.set(request.id_solicitacao_amizade, request)
        },
        removeSentFriendRequest(id) {
            this.sentFriendRequests.delete(id)
        }
    }
})