import React from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { a } from "react-spring";


export default function PartnerSelect({ partner, onPartnerChange, availablePartners }) {
  const handleChange = (event) => {
    const value = event.target.value;
    onPartnerChange(value);
  };

  return (
    <>
    {console.log(availablePartners)}
        <FormControl style={{
          width: "50%",
          textAlign: "center",
        }}>
          <InputLabel id="demo-simple-select-label">Partners</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Partners"
            value={partner}
            onChange={handleChange}
          >
            {availablePartners.map((partners) => (
              <MenuItem key={partners.uid} value={partners.uid}>{partners.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
     
    </>
  );
}
