import React from "react";
import Event from "./Event";
import "./EventModal.css";

type Props = {
  show: boolean;
  onClose: () => void;
};

const EventModal: React.FC<Props> = ({ show, onClose }) => {
  if (!show) return null; // verberg de modal als show = false

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          close
        </button>
        <Event />
      </div>
    </div>
  );
};

export default EventModal;