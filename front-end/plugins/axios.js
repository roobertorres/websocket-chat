import axios_instance from "@/custom/axios_instance"

export default defineNuxtPlugin(async () => {
    return {
        provide: {
            axios: axios_instance
        }
    }
})