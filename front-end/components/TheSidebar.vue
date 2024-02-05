<template>
	<div class="the-sidebar w-18rem flex surface-0 p-3">
		<div class="flex-1 flex flex-column justify-content-between w-full">
			<div class="flex flex-column gap-3">
				<div class="sidebar-header flex flex-column gap-1">
					<h3 class="m-0 text-center">WS Chat</h3>
				</div>
				<div class="flex flex-column gap-2">
					<small>Gerenciar</small>
					<hr style="border-color: var(--surface-0); width: 100%" class="m-0">
					<div class="link-group">
						<SidebarAmigosLink/>
					</div>
				</div>
				<div class="flex flex-column gap-2">
					<small>Chats</small>
					<hr style="border-color: var(--surface-0); width: 100%" class="m-0">
					<div class="link-group">
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
	}
}
</style>
