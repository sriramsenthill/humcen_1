import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { CiTimer } from "react-icons/ci";

const Impression1 = () => {
  return (
    <>
      <Box
        sx={{
          background:
            "linear-gradient(104.54deg, #00ACF6 -38.83%, #01ADF5 52.84%, #02E1B9 127.84%)",
          backgroundBlendMode: "multiply",
          borderRadius: "10px",
          padding: "20px 25px",
          mb: "15px",
          display: "flex",
          flexDirection: "row",
        }}
        className="for-dark-impressions"
      >
        <Box
          width="30%"
          alignContent="center"
          sx={{
            verticalAlign: "center",
            textAlign: "center center",
          }}
        >
          <CiTimer size="40" color="white" textDecoration="bold" />
        </Box>
        <Box width="70%">
          <Typography
            sx={{
              color: "white",
              fontSize: "24",
              fontWeight: "300",
            }}
          >
            Patent Currently in Progress
          </Typography>
          <Typography
            as="h2"
            sx={{ color: "#fff", fontSize: 36, fontWeight: 300 }}
          >
            028
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Impression1;
