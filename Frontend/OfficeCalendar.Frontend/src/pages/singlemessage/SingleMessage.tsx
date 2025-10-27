import './SingleMessage.css';
import { useState, type JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import messageData from "../../assets/messages.json"

function SingleMessage() {

    const navigate = useNavigate()
    const { messageID } = useParams<{ messageID: string }>();

    interface Message {
        messageID: string;
        title: string;
        message: string;
    }

    const messages: Message[] = messageData.messages;

    return (
        <div className="singlemessage-wrapper">
            <div className='singlemessage-back' onClick={() => navigate("/messages")}>&lt; Terug</div>
            <div className='singlemessages-title'>
                {messages.find(msg => msg.messageID === messageID)?.title}
                <div className='singlemessages-message'>
                    {messages.find(msg => msg.messageID === messageID)?.message}
                </div>
            </div>

        </div>
    );
}

export default SingleMessage;
