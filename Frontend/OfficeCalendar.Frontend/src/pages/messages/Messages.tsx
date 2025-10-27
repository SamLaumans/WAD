import './Messages.css';
import { useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import messageData from "../../assets/messages.json"

function Messages() {

    const navigate = useNavigate()

    interface Message {
        messageID: string;
        senderID: string;
        receiverID: string[];
        title: string;
        message: string;
    }

    const messages: Message[] = messageData.messages;

    const getMessages = (receiverId: string): JSX.Element[] => {
        if (messages.length > 0) {
            const titles: JSX.Element[] = [];
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].receiverID.includes(receiverId))
                    titles.push(
                        <div className='messages-message' onClick={() => navigate(`/messages/${messages[i].messageID}`)}>
                            <div className='messages-title'>{messages[i].title}</div>
                            <div className='messages-desc'>{messages[i].message}</div>
                        </div>
                    )
            }
            return titles
        }
        else return [];
    }

    const getSentMessages = (senderid: string): JSX.Element[] => {
        if (messages.length > 0) {
            const titles: JSX.Element[] = [];
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].senderID == senderid)
                    titles.push(
                        <div className='messages-message-sent' onClick={() => navigate(`/messages/${messages[i].messageID}`)}>
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
            <div className='messages-back' onClick={() => navigate("/main-page")}>&lt; Terug</div>

            <div className='messages-logic-wrapper'>
                <div className='messages-receive-block'>
                    <h2 className='messages-received'>Berichten ({getMessages("1").length})</h2>
                    {getMessages("1")}
                </div>
                <div className='messages-sending-block'>
                    <h2 className='messages-sending'>Versturen ⇆</h2>
                    <div className='messages-message-sender' onClick={() => navigate(`/send-message`)}>
                        ⌯⌲ Bericht versturen
                    </div>
                    <div className='messages-messages-sent'>
                        Verstuurde berichten:
                    </div>
                    {getSentMessages("1")}
                </div>
            </div>
        </div>
    );
}

export default Messages;
