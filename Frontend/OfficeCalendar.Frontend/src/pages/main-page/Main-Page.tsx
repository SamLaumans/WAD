import './Main-Page.css';
import { useState, useEffect, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import eventData from "../../assets/events.json";
import type { MessageDto } from '../../types/MessageDto';
import Clock from '../../components/Clock';
import DayPlanner from '../../components/DayPlanner';
import MessagePopup from '../../components/MessagePopup';

function Main_Page() {
    const navigate = useNavigate();
    const [today] = useState(new Date()); // voor DayPlanner preview
    const [messages, setMessages] = useState<MessageDto[]>([]);
    const [showMessages, setShowMessages] = useState(false);


    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('/api/messages/me?skip=0&take=3');
                if (response.ok) {
                    const data: MessageDto[] = await response.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();
    }, []);

    const getMessageTitles = (): JSX.Element[] => {
        if (messages.length > 0) {
            const titles: JSX.Element[] = [];
            for (let i = 0; i < messages.length && i < 3; i++) {
                titles.push(
                    <div
                        key={messages[i].id}
                        className='message'
                    >
                        - {messages[i].title}
                    </div>
                );
            }
            return titles;
        } else return [];
    };

    return (
        <>
            <div className="main-page-wrapper">

                {/* DayPlanner preview voor vandaag */}
                <div className='dayplanner-preview-container'>
                    <div className='dayplanner-preview'>
                        <DayPlanner initialDate={today} />
                    </div>
                </div>

                <div className='infoboard'>

                    <div className='clock'>
                        <Clock />
                    </div>

                    <div className='bulletin' onClick={() => setShowMessages(true)}>
                        <h2>Berichten</h2>
                        {getMessageTitles()}
                    </div>

                    <div className='events' onClick={() => navigate("/events")}>
                        <h2>Evenementen</h2>
                    </div>

                </div>
            </div>
            {showMessages && (
                <div className="message-overlay" onClick={() => setShowMessages(false)}>
                    <div className="message-modal" onClick={(e) => e.stopPropagation()}>
                        <MessagePopup onClose={() => setShowMessages(false)} />
                    </div>
                </div>
            )}
        </>
    );
}

export default Main_Page;