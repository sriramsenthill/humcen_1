import React from "react";
import Link from "next/link";
import styles from "@/styles/Patents.module.css";
import axios from "axios";
import style from "@/styles/PageTitle.module.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Box } from "@mui/material";
import { useState,useEffect } from "react";
import { useRouter } from "next/router";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { jobData } from "../../components/patentData";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/system";
import { OpenInBrowserOutlined } from "@mui/icons-material";

const ColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  width: "120%",
  height: "60px",
  borderRadius: "100px",
  marginBottom: "30px",
  background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
  "&:hover": {
    background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
  },
  textTransform: "none",
  fontSize: "14px",
  fontWeight: "400",
}));


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

const Invoice = ({jobNumber}) => {
 

  const [job, setJob] = useState(null); 

  const router = useRouter();
  const { id } = router.query;
  console.log(id)

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await api.get(`/job_order/${id}`);
        const specificJob = response.data;
        console.log(specificJob)

        if (specificJob) {
          setJob(specificJob);
        } else {
          console.log("No job found with the provided job number:", id);
          setJob(null);
        }
      } catch (error) {
        console.error("Error fetching job order data:", error);
        setJob(null);
      }
    };

    fetchJobData();

    // Clean up the effect by resetting the job state when the component is unmounted
    return () => {
      setJob(null);
    };
  }, [id]);

  console.log(job)
  
  if (!job) {
    return <div>No job found with the provided job number.</div>;
  }

  const {
    job_no,
    start_date,
    job_title,
    service,
    customerName,
    partnerName,
    country,
    budget,
    status,
  } = job;


  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          border: "1px solid #00000033",
          p: "1% 1%",
          mt:'45px',
          mb: "15px",
          width: "100%",
        }}
      >
        <Grid>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              <tr>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Job No
                </td>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Patent Type
                </td>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Location
                </td>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Budget
                </td>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Status
                </td>
                <td
                  className={styles.label}
                  style={{ padding: "5px" }}
                  rowSpan={2}
                >
                  <Button
                    sx={{
                      background: "#00ACF6",
                      color: "white",
                      borderRadius: "40px",
                      width: "90%",
                      height: "80%",
                      textTransform: "none",
                    }}
                  >
                    Pay Invoice
                  </Button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>{id}</td>
                <td style={{ padding: "5px" }}>{service}</td>
                <td style={{ padding: "5px" }}>{country}</td>
                <td style={{ padding: "5px" }}>{budget}</td>
                <td style={{ padding: "5px" }}>{status}</td>
              </tr>
            </tbody>
          </table>
        </Grid>
      </Card>
    
    </>
  );
};

export default Invoice;