/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Select, Input } from "antd";

const { Option } = Select;

const CustomSelect = ({ captions, onChange, value }) => {
  const [options, setOptions] = useState(captions);

  const handleSearch = (input) => {
    if (!input) {
      setOptions(captions);
    } else if (!captions.includes(input)) {
      setOptions([...captions, input]);
    }
  };

  const handleChange = (value) => {
    if (!captions.includes(value)) {
      setOptions([...captions, value]);
    }
    onChange(value);
  };

  return (
    <Select
      showSearch
      value={value}
      placeholder="Select or type a custom caption"
      style={{ width: "100%" }}
      onSearch={handleSearch}
      onChange={handleChange}
      filterOption={(input, option) =>
        option?.children.toLowerCase().includes(input.toLowerCase())
      }
    >
      {options.map((caption, idx) => (
        <Option key={idx} value={caption}>
          {caption}
        </Option>
      ))}
    </Select>
  );
};

export default CustomSelect;
