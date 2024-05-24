<template>
	<small style="color: darkgray">
		{{ converterDataHorario(data) }}
	</small>
</template>

<script setup>

const props = defineProps({
	data: {
		type: String,
		required: true
	}
})
const converterDataHorario = (data_hora) => {
	const data = new Date(data_hora)
	const hoje = new Date()

	if (data.toLocaleDateString() === hoje.toLocaleDateString()) {
		const horarioFormatado = data.toLocaleTimeString('pt-BR', { timeStyle: 'short' })
		return `Hoje, ${horarioFormatado}`
	}
	else {
		const dataFormatada = data.toLocaleDateString('pt-BR', { dateStyle: 'short' })
		const horarioFormatado = data.toLocaleTimeString('pt-BR', { timeStyle: 'short' })
		return `${dataFormatada} ${horarioFormatado}`
	}
}
</script>