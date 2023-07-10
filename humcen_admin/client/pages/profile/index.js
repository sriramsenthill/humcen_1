import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import RoundedButtons from "@/components/UIElements/Buttons/RoundedButtons";
import { useTheme } from "@mui/material/styles";
import styled from "@emotion/styled";
import Rating from "@mui/material/Rating";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Card, CardContent, Grid } from "@mui/material";

import { FormControlLabel } from "@mui/material";
import Switch from "@mui/material/Switch";
import LiveVisitsOnOurSite from "@/components/Dashboard/eCommerce/LiveVisitsOnOurSite";
import SimpleLineChart from "@/components/Pages/Charts/Recharts/LineChart/SimpleLineChart";
import withAuth from "@/components/withAuth";

const StyledRating = styled(Rating)({
  border: "none",
  "& .MuiRating-iconFilled": {
    border: "none",
    fontSize: "10",
  },
});

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 38,
  height: 20,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 18,
    height: 17,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#F14242" : "#27AE60",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const Impressions = () => {
  const theme = useTheme("");
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box
        sx={{
          background: "rgb(223, 241, 255, 0.4)",
          borderRadius: "10px",
          padding: "20px 25px",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: isScreenSmall ? "column" : "row",
        }}
        className="for-dark-impressions"
      >
        <Box
          sx={{
            width: isScreenSmall ? "100%" : "20%",
            alignItems: "center",
            textAlign: "center",
            borderRight: "1px solid #68BDFD",
          }}
        >
          <img src="/images/profile-photo.png" alt="Profile" />
          <Typography
            as="h2"
            sx={{
              color: "black",
              fontSize: 24,
              fontWeight: 700,
              mb: "5px",
              marginY: 1,
            }}
          >
            Lavender Lyric{" "}
          </Typography>
          <Typography
            as="p"
            sx={{
              color: "black",
              fontWeight: 400,
              mb: "5px",
              marginY: 1,
            }}
          >
            Texas, <br />
            United States
          </Typography>
          <StyledRating name="read-only" value="2.5" readOnly />
        </Box>
        <Box
          sx={{
            width: isScreenSmall ? "100%" : "75%",
            marginTop: isScreenSmall ? "30px" : "none",
            margin: "none",
          }}
        >
          <table
            style={{
              width: "100%",
              padding: "20px",
              borderCollapse: "separate",
              borderSpacing: "0px 10px",
            }}
          >
            <thead>
              <tr style={{ color: "#828282" }}>
                <th style={{ width: "25%", textAlign: "left" }}>
                  Date of Birth
                </th>
                <th style={{ width: "25%", textAlign: "left" }}>
                  Jurisdiction
                </th>
                <th style={{ width: "25%", textAlign: "left" }}>
                  Member Since
                </th>
                <th style={{ width: "25%", textAlign: "left" }}>User Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ width: "25%", textAlign: "left" }}>
                  20 March 1992
                </td>
                <td style={{ width: "25%", textAlign: "left" }}>
                  United States +3 more
                </td>
                <td style={{ width: "25%", textAlign: "left" }}>2005</td>
                <td style={{ width: "25%", textAlign: "left" }}>
                  <FormControlLabel
                    style={{
                      position: "relative",
                    }}
                    control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                  />
                </td>
              </tr>
              <tr style={{ color: "#828282" }}>
                <th style={{ width: "25%", textAlign: "left" }}>
                  Email Address
                </th>
                <th style={{ width: "25%", textAlign: "left" }}>Language</th>
                <th style={{ width: "25%", textAlign: "left" }}>
                  Patent Agent
                </th>
              </tr>
              <tr>
                <td style={{ width: "25%", textAlign: "left" }}>
                  lavenderlyric@gmail.com
                </td>
                <td style={{ width: "25%", textAlign: "left" }}>
                  English, Spanish, French
                </td>
                <td style={{ width: "25%", textAlign: "left" }}>Yes</td>
              </tr>
              <tr style={{ color: "#828282" }}>
                <th style={{ width: "25%", textAlign: "left" }}>
                  Phone Number
                </th>
                <th style={{ width: "25%", textAlign: "left" }}>
                  City and State
                </th>
                <th style={{ width: "25%", textAlign: "left" }}>Domain</th>
              </tr>
              <tr>
                <td style={{ width: "25%", textAlign: "left" }}>
                  +1 512 846 8567
                </td>
                <td style={{ width: "25%", textAlign: "left" }}>
                  Houston, Texas
                </td>
                <td style={{ width: "25%", textAlign: "left" }}>
                  Electrical & Electronics
                </td>
              </tr>
              <tr style={{ color: "#828282" }}>
                <th style={{ width: "25%", textAlign: "left" }}>
                  Years of Experience
                </th>
                <th style={{ width: "25%", textAlign: "left" }}>Country</th>
                <th style={{ width: "25%", textAlign: "left" }}>Expertise</th>
              </tr>
              <tr>
                <td style={{ width: "25%", textAlign: "left" }}>6 Years</td>
                <td style={{ width: "25%", textAlign: "left" }}>
                  United States
                </td>
                <td style={{ width: "25%", textAlign: "left" }}>
                  Patent Consultation
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <LiveVisitsOnOurSite />
        </Grid>
        <Grid item xs={12} md={5}>
          <SimpleLineChart />
        </Grid>
      </Grid>
    </>
  );
};

export default withAuth(Impressions);
