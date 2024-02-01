<template>
    <Dialog v-model:visible="notificationVisible" modal :closable="false" :showHeader="false" :draggable="false"
        :resizable="false">
        <div class="d-flex flex-column gap-2 text-center pt-5">
            <i class="pi pi-bell text-5xl" />
            <h2 class="text-center">Notificações</h2>
            <p>Para receber notificações neste navegador,<br>permita o envio de notificações.</p>
            <Button label="Não receber notificações" @click="notificationVisible = false" />
        </div>
    </Dialog>
</template>

<script setup>
let notificationVisible = ref(false)

onMounted(() => {
    if (!("Notification" in window)) {
        useToast().add({
            severity: 'warn',
            summary: 'Notificações não suportadas',
            detail: 'Este navegador não suporta notificações'
        })
    }
    else if (Notification.permission === "granted") {
        // 
    }
    else if (Notification.permission !== "denied") {

        notificationVisible.value = true

        Notification.requestPermission().then((permission) => {

            if (permission === "granted") {
                console.log("Permissão concedida")
                notificationVisible.value = false
            }
            else {
                console.log("Permissão negada")
            }
        })
    }
})

</script>