import React from "react";
import styles from "@/styles/Patents.module.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add an interceptor to include the token in the request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});



async function fetchJobOrders() {
  try {
    const response = await api.get('/partner/job_order');
    const { jobOrders } = response.data;
    // console.log(jobOrders); // Extract the jobOrders array from the response data

    if (Array.isArray(jobOrders)) {
      return jobOrders;
    } else {
      console.error('Invalid data format: Expected an array');
      return [];
    }
  } catch (error) {
    console.error('Error fetching job orders:', error);
    return [];
  }
}
const NewOrder = () => {
  return (
    <>
      <Card 
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          border: "1px solid #E0E0E0",
          p: "0.2% 1.5% 1.5% 1.5%",
          mb: "15px",
          width: "100%",
        }}
      >
        <h3>New Order Requests</h3>
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
                  Expected Delivery
                </td>
                <td
                  className={styles.label}
                  style={{ padding: "2px" }}
                  rowSpan={2}
                >
                  <Button
                    sx={{
                      background: "#D3D3D3",
                      color: "white",
                      borderRadius: "100px",
                      width: "100%",
                      height: "88%",
                      textTransform: "none",
                      "&:hover": {  
                        background: "linear-gradient(90deg,#00308F  0%, #7FFFD4 100%)",
                      },
                    }}
                  >
                    Reject
                  </Button>
                </td>
                <td
                  className={styles.label}
                  style={{ padding: "2px" }}
                  rowSpan={2}
                >
                  <Button
                    sx={{
                      background: "#27AE60", 
                      color: "white",
                      borderRadius: "100px",
                      width: "100%",
                      height: "88%",
                      textTransform: "none",
                      "&:hover": {
                        background: "linear-gradient(90deg, #5F9EA0 0%, #7FFFD4 100%)",
                      },
                    }}
                  >
                    Accept
                  </Button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>1001</td>
                <td style={{ padding: "5px" }}>Patent Drafting</td>
                <td style={{ padding: "5px" }}>United Kingdom</td>
                <td style={{ padding: "5px" }}>300000</td>
                <td style={{ padding: "5px" }}>12 Apr 2023</td>
              </tr>
            </tbody>
          </table>
        </Grid>
      </Card>
    </>
  );
};

export default NewOrder;
