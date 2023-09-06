import type { Board, Memo, Project } from "./interfaces"


export const getMemo = async () => {
    const memos = await fetch('/api/memoboard/memo')
        .then(response => response.json())
    
    return memos
}

export const createMemo = async (newMemo: Memo) => {
    const board = await fetch('/api/memoboard/memo', {
        method: 'POST',
        body: JSON.stringify(newMemo)
    })
        .then(response => response.json())
        .catch(err => console.error(err));

    return board;
}

export const updateMemo = async (updatedMemo: Memo) => {
    const board = await fetch(`/api/memoboard/memo/${updatedMemo.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedMemo)
    })
        .then(response => response.json())
        .catch(err => console.error(err));

    return board;
}

export const deleteMemo = async (id: string) => {
    const board = await fetch(`/api/memoboard/memo/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .catch(err => console.error(err));

    return board;
}

export const getProject = async (id: string, includeBoard = true, includeMemo = true) => {
    const project = await fetch(`/api/memoboard/project/${id}?board=${includeBoard}&memo=${includeMemo}`)
        .then(response => response.json())
    
    return project
}

export const createProject = async (newProject: Project) => {
    const project = await fetch('/api/memoboard/project', {
        method: 'POST',
        body: JSON.stringify(newProject)
    })
        .then(response => response.json())
        .catch(err => console.error(err));

    return project;
}

export const deleteProject = async (id: string) => {
    const project = await fetch(`/api/memoboard/project/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .catch(err => console.error(err));

    return project;
}

export const createBoard = async (newBoard: Board) => {
    const board = await fetch('/api/memoboard/board', {
        method: 'POST',
        body: JSON.stringify(newBoard)
    })
        .then(response => response.json())
        .catch(err => console.error(err));

    return board;
}

export const deleteBoard = async (id: string) => {
    const board = await fetch(`/api/memoboard/board/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .catch(err => console.error(err));

    return board;
}

export const updateBoard = async (updatedBoard: Board) => {
    const board = await fetch(`/api/memoboard/board/${updatedBoard.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedBoard)
    })
        .then(response => response.json())
        .catch(err => console.error(err));

    return board;
}