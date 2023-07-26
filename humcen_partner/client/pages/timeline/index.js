import React from "react";
import Link from "next/link";
import styles from "@/styles/Patents.module.css";
import style from "@/styles/PageTitle.module.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { jobData } from "../onGoingPatents/patentData";
import Features from "./Features";
import BasicTabs from "../onGoingPatents/Tabs";
import withAuth from "@/components/withAuth";

const PatentDeliveryStatus = ({ jobNumber }) => {
  const job = jobData.find((job) => job.jobNumber === "DEF456");

  if (!job) {
    return <div>No job found with the provided job number.</div>;
  }

  const {
    jobName,
    patentType,
    customerName,
    partnerName,
    location,
    budget,
    assigned,
    status,
  } = job;

  return (
    <>
    <div className={'card'}>
      {/* Page title */}
      <div className={style.pageTitle}>
        <h1>Ongoing Patents</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Ongoing Patents</li>
          <li>Delivery status</li>
        </ul>
      </div>
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
            <h1>Figma To Adobe XD: Design Patent</h1>
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
              {job.jobNumber}
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
                <td style={{ padding: "10px" }}>{patentType}</td>
                <td style={{ padding: "10px" }}>{customerName}</td>
                <td style={{ padding: "10px" }}>{partnerName}</td>
                <td style={{ padding: "10px" }}>{location}</td>
                <td style={{ padding: "10px" }}>{budget}</td>
                <td style={{ padding: "10px" }}>{assigned}</td>
                <td style={{ padding: "10px" }}>{status}</td>
              </tr>
            </tbody>
          </table>
        </Grid>
      </Card>
      {/* side stepper component */}
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
      </div>
    </>
  );
};

export default withAuth(PatentDeliveryStatus);
