import './Main-Page.css';
import { useState, type JSX } from 'react';
import messageData from "../../assets/messages.json";
import eventData from "../../assets/events.json";
import Clock from '../../components/Clock';
import DayPlanner from '../../components/DayPlanner';

function Main_Page() {
    const [today] = useState(new Date()); // voor DayPlanner preview

    interface Message {
        messageID: string;
        senderID: string;
        receiverID: string[];
        title: string;
        message: string;
    }

    interface Event {
        eventID: string;
        title: string;
        description: string;
    }

    const messages: Message[] = messageData.messages;
    const events: Event[] = eventData.events;

    const getMessageTitles = (receiverid: string): JSX.Element[] => {
        if (messages.length > 0) {
            const titles: JSX.Element[] = [];
            for (let i = 0; i < messages.length && i < 3; i++) {
                if (messages[i].receiverID.includes(receiverid))
                    titles.push(
                        <div
                            key={messages[i].messageID}
                            className='message'
                        >
                            - {messages[i].title}
                        </div>
                    );
            }
            return titles;
        } else return [];
    };

    const getEventTitles = (): JSX.Element[] => {
        if (events.length > 0) {
            const titles: JSX.Element[] = [];
            for (let i = 0; i < events.length && i < 3; i++) {
                titles.push(
                    <div
                        key={events[i].eventID}
                        className='event'
                    >
                        - {events[i].title}
                    </div>
                );
            }
            return titles;
        } else return [];
    };

    return (
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

                <div className='bulletin'>
                    <h2>Berichten ({getMessageTitles("1").length})</h2>
                    {getMessageTitles("1")}
                </div>

                <div className='events'>
                    <h2>Evenementen ({events.length})</h2>
                    {getEventTitles()}
                </div>

            </div>
        </div>
    );
}

export default Main_Page;