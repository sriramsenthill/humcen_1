import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import MyIncome from "@/components/MyIncome";
import withAuth from "@/components/withAuth";
import axios from "axios";
import { useState,useEffect } from "react";
import { useRouter } from "next/router";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
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

function ContactList() {
  const [getJobs,setJobs]=useState('');


  
  const handleOk = () => {
    
    router.push("/");
  };

  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchJobOrders();
      setJobs(data);
    };

    fetchData();
  }, []);

  return (
    <>
    <div className={'card'}>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>My Income</li>
        </ul>
      </div>
      <br></br>
      {getJobs.length===0? <div
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
            <MyIncome />
          </div>:
      <MyIncome />
      }
      <br></br>
      </div>
      <Dialog open={getJobs.length===0}>
        <DialogTitle style={{ backgroundColor: "#00002B", color: "#fff", }}>No Income History!</DialogTitle>
        <DialogContent>
          <p style={{fontSize:"14px"}}>No income history present for this account.</p>
        </DialogContent>  
        <DialogActions>
          <Button onClick={handleOk} style={{ color: "#00ACF6",fontSize:"14px" }}>OK</Button>
        </DialogActions>
      </Dialog> 
    </>
  );
}

export default withAuth(ContactList);