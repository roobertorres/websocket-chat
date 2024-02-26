<template>
	<div>
		<div class="w-full flex gap-4 align-items-center">
			<div class="profile-photo-container flex align-items-center justify-content-center">
				<img src="/images/profile-photo-placeholder.png" class="account-profile-photo w-7rem h-7rem"
				     ref="previewPhoto"/>
				<i v-if="!processing && previewPhoto?.src.includes('/images/profile-photo-placeholder.png')"
				   class="pi pi-camera text-3xl" style="position: absolute"/>
				<i v-else-if="processing" class="pi pi-spinner text-3xl pi-spin" style="position: absolute"/>
				<div class="profile-photo-button" @click="triggerFileUpload">
					<i v-if="previewPhoto?.src.includes('/images/profile-photo-placeholder.png')"
					   class="pi pi-plus text-3xl"/>
					<i v-else class="pi pi-pencil text-3xl"/>
				</div>
			</div>
			<Button label="Remover foto" text size="small"
			        @click="previewPhoto.src = './images/profile-photo-placeholder.png'"/>
		</div>
		<Dialog v-model:visible="modalCropPhotoVisible" modal header="Ajustar foto" :draggable="false">
			<div class="flex flex-column justify-content-center">
				<img ref="profilePhotoCanvas" alt="" style="width: 20rem; height: 20rem"/>
				<Slider v-model="zoom" class="w-full mt-3" :min="0.1" :max="2" :step="0.01"/>
				<div class="flex gap-3 mt-3">
					<Button icon="pi pi-replay" size="small" @click="cropper.rotate(-90)"/>
					<Button icon="pi pi-refresh" size="small" @click="cropper.rotate(90)"/>
				</div>
			</div>
			<div class="flex justify-content-end gap-2 mt-3">
				<Button text label="Cancelar" class="w-1/2" @click="modalCropPhotoVisible = false"/>
				<Button label="Salvar" class="w-1/2" @click="cropPhoto"/>
			</div>
		</Dialog>
		<input type="file" ref="inputProfilePhoto" @change="handleFileUpload" style="display: none"/>
	</div>
</template>

<script setup>
import Cropper from 'cropperjs'

const inputProfilePhoto = ref(null)
const profilePhotoCanvas = ref(null)
const modalCropPhotoVisible = ref(false)
const previewPhoto = ref(null)
const zoom = ref(0)
const processing = ref(false)

watch(zoom, () => {
	console.log(zoom.value)
	cropper.zoomTo(zoom.value)
})

const emit = defineEmits(['update:modelValue', 'new-photo'])

let cropper

const triggerFileUpload = () => {
	if (inputProfilePhoto.value.files[0]) inputProfilePhoto.value.value = ''
	inputProfilePhoto.value.click()
}

const cropPhoto = () => {
	const canvas = cropper.getCroppedCanvas({
		width: 300,
		height: 300,
	})
		.toBlob((blob) => {
			modalCropPhotoVisible.value = false
			previewPhoto.value.src = URL.createObjectURL(blob)

			emit('new-photo', blob)
		})
}

const handleFileUpload = async (event) => {
	const file = event.target.files[0]
	zoom.value = 0

	if (file) {
		if (file.type.includes('image')) {
			processing.value = true
			const reader = await new FileReader()
			reader.onload = async (e) => {
				const image = await new Image()

				image.src = e.target.result

				image.onload = async () => {
					modalCropPhotoVisible.value = true
					await nextTick()
					profilePhotoCanvas.value.src = image.src
					cropper = new Cropper(profilePhotoCanvas.value, {
						aspectRatio: 1,
						viewMode: 3,
						dragMode: 'move',
						highlight: false,
						autoCropArea: 1,
						cropBoxMovable: false,
						cropBoxResizable: false,
						width: '75rem',
						height: '75rem',
					})

					processing.value = false
				}
			}
			reader.readAsDataURL(file)
		}
		else {
			useNuxtApp().$toast.add({
				severity: 'error',
				summary: 'Erro',
				detail: 'O arquivo selecionado não é uma imagem',
			})

		}
	}
}
</script>

<style scoped lang="scss">


.profile-photo-container {
	position: relative;

	.account-profile-photo {
		border-radius: 50%;
		background: var(--gray-500);
	}


	.profile-photo-button {
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		position: absolute;
		top: 0;
		opacity: 0;
		transition: .2s;
		cursor: pointer;

		&:hover {
			opacity: 1;
			backdrop-filter: blur(3px);
		}
	}
}
</style>