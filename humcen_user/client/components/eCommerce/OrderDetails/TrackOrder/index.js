import React from "react";
import { useState,useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import styles from "@/components/eCommerce/OrderDetails/TrackOrder/TrackOrder.module.css";
import { useTransition, animated } from "react-spring";



const ActivityTimelineData = [
  {
    id: "1",
    title: "Order Placement",
    date: "April 14, 2023",
    completed: false,
  },
  {
    id: "2",
    title: "Invention Disclosure received",
    date: "April 14, 2023",
    completed: false,
  },
  {
    id: "3",
    title: "IP Partner Assigned",
    date: "April 14, 2023",
    completed: false,
  },
  {
    id: "4",
    title: "Payment",
    date: "April 15, 2023",
    completed: false,
  },
  {
    id: "5",
    title: "Draft Completed",
    date: "April 16, 2023",
    completed: false,
  },
  {
    id: "4",
    title: "Quality Check Completed",
    date: "April 16, 2023",
    completed: false,
  },
  {
    id: "5",
    title: "Draft Sent for Client Approval",
    date: "April 18, 2023",
    completed: false,
  },
  {
    id: "6",
    title: "Client Feedback",
    date: "April 19, 2023",
    completed: false,
  },
  {
    id: "7",
    title: "Revisions and Finalization",
    date: "April 20, 2023",
    completed: false,
  },
  {
    id: "8",
    title: "Final Draft Delivery",
    date: "April 21, 2023",
    completed: false,
  },
];



const TrackOrder = () => {
  const [timelineData, setTimelineData] = useState(ActivityTimelineData);

  const timelineTransitions = useTransition(timelineData, {
    key: (item) => item.id,
    from: { opacity: 0, transform: "translateX(-100%)" },
    enter: { opacity: 1, transform: "translateX(0%)" },
    leave: { opacity: 0, transform: "translateX(100%)" },
  });

  const handleProcessCompleted = (id) => {
    setTimelineData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, completed: true } : item
      )
    );
  };

  return (
    <>

      <Card
        sx={{
          boxShadow: "none",
          p: "15px",
          pr:"20px",
          mb: "20px",
          width:"100%",
        }}
      >
       <Box sx={{ padding: '5px', backgroundColor: '#F7FAFF',          borderRadius: "20px",
}}>
        <Typography
          as="h1"
          sx={{
            fontSize: "36",
            fontWeight: 500,
            mb: "20px",
            mt:"20px",
            ml:"10px",
          }}
        >
          Apple Watch: Design Patent
        </Typography>
      
        <ul className={styles.list}>
          <li>
            <h3 className={styles.emailheading}>Status</h3>
          </li>
          <li>
            <p className={styles.email} style={{paddingRight:"8px"}}>Verification Pending</p>
          </li>
        </ul>

        <hr className={styles.line} style={{ width: "100%" }}></hr>
        <ul className={styles.list}>
          <li>
            <h3 className={styles.emailheading}>Country</h3>
          </li>
          <li>
            <p className={styles.email} style={{paddingRight:"15px"}}>United Kingdom</p>
          </li>
        </ul>
        
        <hr className={styles.line} style={{ width: "100%" }}></hr>
        <ul className={styles.list}>
          <li>
            <h3 className={styles.emailheading}>Activity Timeline</h3>
          </li>
          <li>
            <p className={styles.email} style={{paddingRight:"20px"}}>
              Expected Completion
              April 18, 2023
            </p>
          </li>
        </ul>
        </Box>
        <div style={{ marginLeft: "30%",marginTop:"55px" }}>
          <div className={styles.timelineList}>
           {timelineTransitions((style, timeline) => (
            <animated.div
              style={{
                ...style,
                filter: timeline.completed ? "none" : "blur(1px)",
              }}
              key={timeline.id}
            >
              <div className={styles.tList}>
                <h4>{timeline.title}</h4>
                <p className={styles.date}>{timeline.date}</p>
                <p className={styles.text}>{timeline.text}</p>
              </div>
            </animated.div>
          ))}
          </div>
        </div>
      </Card>
    </>
  );
};

export default TrackOrder;
