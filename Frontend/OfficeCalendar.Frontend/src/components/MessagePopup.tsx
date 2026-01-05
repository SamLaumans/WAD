import { useEffect, useState } from "react";
import type { MessageDto } from "../types/MessageDto";
import { getMyMessages, getMessageById } from "../api/MessageApi";
import "../Styling/MessagePopup.css";

interface Props {
    onClose: () => void;
}

export default function MessagePopup({ onClose }: Props) {
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<MessageDto | null>(null);

    useEffect(() => {
        getMyMessages().then(setMessages);
    }, []);

    async function openMessage(id: string) {
        const msg = await getMessageById(id);
        setSelectedMessage(msg);
    }

    return (
        <div className="message-popup-content">
            <aside className="message-list">
                <h3>Messages</h3>
                <ul>
                    {messages.map(m => (
                        <li
                            key={m.id}
                            onClick={() => openMessage(m.id)}
                            className={selectedMessage?.id === m.id ? "active" : ""}
                        >
                            <strong>{m.title}</strong>
                            <div>{m.sender_username}</div>
                        </li>
                    ))}
                </ul>
            </aside>

            <section className="message-detail">
                {!selectedMessage && <p>Select a message</p>}

                {selectedMessage && (
                    <>
                        <h2>{selectedMessage.title}</h2>
                        <p>
                            <strong>From:</strong> {selectedMessage.sender_username}<br />
                            <strong>Date:</strong>{" "}
                            {new Date(selectedMessage.creation_date).toLocaleString()}
                        </p>
                        <hr />
                        <p>{selectedMessage.desc}</p>
                    </>
                )}
            </section>

            <button className="close-btn" onClick={onClose}>×</button>
        </div>
    );
}
