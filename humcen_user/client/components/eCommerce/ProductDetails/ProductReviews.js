import React from "react";
import Grid from "@mui/material/Grid";

import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const ProductReviews = () => {
  const theme = useTheme("");
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <>
      <Box
        sx={{
          background: "white",
          borderRadius: "10px",
          padding: "10px 10px",
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
                <th style={{ width: "25%", textAlign: "left" }}>Office</th>
                <th style={{ width: "25%", textAlign: "left" }}>
                  Application Number
                </th>
                <th style={{ width: "25%", textAlign: "left" }}>
                  Application Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ width: "25%", textAlign: "left" }}>
                  European Patent Office
                </td>
                <td style={{ width: "25%", textAlign: "left" }}>13846062</td>
                <td style={{ width: "25%", textAlign: "left" }}>15.05.2013</td>
              </tr>
              <tr style={{ color: "#828282" }}>
                <th style={{ width: "25%", textAlign: "left" }}>
                  Publication Number
                </th>
                <th style={{ width: "25%", textAlign: "left" }}>
                  Publication Date
                </th>
                <th style={{ width: "25%", textAlign: "left" }}>
                  Publication Kind
                </th>
              </tr>
              <tr>
                <td style={{ width: "25%", textAlign: "left" }}>2908281</td>
                <td style={{ width: "25%", textAlign: "left" }}>19.08.2015</td>
                <td style={{ width: "25%", textAlign: "left" }}>A4</td>
              </tr>
              <tr style={{ color: "#828282" }}>
                <th style={{ width: "25%", textAlign: "left" }}>IPC</th>
                <th style={{ width: "25%", textAlign: "left" }}>CPC</th>
                <th style={{ width: "25%", textAlign: "left" }}>Applicants</th>
              </tr>
              <tr>
                <td style={{ width: "25%", textAlign: "left" }}>
                  G06Q 50/10, G06Q 30/02
                </td>
                <td style={{ width: "25%", textAlign: "left" }}>
                  G06Q 30/0623, G06Q 30/0639,
                  <br />
                  G06Q 30/0625
                </td>
                <td style={{ width: "25%", textAlign: "left" }}>
                  KANEKO KAZUO
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Box>
    </>
  );
};

export default ProductReviews;
