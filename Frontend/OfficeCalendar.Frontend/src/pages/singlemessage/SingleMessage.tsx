import './SingleMessage.css';
import { useState, type JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import messageData from "../../assets/messages.json"

function SingleMessage() {

    const navigate = useNavigate()
    const { messageID } = useParams<{ messageID: string }>();

    interface Message {
        messageID: number;
        title: string;
        message: string;
    }

    const messages: Message[] = messageData.messages;

    return (
        <div className="singlemessage-wrapper">
            <div className='singlemessages-title'>
                {messages.find(msg => msg.messageID === Number(messageID))?.title}
                <div className='singlemessages-message'>
                    {messages.find(msg => msg.messageID === Number(messageID))?.message}
                </div>
            </div>

        </div>
    );
}

export default SingleMessage;
