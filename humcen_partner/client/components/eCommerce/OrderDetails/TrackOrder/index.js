import React from "react";
import { Box, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import styles from "@/components/eCommerce/OrderDetails/TrackOrder/TrackOrder.module.css";

const ActivityTimelineData = [
  {
    id: "1",
    title: "Order Placement",
    date: "April 14, 2023",
  },
  {
    id: "2",
    title: "Invention Disclosure received",
    date: "April 14, 2023",
  },
  {
    id: "3",
    title: "IP Partner Assigned",
    date: "April 14, 2023",
  },
  {
    id: "4",
    title: "Payment",
    date: "April 15, 2023",
  },
  {
    id: "5",
    title: "Draft Completed",
    date: "April 16, 2023",
  },
  {
    id: "4",
    title: "Quality Check Completed",
    date: "April 16, 2023",
  },
  {
    id: "5",
    title: "Draft Sent for Client Approval",
    date: "April 18, 2023",
  },
  {
    id: "6",
    title: "Client Feedback",
    date: "April 19, 2023",
  },
  {
    id: "7",
    title: "Revisions and Finalization",
    date: "April 20, 2023",
  },
  {
    id: "8",
    title: "Final Draft Delivery",
    date: "April 21, 2023",
  },
];

const TrackOrder = () => {
  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px 100px",
          mb: "15px",
        }}
      >
        <Typography
          as="h1"
          sx={{
            fontSize: "36",
            fontWeight: 500,
            mb: "20px",
          }}
        >
          Apple Watch: Design Patent
        </Typography>

        <ul className={styles.list}>
          <li>
            <h3 className={styles.emailheading}>Status</h3>
          </li>
          <li>
            <p className={styles.email}>Verification Pending</p>
          </li>
        </ul>
        <hr className={styles.line} style={{ width: "100%" }}></hr>
        <ul className={styles.list}>
          <li>
            <h3 className={styles.emailheading}>Country</h3>
          </li>
          <li>
            <p className={styles.email}>United Kingdom</p>
          </li>
        </ul>
        <hr className={styles.line} style={{ width: "100%" }}></hr>
        <ul className={styles.list}>
          <li>
            <h3 className={styles.emailheading}>Activity Timeline</h3>
          </li>
          <li>
            <p className={styles.email}>
              Expected Completion
              <br /> April 18, 2023
            </p>
          </li>
        </ul>
        <div style={{ marginLeft: "30%" }}>
          <div className={styles.timelineList}>
            {ActivityTimelineData.slice(0, 10).map((timeline) => (
              <div className={styles.tList} key={timeline.id}>
                <h4>{timeline.title}</h4>
                <p className={styles.date}>{timeline.date}</p>
                <p className={styles.text}>{timeline.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
};

export default TrackOrder;
