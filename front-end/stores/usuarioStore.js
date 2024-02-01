import axios from '@/custom/axios_instance.js'

export const useUsuarioStore = defineStore('usuarioStore', {
    state: () => ({
        usuario: null,
    }),
    getters: {
        getUsuario: (state) => state.usuario,
        getNomeUsuario: (state) => state.usuario?.nome_usuario,
        getUsuarioEmail: (state) => state.usuario?.email,
        getUsuarioId: (state) => state.usuario?.id_usuario,
        getUsuarioDataCadastro: (state) => state.usuario?.data_cadastro,
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
    }
})