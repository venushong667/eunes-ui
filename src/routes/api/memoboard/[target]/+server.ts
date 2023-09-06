import { error, json, type RequestHandler } from "@sveltejs/kit";
import { GATEWAY_API } from "$lib/constants";


const MEMOBOARD_API = `${GATEWAY_API}`

// enum Target {
//     memo,
//     board,
//     project
// }
type Target = 'memo' | 'board' | 'project'

function isTarget(value: unknown): value is Target {
    return ['memo', 'board', 'project'].includes(value as string);
}

export const GET: RequestHandler = async ({ params }) => {
    const target: Target = params.target as Target;
    if (!isTarget(target)) throw error(403, 'Invalid target.');
    const response = await fetch(`${MEMOBOARD_API}/${target}s`);
    const data = await response.json();
    
    return json(data);
}

export const POST: RequestHandler = async ({ request, params }) => {
    try {
        const target: Target = params.target as Target;
        if (!isTarget(target)) throw error(403, 'Invalid target.');

        const response = await fetch(`${MEMOBOARD_API}/${target}`, {
            method: 'POST',
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
    } catch(err) {
        throw error(500, 'Something went wrong.')
    }
}
