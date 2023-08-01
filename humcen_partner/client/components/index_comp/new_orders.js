import React, { useState, useEffect } from "react";
import styles from "@/styles/Patents.module.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import axios from "axios";
import Link from "@mui/material/Link";


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

  const handleRejectJob = async (jobId, service, country) => {
    try {
      await api.delete(`/reject/${service}/${country}/${jobId}`);
      window.location.reload(true);
    } catch (error) {
      console.error('Error rejecting job order:', error);
    }
  };

  if (jobOrders.length===0){
    return null
  }
  else{

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
        <h3 >New Order Requests</h3>
        <Grid>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate", 
            borderSpacing: "0 20px", 
              }}>
            <thead>
              <tr>
                <th className={styles.label} style={{ padding: "5px", textAlign: "left"}}>
                  Job No
                </th>
                <th className={styles.label} style={{ padding: "5px", textAlign: "left" }}>
                  Patent Type
                </th>
                <th className={styles.label} style={{ padding: "5px", textAlign: "left" }}>
                  Location
                </th>
                <th className={styles.label} style={{ padding: "5px" , textAlign: "left"}}>
                  Budget
                </th>
                <th className={styles.label} style={{ padding: "5px" , textAlign: "left"}}>
                  Expected Delivery
                </th>
                <th className={styles.label} style={{ padding: "2px" , position: "relative", left: "30px"}}>
                  Actions
                </th>
                <th className={styles.label} style={{ paddingLeft: "2px" ,position: "relative", left: "90px",}}>
                  Details
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
                        position: "relative",
                        right: "25px",
                        width: "100%",
                        height: "88%",
                        textTransform: "none",
                        "&:hover": {  
                          background: "linear-gradient(90deg,#00308F  0%, #7FFFD4 100%)",
                        },
                      }}
                      onClick={() => {window.location.reload(true); handleRejectJob(order._id.job_no, order.service, order.country)}}
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
                        position: "relative",
                        right: "25px",
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
                  <td>
                  <Link href={`onGoingPatents/${order._id.job_no}`} passHref>
                      <Button
                    sx={{
                      background: "#01ACF6",
                      color: "white",
                      borderRadius: "100px",
                      width: "100%",
                      height: "90%",
                      textTransform: "none",
                      position: "relative",
                      left: "10px",
                    }}
                  >
                        Details
                      </Button>
                      </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Grid>
      </Card>
    </>
  );
 }
};

export default NewOrder;