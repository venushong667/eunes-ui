<script lang="ts">
    import { TabGroup, Tab, ListBox, type PopupSettings, popup, ListBoxItem, type ModalSettings } from '@skeletonlabs/skeleton';
    import Kanban from '../Kanban.svelte';
    import { browser } from '$app/environment';
    import { writable } from 'svelte/store';
    import { goto } from '$app/navigation';
    import { getModalStore } from '@skeletonlabs/skeleton';
    import {v4 as uuidv4} from 'uuid';
    import type { Board, Project } from '../interfaces';
    import { createProject, deleteProject } from '../service';

    export let data;
    $: ({ projects, currentProject } = data);

    let selectedProject = data.currentProject;
    let boards = writable<Board[]>([]);
    $: boards.set(currentProject.boards || []);

    $: if (browser) goto(`/memoboard/${selectedProject.id}`);

    let tabSet: number = 0;

    const modalStore = getModalStore();

    const popupProjectList: PopupSettings = {
        // Set the event as: click | hover | hover-click | focus | focus-click
        event: 'click',
        target: 'project-list',
        placement: 'bottom',
        closeQuery: '.listbox-item'
    };

    const popupProjectMenu: PopupSettings = {
        // Set the event as: click | hover | hover-click | focus | focus-click
        event: 'focus-click',
        target: 'project-menu',
        placement: 'bottom',
        closeQuery: '.listbox-item'
    };

    const addNewProject = async (name: string) => {
        if (name) {
            let newProject = { id: uuidv4(), name: name } as Project;
            const project = await createProject(newProject);
            selectedProject = project;
        }
    }

    const removeProject = async (id: string) => {
        if (id) {
            await deleteProject(currentProject.id);
            selectedProject = projects[0];
        }
    }

    const showModal = () => {
        return new Promise<boolean>((resolve) => {
            const modal: ModalSettings = {
                type: 'prompt',
                // Data
                title: 'Enter Project Name',
                body: 'Provide your new project name in the field below.',
                // Populates the input value and attributes
                value: '',
                valueAttr: { type: 'text', minlength: 3, maxlength: 10, required: true },
                // Returns the updated response value
                response: (name: string) => {
                    addNewProject(name).then(() => resolve(true));
                }
            };

            modalStore.trigger(modal);
        })
    }

    const showDeleteModal = () => {
        return new Promise<boolean>((resolve) => {
            const modal: ModalSettings = {
                type: 'confirm',
                title: 'Please Confirm',
                body: 'Are you sure to delete this project?',
                response: (r: boolean) => {
                    removeProject(currentProject.id).then(() => resolve(r));
                }
            };
            modalStore.trigger(modal);
        })
    }
</script>

<div class="memoboard flex flex-col h-full overflow-hidden">

    <div class="memo-top flex p-5 whitespace-nowrap">
        <span class="text-xl font-semibold self-center text-ellipsis overflow-hidden">{selectedProject.name}</span>
        <button type="button" class="btn-icon" use:popup={popupProjectList}>
            <span class="material-icons">expand_more</span>
        </button>
    
        <div class="card w-48 shadow-xl py-2 z-[999]" data-popup="project-list">
            <!-- Listbox -->
            <ListBox>
                {#each projects as project}
                    <ListBoxItem bind:group={selectedProject} name="medium" value={project}>
                        {project.name}
                    </ListBoxItem>
                {/each}
            </ListBox>
            <div class="new-project">
                <button class="btn w-full" on:click={showModal}>
                    <span class="material-icons">add</span>
                </button>
            </div>
            <!-- Arrow -->
            <div class="arrow bg-surface-100-800-token" />

        </div>

        <div class="menu ml-auto">
            <button type="button" class="btn-icon">
                <span class="material-icons">search</span>
            </button>
            <button type="button" class="btn-icon" use:popup={popupProjectMenu}>
                <span class="material-icons">more_vert</span>
            </button>
        </div>

        <div class="card w-48 shadow-xl py-2 z-[999]" data-popup="project-menu">
            <!-- Listbox -->
            <ListBox>
                <label>
                    <button class="listbox-item w-full cursor-pointer -outline-offset-[3px] rounded-token px-4 py-2 hover:variant-soft text-start" on:click={showDeleteModal}>
                        <div class="listbox-label flex items-center space-x-4">
                            <div class="listbox-label-content flex-1">
                                Delete Project
                            </div>
                        </div>
                    </button>
                </label>
            </ListBox>
            <!-- Arrow -->
            <div class="arrow bg-surface-100-800-token" />

        </div>
    </div>
    
    <TabGroup class="flex flex-col h-full overflow-hidden" regionPanel="overflow-auto h-full flex">
        <Tab bind:group={tabSet} name="tab1" value={0}>KanBan</Tab>
        <Tab bind:group={tabSet} name="tab2" value={1}>Tasks</Tab>
        <Tab bind:group={tabSet} name="tab3" value={2}>Files</Tab>
        <!-- Tab Panels --->
        <svelte:fragment slot="panel">
            {#if tabSet === 0}
                <Kanban project={currentProject} boardStore={boards}/>
            {:else if tabSet === 1}
                (tab panel 2 contents)
            {:else if tabSet === 2}
                (tab panel 3 contents)
            {/if}
        </svelte:fragment>
    </TabGroup>
</div>