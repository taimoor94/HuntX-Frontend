import React from "react";

const FancyButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-8 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition duration-300 animate-pulse"
    >
      {text}
    </button>
  );
};

export default FancyButton;