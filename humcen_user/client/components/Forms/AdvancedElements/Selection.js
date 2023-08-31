import React from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectBulk({ domain, onDomainChange }) {
  const handleChange = (event) => {
    const value = event.target.value;
    onDomainChange(value);
  };

  return (
    <>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Selection</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={domain}
            label="Domain"
            onChange={handleChange}
          >
            <MenuItem value={"Biochemistry"}>Biochemistry</MenuItem>
            <MenuItem value={"Biotechnology"}>Biotechnology</MenuItem>
            <MenuItem value={"Biomedical Engineering"}>Biomedical Engineering</MenuItem>
            <MenuItem value={"Chemistry"}>Chemistry</MenuItem>
            <MenuItem value={"Civil Engineering"}>Civil Engineering</MenuItem>
            <MenuItem value={"Computer & IT Engineering"}>Computer & IT Engineering</MenuItem>
            <MenuItem value={"Electrical & Electronics"}>Electrical & Electronics</MenuItem>
            <MenuItem value={"Mechanical"}>Mechanical</MenuItem>
            <MenuItem value={"Metallurgical"}>Metallurgical</MenuItem>
            <MenuItem value={"Physics"}>Physics</MenuItem>
            <MenuItem value={"Polymer"}>Polymer</MenuItem>
            <MenuItem value={"Textile"}>Textile</MenuItem>
            <MenuItem value={"Others"}>Others</MenuItem>
          </Select>
        </FormControl>
     
    </>
  );
}
