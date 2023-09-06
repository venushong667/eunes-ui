<script lang='ts'>
    import { AppShell, Modal } from '@skeletonlabs/skeleton';
    // Implement skeletonUI Popup utilities
    import Navigation from '$lib/components/Navigation.svelte';

    export let data;

    let leftSideBarOpened = false;

    function toggleSideBar() {
        leftSideBarOpened = !leftSideBarOpened;
    }

</script>

<Modal />
<!-- {leftSideBarOpened ? 'w-64' : 'md:w-auto'} -->
<AppShell regionPage="overflow-hidden" slotPageContent="overflow-hidden">
	<svelte:fragment slot="sidebarLeft">
        <div class="sidebar h-full flex flex-col bg-surface-500/10 py-2">
            <div class="flex justify-center divide-y">
                <button class="btn {leftSideBarOpened ? 'ml-auto' : ''} px-4"
                on:click={toggleSideBar}>
                    <span class="material-icons">
                        {leftSideBarOpened ? "first_page": "menu"}
                    </span>
                </button>
            </div>
            <hr class="my-2 h-0.5"/>
            <Navigation modules={data.modules} open={leftSideBarOpened} />
        </div>
    </svelte:fragment>
	<!-- Router Slot -->
    <div class="h-full w-full overflow-hidden">
        <slot />
    </div>
	<!-- ---- / ---- -->
</AppShell>
