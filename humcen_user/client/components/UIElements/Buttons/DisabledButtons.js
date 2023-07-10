import * as React from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const DisabledButtons = () => {
  return (
    <>
      <Button
        variant="contained"
        sx={{
          border: "1px solid #68BDFD",
          textTransform: "capitalize",
          borderRadius: "30px",
          mt: "10px",
          backgroundColor: "#DFF1FF",
          color: "#BDBDBD",
          p: "8px 23px", // Increased button width
          fontSize: "14px",
          fontWeight: "400", // Reduced font weight
          boxShadow: "none",
        }}
        className="mr-10px"
      >
        Join Meeting
      </Button>
    </>
  );
};

export default DisabledButtons;
