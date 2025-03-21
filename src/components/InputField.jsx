import React from "react";

const InputField = ({ label, type, placeholder, name, value, onChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-semibold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg bg-gray-50 shadow-inner border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 hover:shadow-md"
      />
    </div>
  );
};

export default InputField;