<script lang="ts">
    import type { Board, Memo, Project } from "./interfaces";
    import SvelteMarkdown from 'svelte-markdown';
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import {v4 as uuidv4} from 'uuid';
    import type { Writable } from "svelte/store";
    import { createBoard, createMemo, deleteBoard, deleteMemo, updateBoard, updateMemo } from "./service";
    import { ListBox, popup, type PopupSettings } from "@skeletonlabs/skeleton";
    import sortBy from "lodash-es/sortBy";
    import { popupContextMenu, type ContextMenuSettings} from "$lib/components/PopupContextMenu";

    export let boardStore: Writable<Board[]>;
    export let project: Project;

    const flipDurationMs = 200;
    let editingNewBoard: Boolean = false;
    let boards: Board[] = [];
    let newBoardInput: HTMLInputElement;
    let newMemoInput: HTMLTextAreaElement;

    boardStore.subscribe((data: Board[]) => {
        if (data.length > 0) {
            data = sortBy(data, ['position'])
        }
        boards = data;
        editingNewBoard = false;
    });

    
    function handleMemoConsider(evt: CustomEvent<DndEvent<Memo>>, board: Board) {
        const boardIdx = boards.findIndex(b => b.id === board.id);
        board.memos = evt.detail.items;
        boards[boardIdx] = board;
    }

    async function handleMemoFinalize(evt: CustomEvent<DndEvent<Memo>>, board: Board) {
        const memoIdx = board.memos.findIndex(m => m.id === evt.detail.info.id);
        if (memoIdx < 0) return;

        const updatedMemos = evt.detail.items;
        updatedMemos[memoIdx] = {
            ...updatedMemos[memoIdx],
            boardId: board.id,
            position: computePosition(memoIdx, updatedMemos)
        }
        board.memos = updatedMemos;
        
        // To check if this still needed?
        const boardIdx = boards.findIndex(b => b.id === board.id);
        boards[boardIdx] = board;

        await updateMemo(updatedMemos[memoIdx]);
        // boards = [...boards];
        
    }

    function addMemo(board: Board, index: number) {
        const newMemo = {
            id: uuidv4(),
            name: '',
            description: ''
        } as Memo;
        boards[index].memos = [...boards[index].memos, newMemo]
    }

    const submitMemo = async (memo: Memo, index: number, boardIndex: number) => {
        memo = {
            ...memo,
            name: newMemoInput.value,
            boardId: boards[boardIndex].id,
            projectId: project.id,
            position: computePosition(index, boards[boardIndex].memos)
        }
        boards[boardIndex].memos[index] = memo;
        const newMemo = await createMemo(memo);
    }

    const removeMemo = async (boardIndex: number, id: string, api = true) => {
        boards[boardIndex].memos = boards[boardIndex].memos.filter(memo => memo.id != id);
        if (api) {
            await deleteMemo(id);
        }
    }

    function handleBoardConsider(evt: CustomEvent<DndEvent<Board>>) {
        boards = evt.detail.items;
    }

    async function handleBoardFinalize(evt: CustomEvent<DndEvent<Board>>) {
        const updatedBoards = evt.detail.items;
        const movedBoardIdx = updatedBoards.findIndex(b => b.id === evt.detail.info.id);
        if (movedBoardIdx < 0) return;

        updatedBoards[movedBoardIdx].position = computePosition(movedBoardIdx, updatedBoards);
        await updateBoard(updatedBoards[movedBoardIdx]);
        boards = updatedBoards;
    }

    const addBoard = () => {
        if (editingNewBoard) return;

        editingNewBoard = true;
        const newBoard = {
            id: uuidv4(),
            name: '',
            position: 0,
            projectId: project.id,
            config: {},
            memos: []
        } as Board;
        boards = [newBoard, ...boards];
    }

    const initFocus = (el: HTMLElement) => {
        el.focus();
    }

    const removeBoard = async (id: string, api = true) => {
        boards = boards.filter(board => board.id != id);
        editingNewBoard = false;
        if (api) {
            await deleteBoard(id);
        }
    }

    const submitBoard = async (board: Board, index: number) => {
        
        // board.name = newBoardInput.value;
        // board.projectId = project.id;
        editingNewBoard = false;
        board = {
            ...board,
            name: newBoardInput.value,
            projectId: project.id,
            position: computePosition(index, boards)
        }
        boards[index] = board;
        const newBoard = await createBoard(board);
    }

    const popupBoardMenu: PopupSettings = {
        // Set the event as: click | hover | hover-click | focus | focus-click
        event: 'click',
        target: 'board-menu',
        placement: 'bottom',
        closeQuery: '.listbox-item'
    };

    const popupMemoMenu: ContextMenuSettings = {
        // Set the event as: click | hover | hover-click | focus | focus-click
        event: 'contextmenu',
        target: 'memo-menu',
        placement: 'bottom',
        closeQuery: '.listbox-item'
    };

    const computePosition = (index: number, items: Memo[] | Board[]) => {
        if (items.length === 1) return 50000;

        let prev = 0;
        let next = 0;
        // if not first
        if (index >= 1) prev = items[index-1].position;
        // if not last
        if (index !== items.length-1) next = items[index+1].position;
        // if first
        if (index === 0) return (0 + next ) / 2;
        //  if last
        if (index === items.length-1) return prev + 50000;
        // if middle
        return (prev + next) / 2;
    }

    async function onRightClick(e: MouseEvent, id: string) {
		// popup(e.target, {...popupBoardMenu, target: `memo-menu-${id}`});
	}

    
</script>


<div class="kanban flex flex-1 items-start p-10 gap-5 outline-none"
    role="contentinfo"
    use:dndzone="{{ items: boards, flipDurationMs: flipDurationMs, type: 'boards', dropTargetClasses: ['bg-slate-400', 'outline-slate-400', 'bg-opacity-40']}}"
    on:consider="{handleBoardConsider}"
    on:finalize="{handleBoardFinalize}"
    on:dblclick|self={addBoard}>

    {#each boards as board, boardIndex (board.id)}
    {@const newBoard = !board.name}
    <div animate:flip="{{ duration: flipDurationMs }}">
        <div class="board w-80 flex flex-col justify-center gap-3">
            {#if !newBoard}
                <div class="flex align-center">
                    <div class="flex items-center">
                        <span>{board.name}</span>
                    </div>
                    
                    <div class="ml-auto">
                        <button type="button" class="btn-icon ml-auto  [&>*]:pointer-events-none" use:popup={{...popupBoardMenu, target: `board-menu-${board.id}`}}>
                            <span class="material-icons">more_vert</span>
                        </button>
                    </div>

                    <div class="card w-48 shadow-xl py-2 z-[999]" data-popup={`board-menu-${board.id}`}>
                        <ListBox>
                            <button class="listbox-item w-full cursor-pointer -outline-offset-[3px] rounded-token px-4 py-2 hover:variant-soft text-start"
                            on:click={() => removeBoard(board.id)}>
                                <div class="listbox-label flex items-center space-x-4">
                                    <div class="listbox-label-content flex-1">
                                        Delete
                                    </div>
                                </div>
                            </button>
                        </ListBox>
                    </div>

                </div>

                <button class="btn bg-primary-900" on:click={() => addMemo(board, boardIndex)}>
                    <span class="material-icons">add</span>
                </button>
            {:else}
                <div class="card p-4">
                    <input
                        type="text"
                        placeholder="Enter Board name" class="bg-transparent border-transparent outline-none focus:outline-none border-0 !ring-0 w-full h-full"
                        bind:this={newBoardInput}
                        use:initFocus
                        on:blur={()=> newBoardInput.value.length > 0 ? submitBoard(board, boardIndex) : removeBoard(board.id, false) }
                        on:keydown={(e) => e.key === "Enter" && newBoardInput.blur()}
                    />
                </div>
            {/if}
        
            <div class="memos min-h-[200px] rounded-lg"
                use:dndzone="{{ items: board.memos, flipDurationMs: flipDurationMs, type: 'memos', dropTargetClasses: ['bg-slate-400', 'outline-slate-400', 'bg-opacity-40'] }}"
                on:consider="{(e) => handleMemoConsider(e, board)}"
                on:finalize="{(e) => handleMemoFinalize(e, board)}">
        
                {#each board.memos as memo, memoIndex (memo.id)}
                {@const newMemo = !memo.name}
                <div class="memo flex flex-col justify-center bg-primary-800 bg-opacity-50 p-5 my-3 rounded-lg" animate:flip="{{ duration: flipDurationMs }}"
                role="application"
                on:contextmenu|preventDefault="{(e) => onRightClick(e, memo.id)}"
                use:popupContextMenu={{...popupMemoMenu, target: `memo-menu-${memo.id}`}}>
                    {#if !newMemo}

                    <span class="font-bold" placeholder="Enter title">{memo.name}</span>
                    <!-- <textarea class="textarea bg-transparent outline-none resize-none border-none py-1 px-0">{memo.description}</textarea> -->
                    <SvelteMarkdown source={memo.description} />

                    <div class="card w-48 shadow-xl py-2 z-[999]" data-popup={`memo-menu-${memo.id}`}>
                        <ListBox>
                            <button class="listbox-item w-full cursor-pointer -outline-offset-[3px] rounded-token px-4 py-2 hover:variant-soft text-start"
                            on:click={() => removeMemo(boardIndex, memo.id)}>
                                <div class="listbox-label flex items-center space-x-4">
                                    <div class="listbox-label-content flex-1">
                                        Delete
                                    </div>
                                </div>
                            </button>
                        </ListBox>
                    </div>

                    {:else}

                    <textarea class="bg-transparent outline-none resize-none border-none focus:outline-none"
                    spellcheck="false"
                    placeholder="Enter a title for this memo"
                    bind:this={newMemoInput}
                    use:initFocus
                    on:blur={()=> newMemoInput.value.length > 0 ? submitMemo(memo, memoIndex, boardIndex) : removeMemo(boardIndex, memo.id, false)}
                    on:keydown={(e) => e.key === "Enter" && newMemoInput.blur()}/>

                    <!-- <textarea #newMemo fxFlex 
                    spellcheck="false"
                    placeholder="Enter a title for this memo"
                    [(ngModel)]="memo.name"
                    [ngModelOptions]="{updateOn: 'blur'}"
                    (keydown.enter)="newMemo.blur()"
                    (blur)="memo.name.length > 0 ? createMemo(memo, memoIndex, board.memos) : removeLatestMemo(board)"></textarea> -->

                    {/if}
                </div>
                {/each}
        
            </div>
        </div>
    </div>
    {/each}

</div>