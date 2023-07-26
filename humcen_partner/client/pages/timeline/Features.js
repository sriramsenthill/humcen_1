import {React, useState, useEffect} from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = [
  "Completed Drafts submitted",
  "IP Partner Assigned",
  "Payment Received",
  "Quality Check Completed",
  "Draft Sent for Client Approval",
  "Delivered",
];

export default function Features() {

  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
          // mt:"50px",
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
          Patent Program Oversight
        </Typography>

        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={3} alternativeLabel className="direction-ltr">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  {label}
                  <br />
                  14th May 2023
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Card>
    </>
  );
}
