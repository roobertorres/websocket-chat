<template>
	<div class="the-sidebar w-18rem flex surface-0 p-3 border-round ml-3 my-3">
		<div class="flex-1 flex flex-column justify-content-between w-full gap-3">
			<div class="flex flex-column gap-3 flex-1" style="overflow: hidden">
				<div class="sidebar-header flex flex-column gap-1">
					<img src="/images/ws-chat-logo.svg" class="w-full px-7 py-2"/>
				</div>
				<div class="flex flex-column gap-2">
					<small>Gerenciar</small>
					<hr style="border-color: var(--surface-0); width: 100%" class="m-0">
					<div class="link-group">
						<SidebarAccountLink/>
						<SidebarAmigosLink/>
					</div>
				</div>
				<div class="flex flex-column gap-2 flex-1" style="overflow: hidden">
					<small>Chats</small>
					<hr style="border-color: var(--surface-0); width: 100%" class="m-0">
					<div class="link-group" style="overflow: auto">
						<SidebarChatsList/>
					</div>
				</div>
			</div>
			<SidebarQuickPanel/>
		</div>
	</div>
</template>

<style lang="scss">
.the-sidebar {

	.link-group {
		display: flex;
		flex-direction: column;
		gap: .5rem;
		padding-right: .5rem;

		.sidebar-link {
			cursor: pointer;
			transition: all .1s ease-in-out;
			border-left: 0 solid transparent;

			&:hover {
				background-color: var(--surface-100);
			}

			&.link-active {
				border-left: 5px solid var(--surface-300);
			}
		}

		&::-webkit-scrollbar-track {
			background-color: var(--surface-50);

			border-radius: 5px;
		}

		&::-webkit-scrollbar {
			width: 5px;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: 10px;
			background-color: var(--surface-200);
		}
	}
}
</style>
<script setup>
</script>