<script lang='ts'>
    import { Modal } from '@skeletonlabs/skeleton';
    // Implement skeletonUI Popup utilities
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
    import { storePopup } from '@skeletonlabs/skeleton';
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-hamlindigo.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

    // export let data;

    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

    let leftSideBarOpened = false;

    function toggleSideBar() {
        leftSideBarOpened = !leftSideBarOpened;
    }

</script>

<Modal />
<!-- {leftSideBarOpened ? 'w-64' : 'md:w-auto'} -->
<div class="h-full w-full overflow-hidden">
    <slot />
</div>