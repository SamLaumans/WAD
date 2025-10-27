import './send-message.css';
import { useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import messageData from "../../assets/messages.json"
import eventData from "../../assets/events.json"

function Send_Message() {

    const navigate = useNavigate()

    // Placeholder for now
    const apiCall = (): string => {
        return "Wow"
    }

    return (
        <div className="send-message-wrapper">
            <span className='send-message-info'>Bericht versturen:</span>
            <form className='send-message-block'>

                <div className='send-message-labeled-input'>
                    <label htmlFor='send-message-username' className='send-message-label'>Gebruikersnaam ontvanger:</label>
                    <textarea id='send-message-username' className='send-message-input' placeholder='Gebruikersnaam ontvanger'></textarea>
                </div>

                <div className='send-message-labeled-input'>
                    <label htmlFor='send-message-title' className='send-message-label'>Titel:</label>
                    <textarea id='send-message-title' className='send-message-input' placeholder='Titel'></textarea>
                </div>

                <div className='send-message-labeled-input'>
                    <label htmlFor='send-message-content' className='send-message-label'>Inhoud:</label>
                    <textarea id='send-message-content' className='send-message-input' placeholder='Inhoud'></textarea>
                </div>

                <button className='send-message-submit' onClick={() => { apiCall(); navigate("/messages"); }}>Verstuur</button>

            </form>
        </div>

    );
}

export default Send_Message;
