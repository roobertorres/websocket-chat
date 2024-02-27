<template>
	<div class="profile-photo-component">
		<div class="w-full flex gap-4 align-items-center">
			<div class="profile-photo-container flex align-items-center justify-content-center">
				<img :src="photo || '/images/profile-photo-placeholder.png'" class="account-profile-photo" width="100"
				     height="100"
				     ref="previewPhoto"/>
				<i v-if="!processing && !photo"
				   class="pi pi-camera text-3xl" style="position: absolute"/>
				<i v-else-if="processing || fetching" class="pi pi-spinner text-3xl pi-spin"
				   style="position: absolute"/>
				<div v-if="!processing" class="profile-photo-button" @click="triggerFileUpload">
					<i v-if="!photo"
					   class="pi pi-plus text-3xl"/>
					<i v-else class="pi pi-pencil text-3xl"/>
				</div>
			</div>
			<Button v-if="photo" label="Remover foto" text size="small"
			        @click="emit('new-photo', null)"/>
		</div>
		<Dialog v-model:visible="modalCropPhotoVisible" modal header="Foto de perfil" :draggable="false">
			<div class="flex flex-column justify-content-center">
				<small class="m-auto mb-3">Arraste a imagem para ajustá-la</small>
				<div style="width: 19rem; height: 19rem; position: relative" class="field">
					<img ref="profilePhotoCanvas" alt="" style="position: absolute"/>
				</div>
				<div class="field flex align-items-center gap-4">
					<i class="pi pi-search"/>
					<Slider v-model="zoom" class="w-full" :min="-1" :max="2" :step="0.01"/>
				</div>
			</div>
			<div class="flex justify-content-end gap-2 mt-3">
				<Button text label="Cancelar" class="w-1/2" @click="modalCropPhotoVisible = false" size="small"/>
				<Button label="Aplicar" class="w-1/2" @click="cropPhoto" size="small"/>
			</div>
		</Dialog>
		<input type="file" ref="inputProfilePhoto" @change="handleFileUpload" style="display: none"/>
	</div>
</template>

<script setup>
import Cropper from 'cropperjs'
import pica from 'pica'

defineProps({
	photo: {
		required: true,
	},
	fetching: {
		type: Boolean,
		required: true,
	},
})

const emit = defineEmits(['update:modelValue', 'new-photo'])

const inputProfilePhoto = ref(null)
const profilePhotoCanvas = ref(null)
const modalCropPhotoVisible = ref(false)
const previewPhoto = ref(null)
const zoom = ref(0)
const processing = ref(false)

let cropper

const handleFileUpload = async (event) => {
	const file = event.target.files[0]
	zoom.value = 0

	if (file) {
		if (file.type.includes('image')) {

			// if (file.size / 1024 / 1024 > 10) {
			// 	useNuxtApp().$toast.add({
			// 		severity: 'info',
			// 		summary: 'Wow, calma aí!',
			// 		detail: 'Insira uma imagem de até 10MB.',
			// 	})
			// 	return
			// }

			useNuxtApp().$toast.removeAllGroups()

			processing.value = true
			const reader = await new FileReader()

			reader.onload = async (e) => {
				const image = await new Image()
				image.src = e.target.result
				image.onload = async () => {
					const maxWidth = 500
					const maxHeight = 500
					const width = image.width
					const height = image.height

					// Calcular novas dimensões mantendo a proporção
					let newWidth
					let newHeight

					if (width > height) {
						newWidth = maxWidth
						newHeight = (height * maxWidth) / width
					}
					else {
						newHeight = maxHeight
						newWidth = (width * maxHeight) / height
					}

					// Criar um novo canvas
					const canvas = document.createElement('canvas')
					canvas.width = newWidth
					canvas.height = newHeight

					// Redimensionar a imagem para o novo canvas
					await pica().resize(image, canvas)

					// Obter um blob da imagem redimensionada
					canvas.toBlob(async (blob) => {
						// Criar um novo objeto URL a partir do blob
						const url = URL.createObjectURL(blob)

						modalCropPhotoVisible.value = true
						await nextTick()

						// Atribuir o novo objeto URL ao src do profilePhotoCanvas
						profilePhotoCanvas.value.src = url

						// Iniciar o cropper

						cropper = new Cropper(profilePhotoCanvas.value, {
							aspectRatio: 1,
							viewMode: 3,
							dragMode: 'move',
							highlight: false,
							autoCropArea: 1,
							cropBoxResizable: false,
						})

						processing.value = false
					})
				}
			}


			reader.readAsDataURL(file)
		}
		else {
			useNuxtApp().$toast.add({
				life: 5000,
				severity: 'info',
				summary: 'Oops!',
				detail: 'O arquivo inserido não é uma imagem.',
			})
		}
	}
}

const cropPhoto = () => {
	cropper.getCroppedCanvas({
		width: 100,
		height: 100,
	})
		.toBlob((blob) => {
			let reader = new FileReader()
			reader.readAsDataURL(blob)

			reader.onloadend = function () {
				let base64data = reader.result
				emit('new-photo', base64data)
			}

			modalCropPhotoVisible.value = false
		})
}

const triggerFileUpload = () => {
	if (inputProfilePhoto.value.files[0]) inputProfilePhoto.value.value = ''
	inputProfilePhoto.value.click()
}

watch(zoom, () => {
	cropper.zoomTo(zoom.value)
})
</script>

<style lang="scss">
.cropper-view-box,
.cropper-face {
	border-radius: 50%;
}

/* The css styles for `outline` do not follow `border-radius` on iOS/Safari (#979). */
.cropper-view-box {
	outline: 0;
	box-shadow: 0 0 0 1px #39f;
}

</style>

<style scoped lang="scss">
.profile-photo-container {
	position: relative;
	border: 2px solid var(--gray-300);
	border-radius: 50%;

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