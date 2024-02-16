import axios from '../custom/axios_instance.js'

export const useAmigosStore = defineStore('amigosStore', {
    state: () => ({
        amigos: new Map(),
    }),
    getters: {
        getAmigos: (state) => Array.from(state.amigos.values()),
        getFriendsQuantity: (state) => state.amigos.size,
        getFriendStatus: (state) => id_usuario => state.amigos.get(id_usuario)?.status,
    },
    actions: {
        async fetchFriends() {
            const { data } = await axios.get('/usuario/amigos')
            if (data) data.forEach(amigo => this.amigos.set(amigo.id_usuario, amigo))
        },
        setFriendStatus(id, status) {
            const amigo = this.amigos.get(id)
            if (amigo) amigo.status = status
        },
        addFriend(friend) {
            this.amigos.set(friend.id_usuario, friend)
        },
        newFriend(request) {
            new Notification('WS Chat', {
                body: `${request.nome_usuario_solicitante} aceitou sua solicitação de amizade`,
            })
            this.fetchFriends()
        }
    }
})