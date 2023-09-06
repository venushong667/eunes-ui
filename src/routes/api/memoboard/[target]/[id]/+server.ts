import { error, json, type RequestHandler } from "@sveltejs/kit";
import { GATEWAY_API } from "$lib/constants";


const MEMOBOARD_API = `${GATEWAY_API}`

type Target = 'memo' | 'board' | 'project'

function isTarget(value: unknown): value is Target {
    return ['memo', 'board', 'project'].includes(value as string);
}

export const GET: RequestHandler = async ({ params, url }) => {
    const target: Target = params.target as Target;
    if (!isTarget(target)) throw error(403, 'Invalid target.');
    
    const response = await fetch(`${MEMOBOARD_API}/${target}/${params.id}?${url.searchParams.toString()}`);
    const data = await response.json();

    return json(data);
}


export const PUT: RequestHandler = async ({ request, params }) => {
    const target: Target = params.target as Target;
    if (!isTarget(target)) throw error(403, 'Invalid target.');

    const response = await fetch(`${MEMOBOARD_API}/${target}/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(await request.json()),
        headers: {
            'content-type': 'application/json'
        }
    }).catch(( err: unknown ) => {
        // API server res.send with error status code won't trigger error catching, only throw does. Need some way to catch.
        console.log(err);
        throw error(500, 'Something went wrong.');
    })
    const data = await response.json();

    return json(data);
}

export const DELETE: RequestHandler = async ({ params }) => {
    const target: Target = params.target as Target;
    if (!isTarget(target)) throw error(403, 'Invalid target.');

    const response = await fetch(`${MEMOBOARD_API}/${target}/${params.id}`, {
        method: 'DELETE',
    }).catch(( err: unknown ) => {
        // API server res.send with error status code won't trigger error catching, only throw does. Need some way to catch.
        console.log(err);
        throw error(500, 'Something went wrong.');
    })
    const data = await response.json();

    return json(data);
}