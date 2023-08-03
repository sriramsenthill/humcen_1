import {React, useState, useEffect} from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import styles from "@/components/eCommerce/OrderDetails/TrackOrder/TrackOrder.module.css";
import { useTransition, animated } from "react-spring";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});


// Add an interceptor to include the token in the request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});


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
    id: "6",
    title: "Quality Check Completed",
    date: "April 16, 2023",
    completed: false,
  },
  {
    id: "7",
    title: "Draft Sent for Client Approval",
    date: "April 18, 2023",
    completed: false,
  },
  {
    id: "8",
    title: "Client Feedback",
    date: "April 19, 2023",
    completed: false,
  },
  {
    id: "9",
    title: "Revisions and Finalization",
    date: "April 20, 2023",
    completed: false,
  },
  {
    id: "10",
    title: "Final Draft Delivery",
    date: "April 21, 2023",
    completed: false,
  },
];

const TrackOrder = () => {
  const [timelineData, setTimelineData] = useState(ActivityTimelineData);
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(null);
  const [stepsNo, setSteps] = useState(null);

  useEffect(() => {
    const fetchStepData = async () => {
      try {
        const response = await api.get(`partner/jobs/${id}`);
        const jobData = response.data;
       setJob(jobData);
        const stepCount = jobData.steps_done_activity; // For choosing the last Step done
        setSteps(stepCount);
        const dates = jobData.date_activity;
        for(let totalDates=0; totalDates<dates.length; totalDates++) {
          ActivityTimelineData[totalDates].date = dates[totalDates];
        }
        const updatedTimelineData = ActivityTimelineData.map((timeline) => {
          if (parseInt(timeline.id) <= stepCount) {
            return { ...timeline, completed: true };
          } else {
            return { ...timeline, completed: false };
          }
        });
        setTimelineData(updatedTimelineData);
      } catch (error) {
        console.error("Error fetching job order data:", error);
        
      }
    };

    fetchStepData();
    

  }, [id, stepsNo]);

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
       <Box sx={{ padding: '5px', backgroundColor: '#FFF' ,borderRadius: "20px",}} className={styles.containerBox}>
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
          Service: {job?.service}
        </Typography>
      
        <ul className={styles.list}>
          <li>
            <h3 className={styles.emailheading}>Status</h3>
          </li>
          <li>
            <p className={styles.email} style={{paddingRight:"8px"}}> {job?.status}</p>
          </li>
        </ul>

        <hr className={styles.line} style={{ width: "100%" }}></hr>
        <ul className={styles.list}>
          <li>
            <h3 className={styles.emailheading}>Country</h3>
          </li>
          <li>
            <p className={styles.email} style={{paddingRight:"15px"}}>{job?.country}</p>
          </li>
        </ul>
        
        <hr className={styles.line} style={{ width: "100%" }}></hr>
        <ul className={styles.list}>
          <li>
            <h3 className={styles.emailheading}>Activity Timeline</h3>
          </li>
          <li>
            <p className={styles.email} style={{paddingRight:"20px"}}>
            Excepted Completion Date: 
              {ActivityTimelineData[9].date}
            </p>
          </li>
        </ul>
        </Box>
        <div style={{ marginLeft: "30%",marginTop:"55px" }}>
          <div className={styles.timelineList}>
              {timelineTransitions((style, timeline) => (
                <div className={`${styles.tList} ${timeline.completed ? styles.completed : styles.notCompleted}`}>
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
