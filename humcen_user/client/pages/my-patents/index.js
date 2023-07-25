import React from "react";
import styles from "@/styles/PageTitle.module.css";
import RecentOrders from "@/components/Dashboard/eCommerce/RecentOrders";
import SearchForm from "@/components/_App/TopNavbar/SearchForm";
import withAuth from "@/components/withAuth";
import { Card } from "@mui/material";
import axios from "axios";
import { useState, useEffect} from "react";
const api = axios.create({
  baseURL: "http://localhost:3000/",
});

// Add an interceptor to include the token in the request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

const Inbox = () => {
  const [checkJobs,setCheckJobs]=useState(null)
  
  const customerDataResponse = async () => {
    try {
      const response = await api.get("/");
      const customerData = response.data;
      console.log("Customer Data:", customerData);
      setCheckJobs(customerData.length);
      // Process the customer data as needed
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };
  customerDataResponse();
  return (
    <>
    <div className={'card'}>
      {/* Page title */}
      <div className={styles.pageTitle} style={{
          justifyContent: "space-between",
          paddingBottom: "20px" ,
          // marginLeft: "1%",
      }}>
        <h1>My Patents</h1>
        <SearchForm colorCom={"white"} />
      </div>
      {checkJobs===0?"No Patents Found" :
      <Card sx={{
}} >   
        <RecentOrders sx={{
}}></RecentOrders>
      </Card>
      }
      </div>
    </>
  );
}

export default withAuth(Inbox);
