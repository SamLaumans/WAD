import type { MessageDto } from "../types/MessageDto";

const BASE_URL = "http://localhost:5267/api/messages";

export async function getMyMessages(skip = 0, take = 20): Promise<MessageDto[]> {
    const res = await fetch(`${BASE_URL}/me?skip=${skip}&take=${take}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (!res.ok) throw new Error("Failed to load messages");
    return res.json();
}

export async function getMessageById(id: string): Promise<MessageDto> {
    const res = await fetch(`${BASE_URL}?messageid=${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (!res.ok) throw new Error("Failed to load message");
    return res.json();
}


export async function getSentMessages(skip = 0, take = 20): Promise<MessageDto[]> {
    const res = await fetch(`${BASE_URL}/sent?skip=${skip}&take=${take}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (!res.ok) throw new Error("Failed to load messages");
    return res.json();
}

export async function sendMessage(title: string, desc: string, receivers: string[]): Promise<void> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, desc, receivers }),
    });

    if (!res.ok) {
        let errorMsg = `Failed to send message: ${res.status}`;
        try {
            const data = await res.json();
            if (data.message) errorMsg = data.message;
        } catch (e) {
            console.error("Error parsing error response:", e);
        }
        throw new Error(errorMsg);
    }
}

