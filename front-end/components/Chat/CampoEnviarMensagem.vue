<template>
    <form @submit.prevent="enviarMensagem()">
        <div class="chat-footer flex gap-2">
            <InputText type="text" maxlength="200" placeholder="Digite sua mensagem" v-model="mensagem"
                id="campo-enviar-mensagem" class="flex-1" :disabled="enviando" autofocus />
            <Button type="submit" icon="pi pi-send" :loading="enviando" :disabled="!mensagem" />
        </div>
    </form>
</template>

<script setup>
import { useMensagensStore } from '../../stores/mensagensStore';

let mensagem = ref('')
let enviando = ref(false)

const enviarMensagem = async () => {
    enviando.value = true
    const id_chat = useRoute().query.id

    await useMensagensStore().enviarMensagem(id_chat, mensagem.value)
        .then((response) => {
            mensagem.value = ''
        })
        .catch((error) => {
            useToast().add({
                severity: 'error',
                summary: 'Erro ao enviar mensagem',
                detail: error.response ? error.response.data.message : 'Servidor indisponível',
                life: 3000
            })
        })

    enviando.value = false
    await nextTick()
    document.getElementById('campo-enviar-mensagem').focus()
}
</script>
