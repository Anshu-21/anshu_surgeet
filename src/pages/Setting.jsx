import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Settings = () => {
  const { setBackgroundStyle } = useOutletContext();

  const backgroundOptions = [
    {
      name: 'Default',
      style: 'linear-gradient(to bottom right, #1F2937, #111827, #000000)',
    },
    {
      name: 'Sunset',
      style: 'linear-gradient(to right, #ff7e5f, #feb47b)',
    },
    {
      name: 'Purple Glow',
      style: 'linear-gradient(to right, #7f00ff, #e100ff)',
    },
    {
      name: 'Forest',
      style: 'linear-gradient(to right, #134e5e, #71b280)',
    },
    {
      name: 'Cool Blues',
      style: 'linear-gradient(to right, #2193b0, #6dd5ed)',
    },
  ];

  const changeBackground = (style) => {
    setBackgroundStyle(style);
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center ">
      <h1 className="text-4xl font-bold mt-10 animate-pulse">Settings</h1>
      <div className="mt-10 p-6 w-full max-w-4xl bg-gray-800 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Background Changer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {backgroundOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => changeBackground(option.style)}
              className="w-full py-4 rounded-lg text-white"
              style={{
                background: option.style,
              }}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
