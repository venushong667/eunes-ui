export interface Project {
    id: string;
    name: string;
    config: unknown;
    boards: Array<Board>;
}

export interface Board {
    id: string;
    name: string;
    projectId: string;
    position: number;
    config: unknown;
    memos: Array<Memo>;
}

export interface Memo {
    id: string;
    name: string;
    boardId: string;
    projectId: string;
    description: string;
    position: number;
    config: unknown;
}