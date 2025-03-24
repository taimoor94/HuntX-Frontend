import React from "react";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  placeholder = "",
  className = "",
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-200 mb-2">{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full p-4 bg-gray-800/50 dark:bg-gray-700/50 border border-gray-600 dark:border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${className}`}
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default InputField;