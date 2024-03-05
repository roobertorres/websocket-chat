export default defineNuxtRouteMiddleware(async (to, from) => {
    //
    // console.log(to)
    // if (to.path === '/login') {
    //
    //     if (!to.query.logout) {
    //         if (await useUsuarioStore().buscarUsuario()) {
    //             return navigateTo('/dashboard')
    //         }
    //     }
    //
    //     return
    // }
    // else if (to.matched[0].path !== '/login') {
    //
    //     if (!useUsuarioStore().getUsuario) {
    //         if (await useUsuarioStore().buscarUsuario()) return
    //         return navigateTo('/login')
    //     }
    //     else {
    //         if (!to.path.includes('chat') && from.path.includes('chat')) {
    //             useMensagensStore().clearMessages()
    //             return
    //         }
    //     }
    // }
})