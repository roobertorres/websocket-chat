export const useLoginModalsStore = defineStore('loginModals', {
    state: () => ({
        email: '',
        loginVisible: true,
        createAccountVisible: false,
        confirmEmailVisible: false,
        forgotPasswordVisible: false,
    }),
})