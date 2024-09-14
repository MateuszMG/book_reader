"use client";
import React, { useState } from "react";
import { Cascader, CascaderProps } from "antd";

interface NestedSelectProps {
  onChange: (value: string[]) => void;
}

const createChaptersData = (number: number) =>
  Array.from(Array(number)).map((_, i) => ({
    value: "v" + (i + 1),
    label: "Rozdział " + (i + 1) + " -- -- -- ",
  }));

const options: CascaderProps["options"] = [
  {
    value: "PsychologiaDlaBystrz",
    label: "Psych...DlaB",
    children: createChaptersData(19),
  },
];

const NestedSelect: React.FC<NestedSelectProps> = ({ onChange }) => {
  const [value, setValue] = useState<string[]>();

  const handleChange = (value: any) => {
    setValue(value);
    onChange?.(value);
  };

  return (
    <Cascader
      options={options}
      onChange={handleChange}
      placeholder="Please select"
      value={value}
      style={{ width: "180px" }}
    />
  );
};

export default NestedSelect;

{
  /* <Select
          placeholder="Select a book"
          style={{ width: 200, marginBottom: "24px" }}
          onChange={handleBookChange}
          value={selectedBook}
        >
          <Option value="en">en</Option>
          <Option value="smallTextPL">smallTextPL</Option>
          <Option value="smallTextEN">smallTextEN</Option>
          <Option value="DEIR3_1">DEIR3_1</Option>
          <Option value="DEIR3_2">DEIR3_2</Option>
          <Option value="DEIR3_3">DEIR3_3</Option>
          <Option value="DEIR3_4">DEIR3_4</Option>
          <Option value="DEIR3_5">DEIR3_5</Option>
          <Option value="PsychologiaDlaBystrz/v1">v1</Option>
          <Option value="PsychologiaDlaBystrz/v2">v2</Option>
          <Option value="PsychologiaDlaBystrz/v3">v3</Option>
          <Option value="PsychologiaDlaBystrz/v4">v4</Option>
          <Option value="PsychologiaDlaBystrz/v5">v5</Option>
          <Option value="PsychologiaDlaBystrz/v6">v6</Option>
          <Option value="PsychologiaDlaBystrz/v7">v7</Option>
          <Option value="PsychologiaDlaBystrz/v8">v8</Option>
          <Option value="PsychologiaDlaBystrz/v9">v9</Option>
          <Option value="PsychologiaDlaBystrz/v10">v10</Option>
          <Option value="PsychologiaDlaBystrz/v11">v11</Option>
          <Option value="PsychologiaDlaBystrz/v12">v12</Option>
          <Option value="PsychologiaDlaBystrz/v13">v13</Option>
          <Option value="PsychologiaDlaBystrz/v14">v14</Option>
          <Option value="PsychologiaDlaBystrz/v15">v15</Option>
          <Option value="PsychologiaDlaBystrz/v16">v16</Option>
          <Option value="PsychologiaDlaBystrz/v17">v17</Option>
          <Option value="PsychologiaDlaBystrz/v18">v18</Option>
          <Option value="PsychologiaDlaBystrz/v19">v19</Option>
        </Select> */
}
