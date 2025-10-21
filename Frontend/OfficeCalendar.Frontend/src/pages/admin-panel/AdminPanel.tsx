import React from 'react';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
    const addEvent = () => {
        alert("Formulier voor 'Event Toevoegen' opent hier.");
    };

    const editEvent = () => {
        alert("Selecteer een event om aan te passen.");
    };

    const deleteEvent = () => {
        const confirmDelete = confirm("Weet je zeker dat je een event wilt verwijderen?");
        if (confirmDelete) {
            alert("Event verwijderd.");
        }
    };

    return (
        <div className="admin-container">
            <h1>Agenda Admin</h1>

            <div className="admin-panel">
                <button className="btn btn-add" onClick={addEvent}>
                    Event Toevoegen
                </button>
                <button className="btn btn-edit" onClick={editEvent}>
                    Event Aanpassen
                </button>
                <button className="btn btn-delete" onClick={deleteEvent}>
                    Event Verwijderen
                </button>
            </div>
        </div>
    );
};

export default AdminPanel;
