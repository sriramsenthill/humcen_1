import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import RoundedButtons from "@/components/UIElements/Buttons/RoundedButtons";
import Ratings from "./Ratings";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Impressions = () => {
  const theme = useTheme("");
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box
        sx={{
          background: "white",
          borderRadius: "10px",
          padding: "20px 25px",
          mb: "15px",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: isScreenSmall ? "column" : "row",
        }}
        className="for-dark-impressions"
      >
        <Box sx={{ width: isScreenSmall ? "100%" : "40%" }}>
          <Typography
            color="black"
            fontSize="13px"
            mb="5px"
            style={{
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: "300",
              fontSize: "20px",
              lineHeight: "24px",
              display: "flex",
              alignItems: "center",
              color: "#343434",
            }}
          >
            Patent Consultation Online Consultation in
          </Typography>

          <Typography
            as="h2"
            sx={{
              color: "black",
              fontSize: 36,
              fontWeight: 700,
              mb: "5px",
              marginY: 1,
            }}
          >
            02 Days{" "}
          </Typography>
          <div style={{ width: "100%", marginTop: "20px" }}>
            <table style={{ width: "100%" }}>
              <thead>
                <tr style={{ color: "#828282" }}>
                  <th style={{ width: "25%", textAlign: "left" }}>
                    Patent Type
                  </th>
                  <th style={{ width: "25%", textAlign: "left" }}>Location</th>
                  <th style={{ width: "25%", textAlign: "left" }}>Budget</th>
                  <th style={{ width: "25%", textAlign: "left" }}>
                    Submitted Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: "25%", textAlign: "left" }}>
                    Patent Consultation
                  </td>
                  <td style={{ width: "25%", textAlign: "left" }}>Australia</td>
                  <td style={{ width: "25%", textAlign: "left" }}>AUD 3000</td>
                  <td style={{ width: "25%", textAlign: "left" }}>
                    12 Apr 2022
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: "10px" }}>
            <RoundedButtons />
          </div>
        </Box>
        <Box
          sx={{
            width: isScreenSmall ? "100%" : "50%",
            marginTop: isScreenSmall ? "30px" : "none",
          }}
        >
          <Ratings />
        </Box>
      </Box>
    </>
  );
};

export default Impressions;
