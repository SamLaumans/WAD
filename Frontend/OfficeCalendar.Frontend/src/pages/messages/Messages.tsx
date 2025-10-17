import './Messages.css';
import { useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import messageData from "../../assets/messages.json"

function Messages() {

    const navigate = useNavigate()

    interface Message {
        messageID: number;
        title: string;
        message: string;
    }

    const messages: Message[] = messageData.messages;

    const getMessages = (): JSX.Element[] => {
        if (messages.length > 0) {
            const titles: JSX.Element[] = [];
            for (let i = 0; i < messages.length; i++) {
                titles.push(
                    <div className='messages-message'>
                        <div className='messages-title'>{messages[i].title}</div>
                        <div className='messages-desc'>{messages[i].message}</div>
                    </div>
                )
            }
            return titles
        }
        else return [];
    }

    return (
        <div className="messages-message-wrapper">
            <h2 className='messages-h2'>Berichten ({getMessages().length})</h2>
            {getMessages()}
        </div>
    );
}

export default Messages;
