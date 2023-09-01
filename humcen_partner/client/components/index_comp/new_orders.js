import React, { useState, useEffect } from "react";
import styles from "@/styles/Patents.module.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import axios from "axios";
import Link from "@mui/material/Link";
import { filter } from "jszip";


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
    const jobOrders  = response.data;
    console.log("This is it " + jobOrders);

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
  const [exceeded, setExcJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [partnerID, setPartnerID] = useState("");
  const [idle, setIdle] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filteredOrders = await fetchJobOrders();
        const now = new Date().getTime();
        
        const timeList = [];
        const time = [];
        const customers = [];
        filteredOrders.forEach((order) => {
          const shown = {}; 
          if(((now - new Date(order.start_date).getTime())/1000) > 10800) { // 10800 Seconds = 3 Hours
            timeList.push(order.og_id);
            customers.push(order.userID);
            setPartnerID(order.partnerID);
            time.push(((now - new Date(order.start_date).getTime())/1000));
          } else {
            time.push(((now - new Date(order.start_date).getTime())/1000));
          }
        })
        setExcJobs(timeList);
        setUsers(customers);
        setIdle(time);
        setJobOrders(filteredOrders.filter((order) => !timeList.includes(order.og_id)));
        console.log(jobOrders.length);
      } catch (error) {
        console.error('Error fetching job orders:', error);
      }
    };

    fetchData();
  }, []);
  
console.log(exceeded, idle);

const handleIdleJobs = async(jobs, ID) => {
  try {
    const response = await api.put(`/idle-job/${ID}`, { idleJobs: jobs, customers: users}).then(() => {
      console.log("Idle Jobs notified to API successfully");
    }).catch((error) => {
      console.error("Error in handling the Idle Job : " + error);
    });
  } catch(err) {
    console.error("Error in handling Idle Jobs : " + err);
  }
}

if (exceeded.length !== 0) {
  handleIdleJobs(exceeded, partnerID);
}

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
                <th className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px", }}>
                  Job No
                </th>
                <th className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px", }}>
                  Patent Type
                </th>
                <th className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px",}}>
                  Location
                </th>
                <th className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px", }}>
                  Budget
                </th>
                <th className={styles.label} style={{ padding: "10px", fontWeight: "bold", textAlign: "center", fontSize: "16px", }}>
                  Expected Delivery
                </th>
                <th className={styles.label} style={{ padding: "2px" , position: "relative", left: "30px", fontWeight:"bold", fontSize: "16px", textAlign: "center"}}>
                  Actions
                </th>
                <th className={styles.label} style={{ paddingLeft: "2px" ,position: "relative", left: "90px", fontWeight:"bold", fontSize: "16px", textAlign: "center"  }}>
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {jobOrders.map((order) => (             
                <tr key={order._id}> 
                  <td className={styles.label} style={{ padding: "10px", textAlign:"center", fontWeight: "bold", fontSize: "15px",  }}>
                    {order._id.job_no}
                  </td>
                  <td className={styles.label} style={{ padding: "10px", textAlign:"center", fontWeight: "bold", fontSize: "15px",  }}>
                    {order.service}
                  </td>
                  <td className={styles.label} style={{ padding: "10px", textAlign:"center", fontSize: "13.5px", }}>
                    {order.country}
                  </td>
                  <td className={styles.label} style={{ padding: "10px", textAlign:"center", fontSize: "13.5px", }}>
                    {order.budget}
                  </td>
                  <td className={styles.label} style={{ padding: "10px", textAlign:"center", fontSize: "13.5px", }}>
                    {formatDate(order.end_date)}
                  </td>
                  <td className={styles.label} style={{ padding: "10px", textAlign:"center", fontSize: "13.5px", }}>
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
                          background: "linear-gradient(90deg, #FF0000 0%, #FF6347 100%)",
                        },                        
                      }}
                      onClick={() => {handleRejectJob(order.og_id, order.service, order.country); window.location.reload(true); }}
                    >
                      Deny
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
                      onClick={() => handleAcceptJob(order.og_id)}
                    >
                      Accept
                    </Button>
                  </td>
                  <td style={{textAlign:"center", fontSize: "13.5px", }}>
                  <Link href={`onGoingPatents/${order.og_id}`} passHref>
                      <Button
                    sx={{
                      background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
                      color: "white",
                      borderRadius: "100px",
                      width: "100%",
                      height: "90%",
                      textTransform: "none",
                      position: "relative",
                      left: "10px",
                      marginRight: "30px",
                      marginLeft: "-20px"
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