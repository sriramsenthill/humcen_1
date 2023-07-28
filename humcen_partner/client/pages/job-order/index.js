import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import RecentOrders from "@/components/Dashboard/eCommerce/RecentOrders";
import withAuth from "@/components/withAuth";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@mui/material";

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
            <li>Job Order</li>
          </ul>
        </div>
        {getJobs.length === 0 ? null : ( // Add curly braces here
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
    </>
  );
}

export default withAuth(Inbox);
