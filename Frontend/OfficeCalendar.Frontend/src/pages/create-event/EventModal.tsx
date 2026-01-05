import React from "react";
import Event from "./Event";
import "./EventModal.css";

type Slot = {
  day: string;
  time: string;
  date: string;
};

type Props = {
  show: boolean;
  onClose: () => void;
  slot?: Slot;
  position?: { top: number; left: number } | null;
  onEventCreated?: () => void;
};

const EventModal: React.FC<Props> = ({ show, onClose, slot, position, onEventCreated }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-floating"
        style={{
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          position: "fixed",
        }}
      >
        <div className="event-modal-content">
          <button className="event-modal-close-button" onClick={onClose}>
            ×
          </button>

          {slot && (
            <p>
              Event voor <b>{slot.day}</b> om <b>{slot.time}</b>
            </p>
          )}

          <Event slot={slot} onClose={onClose} onEventCreated={onEventCreated} />
        </div>
      </div>
    </div>
  );
};

export default EventModal;
