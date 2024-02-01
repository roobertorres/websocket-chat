<template>
    <Card>
        <template #content>
            <div class="field">
                <h3 class="mt-0">Adicionar amigos</h3>
            </div>
            <form @submit.prevent="solicitarAmizade()">
                <div class="flex gap-2">
                    <InputText id="adicionar-amigo-email" type="email" maxlength="100" class="flex-1"
                        placeholder="E-mail do contato" :class="{ 'p-invalid': erro }" required :disabled="processando"
                        v-model="email" />
                    <Button label="Solicitar" type="submit" :loading="processando" />
                </div>
            </form>
            <p v-if="retorno !== ''" class="mb-0 p-error" :class="{ 'p-success': !erro }">
                {{ retorno }}
            </p>
            <AmigosSolicitacoesEnviadas />
        </template>
    </Card>
</template>

<script setup>
const email = ref('')
const retorno = ref('')
const erro = ref(false)
const processando = ref(false)

const solicitarAmizade = async () => {
    processando.value = true

    await useNuxtApp().$axios.post('/usuario/solicitar-amizade', {
        email: email.value
    })
        .then((response) => {
            useSentFriendshipRequestsStore().fetchSentFriendshipRequests()
            erro.value = false
            retorno.value = response.data.mensagem
            email.value = ''
            setTimeout(() => retorno.value = '', 5000)
        })
        .catch((error) => {
            console.error(error)
            erro.value = true
            retorno.value = error.response ? error.response.data.mensagem : 'Servidor indisponível'
        })

    processando.value = false
}

</script>

<style lang="scss">
.p-success {
    color: var(--green-200);
}
</style>