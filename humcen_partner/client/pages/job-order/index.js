import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import RecentOrders from "@/components/Dashboard/eCommerce/RecentOrders";
import withAuth from "@/components/withAuth";
import { useState, useEffect } from "react";
import axios from "axios"; // Import useHistory hook for redirection
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { Card } from "@mui/material";
import { useRouter } from "next/router";
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
    const { jobOrders } = response.data; // Extract the jobOrders array from the response data
    console.log(jobOrders)
    if (Array.isArray(jobOrders)) {
      const filteredJobOrders = jobOrders.filter(order => order.Accepted === true);
      // console.log(filteredJobOrders);
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

function Inbox() {
  const [getJobs, setJobs] = useState('');
 
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchJobOrders();
      setJobs(data);
    };

    fetchData();
  }, []);

  const handleOk = () => {
    
    router.push("/");
  };

 

  return (
    <>
      <div className={'card'}>
        {/* Page title */}
        <div className={styles.pageTitle}>
          <ul>
            <li>
              <Link href="/">Dashboard</Link>
            </li>
            <li>Job Order</li>
          </ul>
        </div>
        {getJobs.length === 0 ?   <>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.5)", // Change the alpha value to adjust the level of blur
                backdropFilter: "blur(1px)", // Adjust the blur value as needed
                pointerEvents: "none", // Prevent the overlay from blocking clicks on elements underneath
              }}
            >
            </div>
            <RecentOrders />
          </div>
          </>: ( // Add curly braces here
          <><Card>
            <h1 className={styles.heading2} style={{
              marginBottom: "30px",
              marginTop: "10px",
              marginLeft: "12px"
            }}>My Job orders</h1>
            <RecentOrders />
            </Card>
          </>
        )}
      </div>
      <Dialog open={getJobs.length===0}>
        <DialogTitle style={{ backgroundColor: "#00002B", color: "#fff" }}>No Jobs!</DialogTitle>
        <DialogContent>
          <p  style={{fontSize:"14px"}}>No job orders found for this account.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOk} style={{ color: "#00ACF6",fontSize:"14px" }}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default withAuth(Inbox);
