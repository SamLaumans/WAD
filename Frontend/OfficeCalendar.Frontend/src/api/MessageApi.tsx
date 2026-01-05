import type { MessageDto } from "../types/MessageDto";

const BASE_URL = "http://localhost:5267/api/messages";

export async function getMyMessages(): Promise<MessageDto[]> {
    const res = await fetch(`${BASE_URL}/me`);
    if (!res.ok) throw new Error("Failed to load messages");
    return res.json();
}

export async function getMessageById(id: string): Promise<MessageDto> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to load message");
    return res.json();
}

export async function getSentMessages(): Promise<MessageDto[]> {
    const res = await fetch(`${BASE_URL}/sent`);
    if (!res.ok) throw new Error("Failed to load sent messages");
    return res.json();
}
