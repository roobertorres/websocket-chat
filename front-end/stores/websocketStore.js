export const useWebsocketStore = defineStore('websocketStore', {
    state: () => ({
        socket: null,
    }),
    getters: {
        isConnected: (state) => state.socket && state.socket?.readyState === 1,
    },
    actions: {
        close() {
            this.socket.close()
        }
    }
})