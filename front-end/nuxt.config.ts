// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: false,
    app: {
        head: {
            title: 'WebSocket Chat',
            meta: [
                {charset: 'utf-8'},
                {name: 'viewport', content: 'width=device-width, initial-scale=1'}
            ]
        }
    },
    modules: ["nuxt-primevue", "@pinia/nuxt"],
    primevue: {
        options: {
            ripple: true,
            inputStyle: 'filled',
        }
    },
    css: [
        // Custom
        './assets/styles/custom.scss',
        // Packages
        'primeflex/primeflex.css',
        'primevue/resources/themes/lara-dark-blue/theme.css',
        'primeicons/primeicons.css',
        'cropperjs/dist/cropper.min.css',
    ],
})