import {React, useState, useEffect} from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});


// Add an interceptor to include the token in the request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});

let steps = [
  "Completed Drafts submitted",
  "IP Partner Assigned",
  "Payment Received",
  "Quality Check Completed",
  "Draft Sent for Client Approval",
  "Delivered",
];

export default function Features() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [stepsNo, setSteps] = useState(null);
  const [text, setStepsText] = useState(steps);

  useEffect(() => {
    const fetchStepData = async () => {
      try {
        const response = await api.get(`job_order/${id}`);
        const job = response.data;
        console.log(job);
        const stepCount = job.steps_done_user;        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        setSteps(stepCount); // For choosing the last Step done
        setFinalDate(new Date(job.end_date).toLocaleDateString(undefined, options));
        const updatedSteps = [...steps]; // Create a copy of the current steps array
        updatedSteps[5] = "Patent Filled Success (" + finalDate + ")";
        setStepsText(updatedSteps);
      } catch (error) {
        console.error("Error fetching job order data:", error);
        setJob(null);
      }
    };

    fetchStepData();
    

  }, [id, stepsNo]);

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
          <Stepper activeStep={stepsNo} alternativeLabel className="direction-ltr">
            {text.map((label) => (
              <Step key={label}>
                <StepLabel>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Card>
    </>
  );
}
