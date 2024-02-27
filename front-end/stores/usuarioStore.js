import axios from '@/custom/axios_instance.js'

export const useUsuarioStore = defineStore('usuarioStore', {
    state: () => ({
        usuario: null,
    }),
    getters: {
        getUsuario: (state) => state.usuario,
        getNomeUsuario: (state) => state.usuario?.nome_usuario || '?',
        getUsuarioEmail: (state) => state.usuario?.email,
        getUsuarioId: (state) => state.usuario?.id_usuario,
        getUsuarioDataCadastro: (state) => state.usuario?.data_cadastro,
        getUsuarioPhoto: (state) => state.usuario?.photo,
    },
    actions: {
        async buscarUsuario() {
            try {
                const { data } = await axios.get('/usuario/dados')
                this.usuario = data
                return true
            }
            catch (error) {
                console.error(error)
                return false
            }
        },
        setNomeUsuario(nome) {
            this.usuario.nome_usuario = nome
        },
        setUsuarioPhoto(photo) {
            this.usuario.photo = photo
        },
        setUsuarioEmail(email) {
            this.usuario.email = email
        },
    }
})