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
};

function Event({ slot, onClose }: Props) {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = {
      title: formData.title,
      desc: formData.desc,
      start_time: new Date(`${slot?.date ?? new Date().toISOString().split('T')[0]}T${formData.start_time}:00`),
      end_time: new Date(`${slot?.date ?? new Date().toISOString().split('T')[0]}T${formData.end_time}:00`),
      booking_id: null
    };

    const res = await fetch("http://localhost:5267/api/Events", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(localStorage.getItem('token') ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert("Event succesvol aangemaakt!");
      onClose();
    } else {
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

      <button className="event-button" type="submit">
        Event aanmaken
      </button>
    </form>
  );
}

export default Event;
