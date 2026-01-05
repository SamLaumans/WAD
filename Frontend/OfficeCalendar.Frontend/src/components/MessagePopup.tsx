import { useEffect, useState } from "react";
import type { MessageDto } from "../types/MessageDto";
import { getMyMessages, getMessageById, getSentMessages, sendMessage } from "../api/MessageApi";
import "../Styling/MessagePopup.css";

interface Props {
    onClose: () => void;
}

export default function MessagePopup({ onClose }: Props) {
    const [loadedMessages, setLoadedMessages] = useState<MessageDto[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<MessageDto | null>(null);

    const [sendTitle, setSendTitle] = useState('');
    const [sendDesc, setSendDesc] = useState('');
    const [sendReceivers, setSendReceivers] = useState<any[]>([]);

    const [receiverSearch, setReceiverSearch] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const [skip, setSkip] = useState(0);

    const [loading, setLoading] = useState(false);

    const [hasMore, setHasMore] = useState(true);

    const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'send'>('inbox'); 

    const [sentMessages, setSentMessages] = useState<MessageDto[]>([]);

    useEffect(() => {
        const cached = localStorage.getItem('messageCache');
        if (cached) {
            try {
                const data = JSON.parse(cached);
                const now = Date.now();
                if (data.timestamp && (now - data.timestamp) < 10 * 60 * 1000) { // 10 minutes
                    setLoadedMessages(data.messages);
                    setSkip(data.messages.length);
                    if (data.messages.length < 50) setHasMore(false);
                    return;
                }
            } catch (e) {
                console.error('Failed to parse cached messages:', e);
            }
        }
        loadMessages();
    }, []);

    useEffect(() => {
        if (!receiverSearch) {
            setSearchResults([]);
            return;
        }

        const controller = new AbortController();

        fetch(`http://localhost:5267/api/SearchUsers?query=${receiverSearch}`, {
            signal: controller.signal
        })
            .then(res => res.json())
            .then(data => setSearchResults(data))
            .catch(err => {
                if (err.name !== "AbortError") console.error("Error loading users:", err);
            });

        return () => controller.abort();
    }, [receiverSearch]);

    async function loadMessages() {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const newMsgs = await getMyMessages(skip, 50);
            const sorted = [...loadedMessages, ...newMsgs].sort((a, b) =>
                new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
            );
            setLoadedMessages(sorted);
            localStorage.setItem('messageCache', JSON.stringify({ messages: sorted, timestamp: Date.now() }));
            setSkip(prev => prev + 50);
            if (newMsgs.length < 50) setHasMore(false);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    }

    async function loadSent() {
        const msgs = await getSentMessages(0, 1000);
        const sorted = msgs.sort((a, b) =>
            new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
        );
        setSentMessages(sorted);
    }

    function openMessage(message: MessageDto) {
        setSelectedMessage(message);
        if (activeTab === 'send') {
            const isSent = sentMessages.some(m => m.id === message.id);
            setActiveTab(isSent ? 'sent' : 'inbox');
        }
    }

    async function handleSendMessage() {
        const receivers = sendReceivers.map(r => r.username);

        if (!sendTitle || !sendDesc || receivers.length === 0) {
            alert('Please fill all fields and select at least one receiver');
            return;
        }

        try {
            await sendMessage(sendTitle, sendDesc, receivers);

            setSendTitle('');
            setSendDesc('');
            setSendReceivers([]);
            setReceiverSearch('');

            const msgs = await getMyMessages(0, 1000);
            const sorted = msgs.sort((a, b) =>
                new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
            );
            setLoadedMessages(sorted);
            localStorage.setItem('messageCache', JSON.stringify({ messages: sorted, timestamp: Date.now() }));
            setSkip(sorted.length);
            setHasMore(sorted.length >= 1000);
            setActiveTab('sent');
            loadSent();

        } catch (error: any) {
            alert(error.message || 'Failed to send message');
        }
    }

    function handleScroll(e: React.UIEvent<HTMLElement>) {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            loadMessages();
        }
    }

    return (
        <div className="message-popup">
            <div className="message-popup-content">
                <aside className="message-list" onScroll={handleScroll}>
                    <div className="message-headers">
                        <h3 className={`message-header-3 ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => { setActiveTab('inbox'); setSelectedMessage(null); }} style={{ cursor: 'pointer' }}>Messages</h3>
                        <h3 className={`message-header-3 ${activeTab === 'sent' ? 'active' : ''}`} onClick={() => { setActiveTab('sent'); setSelectedMessage(null); loadSent(); }} style={{ cursor: 'pointer' }}>Sent Messages</h3>
                        <h3 className={`message-header-3 ${activeTab === 'send' ? 'active' : ''}`} onClick={() => { setActiveTab(activeTab === 'send' ? 'inbox' : 'send'); setSelectedMessage(null); }} style={{ cursor: 'pointer' }}>Send Message</h3>
                    </div>
                    <ul className="message-ul">
                        {(activeTab === 'inbox' ? loadedMessages : sentMessages).map(m => (
                            <li
                                key={m.id}
                                onClick={() => openMessage(m)}
                                className={selectedMessage?.id === m.id ? "active" : ""}
                            >
                                <div>From: {m.sender_username}</div>
                                <strong className="message-preview-title">{m.title}</strong>
                                <div className="message-preview-message">{m.desc}</div>
                            </li>
                        ))}
                        {loading && activeTab === 'inbox' && <li>Loading...</li>}
                    </ul>
                </aside>

                <section className="message-detail">
                    {activeTab === 'send' ? (
                        <div>
                            <h2>Send Message</h2>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Search Recipients:</label>
                                <input
                                    type="text"
                                    placeholder="Search by username..."
                                    autoComplete="off"
                                    value={receiverSearch}
                                    onChange={(e) => setReceiverSearch(e.target.value)}
                                    style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                                />
                                
                                {searchResults.length > 0 && receiverSearch && (
                                    <div className="message-recipient-search-result">
                                        {searchResults.map((user) => (
                                            <div className="message-result-list"
                                                key={user.username}
                                                onClick={() => {
                                                    if (!sendReceivers.find(r => r.username === user.username)) {
                                                        setSendReceivers([...sendReceivers, user]);
                                                    }
                                                    setReceiverSearch('');
                                                    setSearchResults([]);
                                                }}
                                            >
                                                {user.username}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {sendReceivers.length > 0 && (
                                    <div style={{ marginBottom: '8px' }}>
                                        <label>Selected Recipients:</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                            {sendReceivers.map((user) => (
                                                <div
                                                    key={user.username}
                                                    style={{
                                                        backgroundColor: '#4CAF50',
                                                        color: 'white',
                                                        padding: '5px 10px',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px'
                                                    }}
                                                >
                                                    {user.username}
                                                    <button
                                                        onClick={() => setSendReceivers(sendReceivers.filter(r => r.username !== user.username))}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: 'white',
                                                            cursor: 'pointer',
                                                            fontSize: '16px'
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <input
                                type="text"
                                placeholder="Title"
                                value={sendTitle}
                                onChange={(e) => setSendTitle(e.target.value)}
                            />
                            <textarea
                                placeholder="Message"
                                value={sendDesc}
                                onChange={(e) => setSendDesc(e.target.value)}
                            />
                            <button onClick={handleSendMessage}>Send</button>
                            <button onClick={() => { setActiveTab('inbox'); setSendTitle(''); setSendDesc(''); setSendReceivers([]); setReceiverSearch(''); }}>Cancel</button>
                        </div>
                    ) : !selectedMessage ? (
                        <p>Select a message</p>
                    ) : (
                        <>
                            <p className="message-p">
                                <strong>From:</strong> {selectedMessage.sender_username}<br />
                                <strong>Sent:</strong>{" "}
                                {new Date(selectedMessage.creation_date).toLocaleString()}
                            </p>
                            <div className="message-title">{selectedMessage.title}</div>
                            <hr />
                            <p>{selectedMessage.desc}</p>
                        </>
                    )}
                </section>

                <button className="close-btn" onClick={onClose}>x</button>
            </div>
        </div>
    );
}
