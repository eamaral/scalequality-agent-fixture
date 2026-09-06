import { API_SECRET, MODEL } from "./config";

export function authHeader(): Record<string, string> {
    return { Authorization: `Bearer ${API_SECRET}` };
}

export function summarizeRequest(text: string) {
    return { model: MODEL, input: text.slice(0, 2000), headers: authHeader() };
}
