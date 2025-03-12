import React, { useState } from 'react';

const Dropdown = () => {
  const [inputValue, setInputValue] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const items = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setDropdownVisible(true);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setInputValue(item);
    setDropdownVisible(false);
  };

  return (
    <div className="flex flex-col items-center w-full px-4 sm:px-8 lg:px-16">
      <div className="relative w-full max-w-md">
        {/* Input Field */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setDropdownVisible(true)}
          placeholder="Select or type..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />

        {/* Dropdown */}
        {dropdownVisible && (
          <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-40 overflow-auto">
            {items
              .filter((item) =>
                item.toLowerCase().includes(inputValue.toLowerCase())
              )
              .map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectItem(item)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {item}
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Selected Value */}
      {selectedItem && (
        <div className="mt-4 text-gray-600">
          <strong>Selected:</strong> {selectedItem}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
