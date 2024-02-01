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
        </template>
    </Card>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            retorno: '',
            erro: false,
            processando: false,
        }
    },
    methods: {
        async solicitarAmizade() {
            this.processando = true

            await this.$axios.post('/usuario/solicitar-amizade', {
                email: this.email
            })
                .then((response) => {
                    this.erro = false
                    this.retorno = response.data.mensagem
                    this.email = ''
                    setTimeout(() => this.retorno = '', 5000)
                })
                .catch((error) => {
                    this.erro = true
                    this.retorno = error.response ? error.response.data.mensagem : 'Servidor indisponível'
                })

            this.processando = false
        },
    }
}
</script>

<style lang="scss">
.p-success {
    color: var(--green-200);
}
</style>