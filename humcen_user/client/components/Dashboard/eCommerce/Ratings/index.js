import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import NewCustomers from "../NewCustomers";
import DisabledButtons from "@/components/UIElements/Buttons/DisabledButtons";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VideocamIcon from "@mui/icons-material/Videocam";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PublicIcon from "@mui/icons-material/Public";

const Ratings = () => {
  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "40px 150px",
          mb: "15px",
          backgroundColor: "#ECFCFF",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            marginTop: "30px",
            marginLeft: "15px",
          }}
        >
          <NewCustomers />
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            marginTop: "13px",
            marginRight: "20px",
          }}
        >
          <DisabledButtons />
        </Box>

        <Box
          sx={{
            marginTop: "80px",
            marginLeft: "-130px", // Adjust the top margin to create space below other elements
          }}
        >
          <table
            style={{
              width: "130%",
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: "600",
              fontSize: "16px",
              lineHeight: "150%",
              letterSpacing: "-0.03em",
              borderSpacing: "20px",
            }}
          >
            <thead>
              <tr style={{ color: "#828282", fontWeight: "500" }}>
                <td style={{ textAlign: "left" }}>
                  <CalendarTodayIcon />
                  &nbsp;10:00 a.m. - 10.30 a.m. Friday, May 5, 2023
                </td>
                <td style={{ textAlign: "left" }}>
                  <VideocamIcon />
                  &nbsp;Web Conferencing link will be highlighted before meeting
                </td>
              </tr>
            </thead>
            <tbody>
              <tr style={{ color: "#828282", fontWeight: "500" }}>
                <td style={{ textAlign: "left" }}>
                  <AccessTimeIcon />
                  0:30 minutes
                </td>
                <td style={{ textAlign: "left" }}>
                  <PublicIcon />
                  India Standard Time
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Card>
    </>
  );
};

export default Ratings;
