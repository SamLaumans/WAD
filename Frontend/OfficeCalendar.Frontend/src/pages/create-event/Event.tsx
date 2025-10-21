import React, { useState } from 'react';
import './Event.css';

function Event() {
  //zorgt dat alle types string zijn
  type FormData = {
    naam: string;
    info: string;
    leden: string;
    datum: string;
    tijd: string;
  };

  //zorgt ervoor dat formdata een state krijgt, hieronder wordt ook de basisstate gegeven
  const [formData, setFormData] = useState<FormData>({
    naam: '',
    info: '',
    leden: '',
    datum: '',
    tijd: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //de name van de field en de value die wordt ingevoerd door de gebruiker
    const { name, value } = e.target;

    //Hij maakt een kopie waarin hij de waarde voor specifieke velden veranderd waar de gebruiker data heeft ingevuld
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Event aangemaakt:', formData);
    alert('Event succesvol aangemaakt!');

    //reset de form data
    setFormData({
      naam: '',
      info: '',
      leden: '',
      datum: '',
      tijd: ''
    });
  };

  return (
    <div>
      <h1>Event Aanmaken</h1>

      <div id="form-wrapper">
        <form onSubmit={handleSubmit} className="event-form">
          <div id="form1">
            <label htmlFor="eventName">Naam van het event</label>
            <input
              type="text"
              id="eventName"
              name="naam"
              value={formData.naam}
              onChange={handleChange}
              required
            />

            <label htmlFor="eventInfo">Informatie over het event</label>
            <textarea
              id="eventInfo"
              name="info"
              rows={4}
              value={formData.info}
              onChange={handleChange}
              required
            />

            <label htmlFor="eventMembers">Leden van het event</label>
            <input
              type="text"
              id="eventMembers"
              name="leden"
              placeholder="Bijv. Jan, Petra, Mohammed"
              value={formData.leden}
              onChange={handleChange}
              required
            />
          </div>

          <div id="form2">
            <label htmlFor="eventDate">Datum van het event</label>
            <input
              type="date"
              id="eventDate"
              name="datum"
              value={formData.datum}
              onChange={handleChange}
              required
            />

            <label htmlFor="eventTime">Tijd van het event</label>
            <input
              type="time"
              id="eventTime"
              name="tijd"
              value={formData.tijd}
              onChange={handleChange}
              required
            />

            <button type="submit">Event Aanmaken</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Event;
