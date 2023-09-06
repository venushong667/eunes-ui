import type { PageLoad } from "./$types";
import type { Project } from './interfaces.js';
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = (async ({ fetch }) => {
    const projectRes = await fetch(`/api/memoboard/project`);
    const projects = await projectRes.json() as Project[];
    
    if (projects.length === 0) {
        // Not implemented yet
        throw redirect(302, '/memoboard/create');
    }

    // currentProject should be last visited (Required user state storage, Not implemented yet)
    const currentProject = projects[0]
    throw redirect(302, `/memoboard/${currentProject.id}`);
})