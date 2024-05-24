export default defineNuxtPlugin(async () => {
    return {
        provide: {
            toast: useToast()
        }
    }
})