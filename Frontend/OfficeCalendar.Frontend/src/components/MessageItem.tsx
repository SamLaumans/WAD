import "./MessageItem.css";
import type { MessageDto } from "../types/MessageDto";
import { useNavigate } from "react-router-dom";

interface Props {
    message: MessageDto;
    type: "received" | "sent";
}

export default function MessageItem({ message, type }: Props) {
    const navigate = useNavigate();

    return (
        <div
            className={`message-item ${type}`}
            onClick={() => navigate(`/messages/${message.id}`)}
        >
            <div className="message-item-title">{message.title}</div>
            <div className="message-item-desc">{message.desc}</div>
        </div>
    );
}
