export const useLoginModalsStore = defineStore('loginModals', {
    state: () => ({
        email: '',
    }),
    getters: {
        getEmail() {
            return this.email
        }
    },
    actions: {
        setEmail(email) {
            this.email = email.trim()
        },
    }
})