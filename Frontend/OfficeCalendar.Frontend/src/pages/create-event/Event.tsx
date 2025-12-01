import React, { useEffect, useState } from "react";

type Slot = {
  day: string;
  time: string;
};

type Props = {
  slot?: Slot | null;
  onClose: () => void;
};

function Event({ slot, onClose }: Props) {
  type FormData = {
    naam: string;
    info: string;
    leden: string;
    starttijd: string;
    eindtijd: string;
  };

  const [formData, setFormData] = useState<FormData>({
    naam: "",
    info: "",
    leden: "",
    starttijd: "",
    eindtijd: "",
  });

  // vul start/eind tijd als er een slot is (bv. "09:30" -> eind +1 uur)
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
      setFormData((prev) => ({ ...prev, starttijd: start, eindtijd: endStr }));
    } else {
      setFormData((prev) => ({ ...prev, starttijd: start }));
    }
  }, [slot]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // optional: read username from localStorage if available
    const creator_username = localStorage.getItem("username") ?? undefined;

    const payload: any = {
      naam: formData.naam,
      info: formData.info,
      leden: formData.leden,
      starttijd: formData.starttijd,
      eindtijd: formData.eindtijd,
    };
    if (creator_username) payload.creator_username = creator_username;

    try {
      const res = await fetch("http://localhost:5267/api/events/event-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 201 || res.ok) {
        const data = await res.json();
        alert("Event succesvol aangemaakt!");
        // optioneel: gebruik returned data (data.id) voor iets
        // reset form
        setFormData({
          naam: "",
          info: "",
          leden: "",
          starttijd: "",
          eindtijd: "",
        });
        onClose();
      } else {
        const err = await res.json().catch(() => null);
        const msg = err?.error ?? (await res.text());
        alert("Fout bij aanmaken event: " + msg);
      }
    } catch (error) {
      console.error(error);
      alert("Netwerkfout bij aanmaken event");
    }
  };

  return (
    <div>
      <div id="Eventheader">Event Aanmaken</div>

      <div id="form-wrapper">
        <form onSubmit={handleSubmit} className="event-form">
          <div id="form">
            <label>Naam</label>
            <input
              name="naam"
              value={formData.naam}
              onChange={handleChange}
              required
            />

            <label>Info</label>
            <textarea
              name="info"
              value={formData.info}
              onChange={handleChange}
            />

            <label>Leden (komma-gescheiden)</label>
            <input
              name="leden"
              value={formData.leden}
              onChange={handleChange}
              placeholder="jan,piet"
            />

            <label>Starttijd (ISO of HH:mm)</label>
            <input
              name="starttijd"
              value={formData.starttijd}
              onChange={handleChange}
              required
              placeholder="09:30 of 2025-12-01T09:30:00"
            />

            <label>Eindtijd (ISO of HH:mm)</label>
            <input
              name="eindtijd"
              value={formData.eindtijd}
              onChange={handleChange}
              required
              placeholder="10:30 of 2025-12-01T10:30:00"
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