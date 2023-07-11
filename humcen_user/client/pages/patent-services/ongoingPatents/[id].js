import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "@/styles/Patents.module.css";
import style from "@/styles/PageTitle.module.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import withAuth from "@/components/withAuth";
import Features from "./Features";
import BasicTabs from "./Tabs";

const  DynamicPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [job, setJob] = useState(null); // Initialize job state as null
  const [isComponentLoaded, setComponentLoaded] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin/job_order");
        const data = await response.json();

        // Find the specific job object you want to return
        const specificJob = data.find((job) => job._id.job_no === Number(id));

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
  }, [id]); // Add 'id' as a dependency

  console.log(job);

  if (!job) {
    return <div>No job found with the provided job number.</div>;
  }

  const {
    job_no,
    start_date,
    job_title,
    service,
    userName,
    partnerName,
    country,
    budget,
    status,
  } = job;

  // Format the start_date
  const formattedStartDate = new Date(start_date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Page title */}
      <div className={style.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Ongoing Patents</li>
          <li>Delivery status</li>
        </ul>
      </div>
      <h1>Ongoing Patents</h1>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <h1>{job_title}</h1>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            justifyContent="flex-end"
            textAlign="right"
          >
            <h2>
              <span className={styles.label1}>Job no : </span>
              {job._id.job_no}
            </h2>
          </Grid>
        </Grid>
        <Grid>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              padding: "10px",
            }}
          >
            <tbody>
              <tr>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Patent Type
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Customer Name
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Partner Name
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Location
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Budget
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Assigned
                </td>
                <td className={styles.label} style={{ padding: "10px" }}>
                  Status
                </td>
              </tr>
              <tr>
                <td style={{ padding: "10px" }}>{service}</td>
                <td style={{ padding: "10px" }}>{userName}</td>
                <td style={{ padding: "10px" }}>{partnerName}</td>
                <td style={{ padding: "10px" }}>{country}</td>
                <td style={{ padding: "10px" }}>{budget}</td>
                <td style={{ padding: "10px" }}>{formattedStartDate}</td>
                <td style={{ padding: "10px" }}>{status}</td>
              </tr>
              <tr>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}>
                  <Link href="/">Mail</Link>
                </td>
                <td style={{ padding: "10px" }}>
                  <Link href="/">Mail</Link>
                </td>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}></td>
                <td style={{ padding: "10px" }}></td>
              </tr>
            </tbody>
          </table>
        </Grid>
      </Card>
      <Features />
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
        }}
      >
        <Grid container spacing={2}>
          <BasicTabs />
        </Grid>
      </Card>
    </>
  );
}

export default withAuth(DynamicPage);