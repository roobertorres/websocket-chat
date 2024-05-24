import axios from '../plugins/axios'

export const useProfilePhotoStore = defineStore('profilePhotos', {
    state: () => ({
        profilePhotos: new Map(),
    }),
    getters: {
        getUserProfilePhoto: (state) => async (id) => {
            if (!state.profilePhotos.has(id)) {
                await this.fetchUserProfilePhoto(id)
            }

            return state.profilePhotos.get(id)
        },
    },
    actions: {
        async fetchUserProfilePhoto(id) {
            const { data } = await axios.get(`usuario/profile-photo/${id}`)
            this.profilePhotos.set(id, data)
        },
        setUserProfilePhoto(id, photo) {
            this.profilePhotos.set(id, photo)
        }
    }
})