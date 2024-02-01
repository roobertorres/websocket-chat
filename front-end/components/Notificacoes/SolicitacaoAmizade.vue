<template>
    {{ nova_solicitacao }}
    <div class="card flex justify-content-center">
        <Toast position="bottom-right" group="solicitacoes_amizade">
            <template #message="slotProps">
                <div class="flex flex-column align-items-start flex-1 gap-3">
                    <h4 class="m-0">Solicitação de amizade</h4>
                    <div class="flex align-items-center gap-2">

                        <Avatar label="" shape="circle" size="normal" />
                        <div class="flex flex-column gap-1">
                            <span class="font-bold text-900">{{ slotProps.message.detail.nome_usuario }}</span>
                            <small>{{ slotProps.message.detail.email }}</small>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <Button size="small" label="Aceitar" outlined />
                        <Button size="small" label="Recusar" outlined severity="danger" />
                    </div>
                </div>
            </template>
        </Toast>
    </div>
</template>

<script>

export default {
    data() {
        return {
            amigos: useAmigosStore()
        }
    },
    methods: {
        notificarSolicitacaoAmizade(solicitacao) {
            this.$toast.add({
                group: 'solicitacoes_amizade',
                severity: 'info',
                summary: 'Solicitação de amizade',
                detail: {
                    id_solicitacao_amizade: solicitacao.id_solicitacao_amizade,
                    nome_usuario: solicitacao.nome_usuario,
                    email: solicitacao.email,
                },
            })
        }
    },
    computed: {
        nova_solicitacao() {
            if (this.amigos.notificacoes.length > 0) {

                const notificacao = this.amigos.getSolicitacoesAmizade.at(this.amigos.getSolicitacoesAmizade.length - 1)
            }
        }
    },
}
</script>