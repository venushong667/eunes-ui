<script lang='ts'>
    import { Modal, storePopup, initializeStores, Toast } from '@skeletonlabs/skeleton';
    // Implement skeletonUI Popup utilities
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

    // export let data;

    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
    // For Skeleton's Drawer, Modal, and Toast stores 
    // https://www.skeleton.dev/utilities/toasts
    initializeStores();

    let leftSideBarOpened = false;

    function toggleSideBar() {
        leftSideBarOpened = !leftSideBarOpened;
    }

</script>

<Modal />
<Toast />
<!-- {leftSideBarOpened ? 'w-64' : 'md:w-auto'} -->
<div class="h-full w-full overflow-hidden">
    <slot />
</div>