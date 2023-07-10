import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { FaRocket } from "react-icons/fa";

const Impression1 = () => {
  return (
    <>
      <Box
        sx={{
          background: "white",
          borderRadius: "10px",
          padding: "20px 25px",
          mb: "15px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          width="30%"
          alignContent="center"
          sx={{
            verticalAlign: "center",
            textAlign: "center center",
          }}
        >
          <FaRocket size="40" color="#FFB638" textDecoration="bold" />
        </Box>
        <Box width="70%">
          <Typography
            sx={{
              color: "black",
              fontSize: "24",
              fontWeight: "300",
            }}
          >
            New Customers On-boarded
          </Typography>
          <Typography
            as="h2"
            sx={{ color: "black", fontSize: 36, fontWeight: 300 }}
          >
            3,230
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Impression1;
