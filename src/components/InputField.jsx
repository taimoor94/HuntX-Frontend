import React from "react";

const InputField = ({ label, type = "text", name, value, onChange, placeholder, required, className }) => {
  return (
    <div className="mb-6">
      {label && (
        <label className="block text-sm font-medium text-gray-200 dark:text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full p-4 bg-gray-800/50 dark:bg-gray-300/50 border border-gray-600 dark:border-gray-400 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${className}`}
      />
    </div>
  );
};

export default InputField;