import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TrackOrder from "@/components/eCommerce/OrderDetails/TrackOrder";
import StatusDialogueBox from "./statusDialog";
import JobDetails from "./jobDetails";

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
  


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function JobsTabs({ service, number }) {
  const [value, setValue] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {isMounted && (
        <Card
          sx={{
            boxShadow: "none",
            borderRadius: "10px",
            p: "25px",
            mb: "15px",
            width: "100%",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Job Details" {...a11yProps(0)} />
              
                <Tab label="Status" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <JobDetails services={service} jobNo={number}/>
            </TabPanel>
           
            <TabPanel value={value} index={1}>
            <StatusDialogueBox />
            </TabPanel>
          </Box>
        </Card>
      )}
    </>
  );
}
