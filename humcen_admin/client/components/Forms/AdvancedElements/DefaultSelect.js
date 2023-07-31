import React from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function DefaultSelect() {
  const [filter, setFilter] = React.useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setFilter(value);
   // Call the onChange callback function with the selected value
  };

  return (
    <>
      <FormControl
        sx={{
          height: "50%",
          width: "10%",
          borderRadius: "40%",
          margin: "none",
        }}
      >
        <InputLabel id="">All Patents</InputLabel>
        <Select
          labelId=""
          id=""
          value={filter}
          onChange={handleChange}
          style={{
            height: "50%",
            marginLeft: "0",
          }}
        >
          <MenuItem value={"All Patents"}>All Patents</MenuItem>
          <MenuItem value={"Sort by date"}>Sort by date</MenuItem>
          <MenuItem value={"Sort by completion"}>Sort by completion</MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
