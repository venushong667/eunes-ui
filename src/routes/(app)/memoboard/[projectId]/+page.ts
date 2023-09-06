import type { PageLoad } from './$types.js';
import type { Project } from '../interfaces.js';
import { redirect } from "@sveltejs/kit";

export const load = (async ({ fetch, params }) => {
    const projectRes = await fetch(`/api/memoboard/project`);
    const projects = await projectRes.json() satisfies Project[];
    
    let currentProject = projects.find((project: Project) => project.id === params.projectId);
    
    if (!currentProject) {
        currentProject = projects[0];
        throw redirect(302, `/memoboard/${currentProject.id}`);
    }

    const curProjectRes = await fetch(`/api/memoboard/project/${currentProject.id}?board=true&memo=true`)
    currentProject = <Project>(await curProjectRes.json());
    
    // const boardRes = await fetch('/api/memoboard/board');
    // const boards = await boardRes.json() as Board[];
    // const memosRes = await fetch('/api/memoboard/memo');
    // const memos = await memosRes.json() as Memo[];
    
    // if (memos) {
    //     boards.forEach((board: Board) => {
    //         board.memos = memos.filter((memo: Memo) => {
    //             return memo.boardId === board.id;
    //         });
    //     })
    // }

    return {
        projects, currentProject
    };
}) satisfies PageLoad;