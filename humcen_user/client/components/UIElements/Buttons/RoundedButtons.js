import * as React from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const RoundedButtons = () => {
  return (
    <>
      <Button
        variant="contained"
        sx={{
          textTransform: "capitalize",
          borderRadius: "30px",
          mt: "10px",
          backgroundColor: "#2F80ED",
          color: "#fff",
          p: "12px 55px", // Increased button width
          fontSize: "14px",
          fontWeight: "400", // Reduced font weight
          boxShadow: "none",
        }}
        className="mr-10px"
      >
        View Details
      </Button>
    </>
  );
};

export default RoundedButtons;
