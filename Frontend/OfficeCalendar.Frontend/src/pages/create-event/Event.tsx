import React, { useState } from 'react';
import './Event.css';

function Event() {
  //zorgt dat alle types string zijn
  type FormData = {
    naam: string;
    info: string;
    leden: string;
    starttijd: string;
    eindtijd: string;
  };

  //zorgt ervoor dat formdata een state krijgt, hieronder wordt ook de basisstate gegeven
  const [formData, setFormData] = useState<FormData>({
    naam: '',
    info: '',
    leden: '',
    starttijd: '',
    eindtijd: ''
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
      starttijd: '',
      eindtijd: ''
    });
  };

  return (
    <div>
      <div id="Eventheader">Event Aanmaken</div>

      <div id="form-wrapper">
        <form onSubmit={handleSubmit} className="event-form">
          <div id="form">
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

            <label htmlFor="eventStartTime">Start tijd van het event</label>
            <input
              type="time"
              id="eventStartTime"
              name="start tijd"
              value={formData.datum}
              onChange={handleChange}
              required
            />

            <label htmlFor="eventEndTime">Eind tijd van het event</label>
            <input
              type="time"
              id="eventEndTime"
              name="eind tijd"
              value={formData.tijd}
              onChange={handleChange}
              required
            />

            <button className="event-button" type="submit">Event Aanmaken</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Event;
