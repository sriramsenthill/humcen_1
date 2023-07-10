import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import RecentOrders from "@/components/Dashboard/eCommerce/RecentOrders";
import RecentPartners from "@/components/Dashboard/eCommerce/RecentPartner";
import RecentUsers from "@/components/Dashboard/eCommerce/RecentUser";
import RecentAdmins from "@/components/Dashboard/eCommerce/RecentAdmin";

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

export default function BasicTabs({ no, items }) {
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
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Partners" {...a11yProps(0)} />
                <Tab label="Users" {...a11yProps(1)} />
                <Tab label="Recent Orders" {...a11yProps(2)} />
                <Tab label="Admin" {...a11yProps(3)} />

              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
             <RecentPartners />
            </TabPanel>
            <TabPanel value={value} index={1}>
            <RecentUsers/>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <RecentOrders />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <RecentAdmins />
            </TabPanel>
          </Box>
        </Card>
      )}
    </>
  );
}
