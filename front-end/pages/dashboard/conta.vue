<template>
    <div class="account-page flex flex-column gap-3">
        <div class="page-title">
            <h2 class="mb-0">Conta</h2>
        </div>
        <div class="page-content flex-1 flex">
            <Card class="flex-1">
                <template #content>
                    <div class="flex gap-5 px-2">
                        <div class="account-links flex flex-column gap-2 border-200">
                            <NuxtLink :to="{name: 'Perfil'}" activeClass="surface-200"
                                      class="link-button border-round">
                                <span>Perfil</span>
                            </NuxtLink>
                            <NuxtLink :to="{name: 'Acesso e Segurança'}" activeClass="surface-200"
                                      class="link-button border-round">
                                <span>Acesso e Segurança</span>
                            </NuxtLink>
                            <NuxtLink :to="{name: 'Privacidade'}" activeClass="surface-200"
                                      class="link-button border-round">
                                <span>Privacidade e Amigos</span>
                            </NuxtLink>
                            <NuxtLink :to="{name: 'Configurações'}" activeClass="surface-200"
                                      class="link-button border-round">
                                <span>Configurações</span>
                            </NuxtLink>
                        </div>
                        <div class="surface-100 border-round py-4 px-4 flex-1">
                            <NuxtPage/>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.account-page {

    .account-links {
        .link-button {
            transition: all .1s ease-in-out;
            border-left: 0 solid transparent;
            padding: .5rem .8rem;

            &:hover {
                background-color: var(--surface-100);
            }

            &.link-active {
                border-left: 5px solid var(--p-error);
            }
        }
    }
}

</style>

<script setup>
definePageMeta({
    layout: 'dashboard',
    redirect: {name: 'Perfil'},
    pageTransition: {
        name: 'page-transition'
    }
})

</script>