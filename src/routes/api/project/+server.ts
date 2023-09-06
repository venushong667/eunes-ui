import { json, type RequestHandler } from "@sveltejs/kit";
import { GATEWAY_API } from "../../../lib/constants";


const MEMOBOARD_API = `${GATEWAY_API}/api/memoboard`

export const GET: RequestHandler = async () => {
    const response = await fetch(`${MEMOBOARD_API}/projects`);
    const data = await response.json();

    return json(data);
}