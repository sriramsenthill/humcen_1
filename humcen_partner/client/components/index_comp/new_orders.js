import React, { useState, useEffect } from "react";
import styles from "@/styles/Patents.module.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import axios from "axios";
import { styled } from "@mui/system";

function formatDate(date) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

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

    if (Array.isArray(jobOrders)) {
      const filteredJobOrders = jobOrders.filter(order => !order.Accepted);
      return filteredJobOrders;
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
  const [jobOrders, setJobOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filteredOrders = await fetchJobOrders();
        setJobOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching job orders:', error);
      }
    };

    fetchData();
  }, []);

  const handleAcceptJob = async (jobId) => {
    try {
      await api.put(`/accept/${jobId}`);
      window.location.reload();
    } catch (error) {
      console.error('Error accepting job order:', error);
    }
  };

  const handleRejectJob = async (jobId) => {
    try {
      await api.delete(`/reject/${jobId}`);
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting job order:', error);
    }
  };

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
            <thead>
              <tr>
                <th className={styles.label} style={{ padding: "5px" }}>
                  Job No
                </th>
                <th className={styles.label} style={{ padding: "5px" }}>
                  Patent Type
                </th>
                <th className={styles.label} style={{ padding: "5px" }}>
                  Location
                </th>
                <th className={styles.label} style={{ padding: "5px" }}>
                  Budget
                </th>
                <th className={styles.label} style={{ padding: "5px" }}>
                  Expected Delivery
                </th>
                <th className={styles.label} style={{ padding: "2px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {jobOrders.map((order) => (
                <tr key={order._id}>
                  <td className={styles.label} style={{ padding: "5px" }}>
                    {order._id.job_no}
                  </td>
                  <td className={styles.label} style={{ padding: "5px" }}>
                    {order.service}
                  </td>
                  <td className={styles.label} style={{ padding: "5px" }}>
                    {order.country}
                  </td>
                  <td className={styles.label} style={{ padding: "5px" }}>
                    {order.budget}
                  </td>
                  <td className={styles.label} style={{ padding: "5px" }}>
                    {formatDate(order.end_date)}
                  </td>
                  <td className={styles.label} style={{ padding: "2px" }}>
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
                      onClick={() => handleRejectJob(order._id.job_no)}
                    >
                      Reject
                    </Button>
                  </td>
                  <td>
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
                      onClick={() => handleAcceptJob(order._id.job_no)}
                    >
                      Accept
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Grid>
      </Card>
    </>
  );
};

export default NewOrder;
