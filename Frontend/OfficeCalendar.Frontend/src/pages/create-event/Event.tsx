import React, { useState } from "react";

function Event() {
  type FormData = {
    title: string;
    desc: string;
    start_time: string;
    end_time: string;
  };

  const [formData, setFormData] = useState<FormData>({
    title: "",
    desc: "",
    start_time: "",
    end_time: ""
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
      start_time: new Date(`1970-01-01T${formData.start_time}:00`),
      end_time: new Date(`1970-01-01T${formData.end_time}:00`),
      booking_id: null
    };

    const res = await fetch("http://localhost:5000/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (res.ok) alert("Event aangemaakt!");
    else alert("Fout bij opslaan!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Titel</label>
      <input name="title" value={formData.title} onChange={handleChange} />

      <label>Beschrijving</label>
      <textarea name="desc" value={formData.desc} onChange={handleChange} />

      <label>Starttijd</label>
      <input
        type="time"
        name="start_time"
        value={formData.start_time}
        onChange={handleChange}
      />

      <label>Eindtijd</label>
      <input
        type="time"
        name="end_time"
        value={formData.end_time}
        onChange={handleChange}
      />

      <button type="submit">Event Aanmaken</button>
    </form>
  );
}

export default Event;
