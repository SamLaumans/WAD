import React, { useState } from "react";
import "./Event.css";

type Slot = {
  day: string;
  time: string;
};

type Props = {
  slot?: Slot | null;
  onClose?: () => void;
};

function Event({ slot, onClose }: Props) {
  type FormData = {
    title: string;
    description: string;
    start_time: string;
    end_time: string;
  };

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
  });

  // vul start/end tijd als er een slot is (bv. "09:30" -> eind +1 uur)
  useEffect(() => {
    if (!slot) return;
    const start = slot.time;
    // Probeer tijd + 1 uur
    const [hh, mm] = start.split(":").map((s) => parseInt(s, 10));
    if (!isNaN(hh)) {
      const endDate = new Date();
      endDate.setHours(hh + 1, isNaN(mm) ? 0 : mm, 0, 0);
      const endStr = `${endDate.getHours().toString().padStart(2, "0")}:${endDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      const startDateTime = `${slot.day}T${start}:00`;
      const endDateTime = `${slot.day}T${endStr}:00`;
      setFormData((prev) => ({ ...prev, start_time: startDateTime, end_time: endDateTime }));
    } else {
      const startDateTime = `${slot.day}T${start}:00`;
      setFormData((prev) => ({ ...prev, start_time: startDateTime }));
    }
  }, [slot]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // optional: read username from localStorage if available
    const creator_username = localStorage.getItem("username") ?? undefined;
    console.log("creator_username:", creator_username);

    const payload: any = {
      title: formData.title,
      desc: formData.description,
      start_time: formData.start_time,
      end_time: formData.end_time,
    };

    try {
      const res = await fetch(`http://localhost:5267/api/events?creator=${creator_username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 201 || res.ok) {
        // Event succesvol aangemaakt
        alert("Event succesvol aangemaakt!");
        // optioneel: gebruik returned data (data.id) voor iets
        // reset form
        setFormData({
          title: "",
          description: "",
          start_time: "",
          end_time: "",
        });
        onClose?.();
      } else {
        console.log("Response status:", res.status);
        const err = await res.json().catch(() => null);
        const msg = err?.error ?? (await res.text());
        console.log("Error message:", msg);
        alert("Fout bij aanmaken event: " + msg);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Netwerkfout bij aanmaken event: " + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">

      <div id="form-wrapper">
        <form onSubmit={handleSubmit} className="event-form">
          <div id="form">
            <label>Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />

            <label>Start Time (ISO format)</label>
            <input
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
              placeholder="2025-12-01T09:30:00"
            />

            <label>End Time (ISO format)</label>
            <input
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
              placeholder="2025-12-01T10:30:00"
            />

            <button className="event-button" type="submit">
              Aanmaken
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Event;
