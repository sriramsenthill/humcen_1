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
            <MenuItem value={"Patent Drafting"}>Patent Drafting</MenuItem>
            <MenuItem value={"Patent Filing"}>Patent Filing</MenuItem>
            <MenuItem value={"Patent Search"}>Patent Search</MenuItem>
            <MenuItem value={"Response to FER Office Action"}>Response to FER/Office Action</MenuItem>
            <MenuItem value={"Freedom To Operate"}>Freedom to Operate Search</MenuItem>
            <MenuItem value={"Freedom to Patent Landscape"}>Freedom To Patent Landscape</MenuItem>
            <MenuItem value={'Patent Portfolio Analysis'}>Freedom to Patent Portfolio Analysis</MenuItem>
            <MenuItem value={"Patent Translation Services"}>Patent Translation Service</MenuItem>
            <MenuItem value={"Patent Illustration"}>Patent Illustration</MenuItem>
            <MenuItem value={"Patent Watch"}>Patent Watch</MenuItem>
            <MenuItem value={"Patent Licensing and Commercialization Services"}>Patent Licensing and Commercialization Services</MenuItem>
          </Select>
        </FormControl>
     
    </>
  );
}
