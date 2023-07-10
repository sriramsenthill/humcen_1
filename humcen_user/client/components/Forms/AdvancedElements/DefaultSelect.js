import React from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function DefaultSelect({ domain, onDomainChange }) {
  const handleChange = (event) => {
    const value = event.target.value;
    onDomainChange(value);
  };

  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
        }}
      >
        <Typography
          as="h3"
          sx={{
            fontSize: 18,
            fontWeight: 500,
            mb: "10px",
          }}
        >
          Select your domain
        </Typography>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Domain</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={domain}
            label="Domain"
            onChange={handleChange}
          >
            <MenuItem value={"Finance"}>Finance</MenuItem>
            <MenuItem value={"Tech"}>Tech</MenuItem>
            <MenuItem value={"Creativity"}>Creativity</MenuItem>
          </Select>
        </FormControl>
      </Card>
    </>
  );
}
