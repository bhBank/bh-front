// src/components/FloatingIcons.js
import React from "react";
import { FaPhoneAlt, FaRegCommentDots, FaMapMarkerAlt } from "react-icons/fa";
import "./FloatingIcons.css";

function FloatingIcons() {
  return (
    <div className="floating-icons">
      <a href="tel:+21612345678" className="icon-circle" title="Appeler">
        <FaPhoneAlt />
      </a>
      <a href="#reclamation" className="icon-circle" title="Réclamation">
        <FaRegCommentDots />
      </a>
      <a href="#localisation" className="icon-circle" title="Localisation">
        <FaMapMarkerAlt />
      </a>
    </div>
  );
}

export default FloatingIcons;  