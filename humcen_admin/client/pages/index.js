import React from "react";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import Impression1 from "@/components/Dashboard/eCommerce/Impression1";
import Impression2 from "@/components/Dashboard/eCommerce/Impression2";
import Impression3 from "@/components/Dashboard/eCommerce/Impression3";
import Impression4 from "@/components/Dashboard/eCommerce/Impression4";
import NewCustomers from "@/components/Dashboard/eCommerce/NewCustomers";
import BasicTabs from "@/components/UIElements/Tabs/BasicTabs";
import withAuth from "@/components/withAuth";
import { useState,useEffect } from "react";
import axios from "axios";



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

const eCommerce = () => {

  
    const [profileName,setName] = useState(null);
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        axios
          .get("http://localhost:3000/api/admin/settings", {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => {
            const nameData = response.data;
            console.log(nameData)
            setName(nameData.name+" "+nameData.surname);
          })
          .catch((error) => {
            console.error("Error fetching profile name:", error);
          });
      }
    }, []);
console.log(profileName)


  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <h1
          style={{
            fontStyle: "normal",
            fontWeight: "800",
            fontSize: "24px",
            lineHeight: "29px",
          }}
        >
          Hey {profileName},
        </h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>home</li>
        </ul>
      </div>
      <p style={{ textAlign: "left", fontSize: "18" }}>
        We have some quick updates for you today!
      </p>

      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
        <Grid item xs={12} md={12} lg={12}>
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={3}>
                <Impression1 />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Impression2 />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Impression3 />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Impression4 />
              </Grid>
            </Grid>
          </Grid>
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={12} lg={12} xl={9}>
                <BasicTabs />
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={3}>
                <NewCustomers />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default withAuth(eCommerce)