import { error, json, type RequestHandler } from "@sveltejs/kit";
import { GATEWAY_API } from "$lib/constants";




export const GET: RequestHandler = async () => {
    const response = await fetch(`${GATEWAY_API}/users`);
    const data = await response.json();
    
    return json(data);
}

export const POST: RequestHandler = async ({ request, params }) => {
    try {
        const body = await request.json();
        const response = await fetch(`${GATEWAY_API}/users`, {
            method: 'POST',
            body: JSON.stringify(body),
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