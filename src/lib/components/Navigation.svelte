<script lang="ts">
    import { page } from '$app/stores';
    import type { EunesModule } from "$lib/module-config";
    import { LightSwitch } from '@skeletonlabs/skeleton';
    import { writable } from "svelte/store";
    import { slide, fade } from 'svelte/transition';

    export let modules: EunesModule[];
    export let open: boolean;

    let navWidth: number;
    
    const predefinedModule = modules.find(module => module.id === $page.url.pathname.split('/')[1]);
    const activeModule = writable<EunesModule>(predefinedModule ? predefinedModule : undefined);
    
    const setActiveModule = (module: EunesModule) => {
        activeModule.set(module);
    }

</script>

<nav class="list-nav flex-1 {open ? 'w-64' : ''}" style="width: {navWidth}px">
    <ul>
        {#each modules as module}
        <li
            class="relative overflow-hidden {open ? '' : 'w-fit'}"
            class:active={$activeModule && $activeModule.id === module.id}
            class:before:bg-surface-900-50-token={$activeModule && $activeModule.id === module.id}
            bind:clientWidth={navWidth}>
            <a href={'/'+module.id} on:click={() => setActiveModule(module)}>
                <span class="material-icons">{module.icon}</span>
                
                {#if open}
                <span transition:slide|global="{{duration: 100, axis: 'x'}}">{module.name}</span>
                {/if}
                
            </a>
        </li>
        {/each}
    </ul>
</nav>
<LightSwitch class="self-center" />


<style>
    .active:before {
        height: 60%;
        width: 5px;
        display: block;
        position: absolute;
        content: "";
        left: 0;
        top: 50%;
        transform: translate(0%, -50%);
        border-radius: 5px;
    }

    .list-nav {
        transition: 0.5s;
    }
</style>