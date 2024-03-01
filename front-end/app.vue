<template>
	<NuxtLoadingIndicator/>
	<NuxtLayout>
		<NuxtPage/>
	</NuxtLayout>
</template>

<style>

.page-transition-enter-active,
.page-transition-leave-active {
	transition: .4s;
	position: absolute;
	width: 100%;
	height: 100%;
}

.page-transition-enter-from,
.page-transition-leave-to {
	opacity: 0;
	transform: scale(0.97);
}

.page-transition-leave-from,
.page-transition-enter-to {
	opacity: 1;
	transform: scale(1);
}

</style>