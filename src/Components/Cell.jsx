import React from 'react';

const Cell = ({ id, value, isInitial, onChange }) => {
  const handleChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      onChange(value, id);
    }
  };

  return (
    <input
      type="text"
      className={`w-14 h-14 flex items-center text-center shadow-xl font-serif font-bold justify-center text-black text-2xl border-2 ${getBoxClass(id)} ${isInitial ? 'text-white' : 'text-black'}`}
      value={value === 0 ? '' : value}
      onChange={handleChange}
      maxLength="1"
      disabled={isInitial}
    />
  );
};

const getBoxClass = (id) => {
    const boxColors = [
            'bg-blue-900', 'bg-orange-900', 'bg-green-900',
            'bg-blue-900', 'bg-orange-900', 'bg-green-900',
            'bg-blue-900', 'bg-orange-900', 'bg-green-900',
          ];

  const row = Math.floor(id / 9);
  const col = id % 9;
  const blockIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);

  return `${boxColors[blockIndex]} ${getBorderClass(id)}`;
};

const getBorderClass = (id) => {
  let borderClass = '';
  if (id % 9 === 0) borderClass += ' border-l-4';
  if (id % 3 === 2) borderClass += ' border-r-4';
  if (Math.floor(id / 9) % 3 === 2) borderClass += ' border-b-4';
  if (id < 9) borderClass += ' border-t-4';
  return borderClass;
};

export default Cell;