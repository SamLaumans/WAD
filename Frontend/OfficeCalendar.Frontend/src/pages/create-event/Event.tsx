import React, { useState } from "react";
import "./Event.css";

type Slot = {
  day: string;
  time: string;
  date: string;
};

type Props = {
  slot?: Slot;
  onClose: () => void;
  onEventCreated?: () => void;
};

function Event({ slot, onClose, onEventCreated }: Props) {
  type FormData = {
    title: string;
    desc: string;
    start_time: string;
    end_time: string;
  };

  const [formData, setFormData] = useState<FormData>({
    title: "",
    desc: "",
    start_time: slot?.time ?? "",
    end_time: "",
  });

  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5267/api/SearchUsers?query=${query}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const addUser = (username: string) => {
    if (!invitedUsers.includes(username)) {
      setInvitedUsers([...invitedUsers, username]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeUser = (username: string) => {
    setInvitedUsers(invitedUsers.filter(u => u !== username));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = {
      title: formData.title,
      desc: formData.desc,
      start_time: new Date(`${slot?.date ?? new Date().toISOString().split('T')[0]}T${formData.start_time}:00Z`),
      end_time: new Date(`${slot?.date ?? new Date().toISOString().split('T')[0]}T${formData.end_time}:00Z`),
      booking_id: null,
      invitedUsers: invitedUsers
    };

    console.log('Sending body:', body);

    const res = await fetch("http://localhost:5267/api/Events", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      console.log('Event created successfully');
      alert("Event succesvol aangemaakt!");
      onEventCreated?.();
      onClose();
    } else {
      console.log('Failed to create event:', res.status, await res.text());
      alert("Er ging iets mis bij het opslaan van het event.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">

      <label>Titel</label>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label>Beschrijving</label>
      <textarea
        name="desc"
        rows={3}
        value={formData.desc}
        onChange={handleChange}
      />

      <label>Start tijd</label>
      <input
        type="time"
        name="start_time"
        value={formData.start_time}
        onChange={handleChange}
        required
      />

      <label>Eind tijd</label>
      <input
        type="time"
        name="end_time"
        value={formData.end_time}
        onChange={handleChange}
        required
      />

      <label>Gebruikers uitnodigen</label>
      <input
        type="text"
        placeholder="Zoek gebruikers..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {searchResults.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, border: '1px solid #ccc', maxHeight: '100px', overflowY: 'auto' }}>
          {searchResults.map(user => (
            <li key={user.username} onClick={() => addUser(user.username)} style={{ cursor: 'pointer', padding: '5px' }}>
              {user.nickname} ({user.username})
            </li>
          ))}
        </ul>
      )}
      {invitedUsers.length > 0 && (
        <div>
          <label>Uitgenodigde gebruikers:</label>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {invitedUsers.map(username => (
              <li key={username} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {username}
                <button type="button" onClick={() => removeUser(username)}>Verwijder</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="event-button" type="submit">
        Event aanmaken
      </button>
    </form>
  );
}

export default Event;
