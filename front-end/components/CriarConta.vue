<template>
    <div class="text-center">
        <Button label="Criar conta" class="w-full" outlined size="small" @click="visivel = true" dismissableMask />
    </div>
    <Dialog v-model:visible="visivel" header="Criar conta" modal :draggable="false" class="w-11 md:w-6 lg:w-25rem">
        <form @submit.prevent="criarConta()">
            <div class="field">
                <label for="criar-conta-nome">Nome</label>
                <InputText id="criar-conta-nome" type="text" v-model="nome" maxlength="45" class="w-full" required />
            </div>
            <div class="field">
                <label for="criar-conta-email">E-mail</label>
                <InputText id="criar-conta-email" type="email" v-model="email" maxlength="100" class="w-full" required />
            </div>
            <div class="field">
                <label for="criar-conta-senha">Senha</label>
                <Password id="criar-conta-senha" v-model="senha" maxlength="100" class="w-full" toggleMask
                    promptLabel="Digite uma senha" weakLabel="Fraca" mediumLabel="Satisfatória" strongLabel="Segura"
                    required />
            </div>
            <Button label="Criar conta!" type="submit" :loading="processando" class="w-full field" />
            <div class="text-center">
                <InlineMessage v-show="mensagem_erro !== ''" severity="info">{{ mensagem_erro }}</InlineMessage>
            </div>
        </form>
    </Dialog>
</template>
<script>

export default {
    data() {
        return {
            visivel: false,
            nome: '',
            email: '',
            senha: '',
            mensagem_erro: '',
            processando: false,
        }
    },
    methods: {
        async criarConta() {
            this.$toast.removeAllGroups()
            this.processando = true

            await this.$axios.post('/criar-conta', {
                nome: this.nome.trim(),
                email: this.email.trim(),
                senha: this.senha.trim()
            })
                .then(({ data }) => {

                    this.$router.push('/chat')
                })
                .catch((error) => {
                    if (error.response) {
                        this.mensagem_erro = error.response ? error.response.data.mensagem : 'Servidor indisponível'
                    } else {
                        console.error(error)
                    }
                })

            this.processando = false
        }
    }
}
</script>